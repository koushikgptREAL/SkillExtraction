import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import multer from "multer";
import { requireAuth, clerkMiddleware } from "@clerk/express";

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
      const parsed = await pdfParse(file.buffer);
      const text = parsed.text || "";

      const skillsDict = [
        "javascript","typescript","python","java","react","node","express","postgres","sql","aws","docker","kubernetes","git","tailwind","next.js","redux"
      ];
      const found: { name: string; category: string; confidence: number }[] = [];
      for (const term of skillsDict) {
        const regex = new RegExp(`\\b${term.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
        if (regex.test(text)) {
          found.push({ name: term, category: "Detected", confidence: 85 });
        }
      }

      sess.plan.used += 1;
      res.json({ textLength: text.length, skills: found });
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
