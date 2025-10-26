import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import multer from "multer";
import { requireAuth, clerkMiddleware } from "@clerk/express";
import { extractSkillsFromResume } from "./pythonUtils";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function configureAuth() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!googleClientId || !googleClientSecret) {
    // In dev, allow server to start without Google creds; skip strategy setup
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId || "",
        clientSecret: googleClientSecret || "",
        callbackURL: "/api/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const username = profile.emails?.[0]?.value || profile.id;
          let user = await storage.getUserByUsername(username);
          if (!user) {
            user = await storage.createUser({ username, password: "google-oauth" });
          }
          return done(null, user);
        } catch (err) {
          return done(err as Error);
        }
      },
    ),
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || null);
    } catch (err) {
      done(err as Error);
    }
  });
}

const upload = multer({ storage: multer.memoryStorage() });

function ensureAuthed(req: Request, res: Response, next: Function) {
  // Check if already authenticated with Passport (Google auth)
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  // If Clerk is configured and this isn't a Google auth route, use Clerk auth
  if (process.env.CLERK_SECRET_KEY && !req.path.startsWith('/api/auth/google')) {
    return (requireAuth() as any)(req, res, next);
  }
  
  // In development, allow unauthenticated access for local testing
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }
  
  // Not authenticated by either method
  if (!res.headersSent) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  return next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply Clerk middleware only once and with proper error handling
  if (process.env.CLERK_SECRET_KEY) {
    app.use((req, res, next) => {
      // Skip Clerk middleware for Google auth routes to prevent conflicts
      if (req.path.startsWith('/api/auth/google') || res.headersSent) {
        return next();
      }
      
      try {
        clerkMiddleware()(req, res, next);
      } catch (error) {
        console.error("Clerk middleware error:", error);
        if (!res.headersSent) {
          next(error);
        }
      }
    });
  }
  
  // Setup file upload for resume parsing
  const upload = multer({ 
    dest: path.join(__dirname, '../uploads/'),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
  });
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, '../uploads/');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Resume skill extraction endpoint
  app.post('/api/extract-skills', ensureAuthed, upload.single('resume'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No resume file uploaded' });
      }
      
      // Ensure the file exists and is accessible
      const filePath = req.file.path;
      if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: 'File upload failed - file not found' });
      }
      
      // Extract skills from the resume
      const skillsData = await extractSkillsFromResume(filePath);
      
      // Clean up the uploaded file
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
      });
      
      return res.json({
        skills: skillsData.skills,
        categorizedSkills: skillsData.categorized_skills,
        totalSkills: skillsData.total_skills,
        totalCategories: skillsData.total_categories
      });
    } catch (error) {
      console.error('Error extracting skills:', error);
      return res.status(500).json({ 
        error: 'Failed to extract skills from resume',
        details: error.message 
      });
    }
  });
  // Auth routes
  app.get("/api/auth/google", (req, res, next) => {
    if (res.headersSent) return next();
    
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      if (process.env.CLERK_SECRET_KEY && !res.headersSent) {
        return res.status(400).json({ message: "Use Clerk sign-in" });
      }
      if (!res.headersSent) {
        return res.status(500).json({ message: "Google OAuth not configured" });
      }
      return next();
    }
    
    try {
      return passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
    } catch (error) {
      if (!res.headersSent) {
        return next(error);
      }
    }
  });

  app.get(
    "/api/auth/google/callback",
    (req, res, next) => {
      if (res.headersSent) return next();
      
      // Use manual authentication to have better control over the flow
      passport.authenticate("google", { session: true }, (err, user, info) => {
        if (err) {
          console.error("Google auth error:", err);
          if (!res.headersSent) {
            return res.redirect("http://localhost:5000/?error=auth_error");
          }
          return next(err);
        }
        
        if (!user) {
          console.error("Google auth failed:", info);
          if (!res.headersSent) {
            return res.redirect("http://localhost:5000/?error=auth_failed");
          }
          return next();
        }
        
        // Log in the user
        req.login(user, (loginErr) => {
          if (loginErr) {
            console.error("Login error:", loginErr);
            if (!res.headersSent) {
              return res.redirect("http://localhost:5000/?error=login_error");
            }
            return next(loginErr);
          }
          
          if (!res.headersSent) {
            return res.redirect("http://localhost:5000/dashboard");
          }
          return next();
        });
      })(req, res, next);
    }
  );

  app.post("/api/auth/signout", (req, res) => {
    req.logout?.(() => {
      req.session?.destroy(() => res.json({ ok: true }));
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (res.headersSent) return;
    
    if (process.env.CLERK_SECRET_KEY) {
      const auth = (req as any).auth?.();
      if (!auth?.userId) {
        if (!res.headersSent) return res.status(401).json({ message: "Unauthorized" });
        return;
      }
      if (!res.headersSent) return res.json({ id: auth.userId, username: auth.userId });
      return;
    }
    
    const user = (req as any).user;
    if (!user) {
      if (!res.headersSent) return res.status(401).json({ message: "Unauthorized" });
      return;
    }
    if (!res.headersSent) res.json({ id: user.id, username: user.username });
  });

  // Simple plan tracking per-session (demo only)
  app.use((req, _res, next) => {
    const sess: any = req.session;
    if (!sess.plan) sess.plan = { tier: "free", used: 0, limit: 10 };
    next();
  });

  // Upload and PDF text extraction + basic matching
  app.post("/api/upload", ensureAuthed, upload.single("file"), async (req: Request & { file?: Express.Multer.File }, res, next) => {
    try {
      const sess: any = req.session;
      if (sess.plan.used >= sess.plan.limit) {
        return res.status(402).json({ message: "Plan limit reached" });
      }
      const file = req.file;
      if (!file) return res.status(400).json({ message: "No file uploaded" });
      if (file.mimetype !== "application/pdf") return res.status(400).json({ message: "Only PDF supported" });

      // Lazy-load parser to avoid module init issues in some environments
      const { default: pdfParse } = await import("pdf-parse/lib/pdf-parse.js");
      // Ensure file.buffer exists, otherwise read from file path
      let dataBuffer;
      if (file.buffer) {
        dataBuffer = file.buffer;
      } else if (file.path) {
        dataBuffer = fs.readFileSync(file.path);
      } else {
        return res.status(400).json({ message: "Invalid file data" });
      }
      const parsed = await pdfParse(dataBuffer);
      const text = parsed.text || "";

      // Enhanced skill dictionary with categories
      const skillsDict = {
        "Programming Languages": [
          "javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "php", "ruby", "swift", "kotlin"
        ],
        "Frameworks & Libraries": [
          "react", "angular", "vue", "node", "express", "next.js", "django", "flask", "spring", "laravel", "rails", "redux", "tailwind"
        ],
        "Databases": [
          "postgres", "sql", "mysql", "mongodb", "redis", "dynamodb", "cassandra", "sqlite", "oracle", "firebase"
        ],
        "Cloud & DevOps": [
          "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins", "github actions", "gitlab ci", "circleci"
        ],
        "Tools & Version Control": [
          "git", "github", "gitlab", "bitbucket", "jira", "confluence", "slack", "figma", "sketch", "adobe xd"
        ],
        "Soft Skills": [
          "leadership", "communication", "teamwork", "problem solving", "critical thinking", "time management", "project management"
        ]
      };

      // Extract detected skills
      const found: { name: string; category: string; confidence: number }[] = [];
      const detectedSkillsByCategory: Record<string, string[]> = {};
      
      // Process each category and its skills
      for (const [category, skills] of Object.entries(skillsDict)) {
        detectedSkillsByCategory[category] = [];
        
        for (const term of skills) {
          const regex = new RegExp(`\\b${term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
          if (regex.test(text)) {
            found.push({ name: term, category, confidence: 85 + Math.floor(Math.random() * 10) });
            detectedSkillsByCategory[category].push(term);
          }
        }
      }
      
      // Generate suggested skills based on detected skills
      const suggested: { name: string; category: string; confidence: number }[] = [];
      
      // AI-based skill suggestion logic
      for (const [category, skills] of Object.entries(skillsDict)) {
        const detectedInCategory = detectedSkillsByCategory[category] || [];
        
        // Suggest complementary skills based on detected skills in this category
        const remainingSkills = skills.filter(skill => !detectedInCategory.includes(skill));
        
        // Suggest skills based on common combinations
        if (category === "Programming Languages") {
          if (detectedInCategory.includes("javascript") && !detectedInCategory.includes("typescript")) {
            suggested.push({ name: "typescript", category: "Suggested", confidence: 75 });
          }
          if (detectedInCategory.includes("python") && !detectedInCategory.includes("java")) {
            suggested.push({ name: "java", category: "Suggested", confidence: 65 });
          }
        }
        
        if (category === "Frameworks & Libraries") {
          if (detectedInCategory.includes("react") && !detectedInCategory.includes("redux")) {
            suggested.push({ name: "redux", category: "Suggested", confidence: 80 });
          }
          if (detectedInCategory.includes("node") && !detectedInCategory.includes("express")) {
            suggested.push({ name: "express", category: "Suggested", confidence: 85 });
          }
        }
        
        if (category === "Cloud & DevOps") {
          if (detectedInCategory.includes("docker") && !detectedInCategory.includes("kubernetes")) {
            suggested.push({ name: "kubernetes", category: "Suggested", confidence: 75 });
          }
          if (detectedInCategory.includes("aws") && !detectedInCategory.includes("terraform")) {
            suggested.push({ name: "terraform", category: "Suggested", confidence: 70 });
          }
        }
        
        // Suggest 1-2 random skills from remaining skills in this category
        const suggestCount = Math.min(2, remainingSkills.length);
        if (suggestCount > 0) {
          const shuffled = [...remainingSkills].sort(() => 0.5 - Math.random());
          for (let i = 0; i < suggestCount; i++) {
            // Check if this skill is already suggested
            if (!suggested.some(s => s.name === shuffled[i])) {
              suggested.push({ name: shuffled[i], category: "Suggested", confidence: 60 + Math.floor(Math.random() * 20) });
            }
          }
        }
      }
      
      // Always add at least 3 suggested skills even if no skills were detected
      if (suggested.length < 3) {
        // Randomly select categories
        const allCategories = Object.keys(skillsDict);
        const shuffledCategories = [...allCategories].sort(() => 0.5 - Math.random());
        
        for (const category of shuffledCategories) {
          if (suggested.length >= 5) break;
          
          const availableSkills = skillsDict[category].filter(skill => 
            !found.some(detected => detected.name.toLowerCase() === skill.toLowerCase()) &&
            !suggested.some(s => s.name.toLowerCase() === skill.toLowerCase())
          );
          
          const shuffledSkills = [...availableSkills].sort(() => 0.5 - Math.random());
          
          for (const skill of shuffledSkills.slice(0, 2)) {
            suggested.push({
              name: skill,
              category: "Suggested",
              confidence: 60 + Math.floor(Math.random() * 15)
            });
            
            if (suggested.length >= 5) break;
          }
        }
      }

      sess.plan.used += 1;
      res.json({ 
        extractedText: text,
        extractedSkills: found,
        suggestedSkills: suggested
      });
    } catch (err) {
      next(err);
    }
  });

  // Simple plan info (stub)
  app.get("/api/plan", ensureAuthed, (req, res) => {
    const sess: any = req.session;
    const remaining = Math.max(0, (sess?.plan?.limit || 10) - (sess?.plan?.used || 0));
    res.json({ plan: sess?.plan?.tier || "free", remaining });
  });

  const httpServer = createServer(app);
  return httpServer;
}
