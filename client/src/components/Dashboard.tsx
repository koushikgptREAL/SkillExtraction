import { useState } from "react";
import AuthButton from "./AuthButton";
import FileUpload from "./FileUpload";
import SkillsDisplay, { type SkillCategory } from "./SkillsDisplay";
import ThemeToggle from "./ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Brain, Target, TrendingUp, Award, Shield, Code } from "lucide-react";

interface DashboardProps {
  user?: { name: string; email: string; avatar?: string } | null;
  onSignOut?: () => void;
}

export default function Dashboard({ user, onSignOut }: DashboardProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<SkillCategory[] | null>(null);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    setIsComplete(false);
    
    // Show loading screen only - no skills during processing
    setExtractedSkills(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to extract skills');
      }

      const data = await response.json();
      
      // Use the data directly from the upload endpoint which includes suggested skills
      handleUploadResult(data);
    } catch (error) {
      console.error('Error extracting skills:', error);
      setIsProcessing(false);
    }
  };

  const handleUploadResult = (result: { 
    extractedText: string; 
    extractedSkills: { name: string; category: string; confidence: number; source?: string }[];
    suggestedSkills?: { name: string; category: string; confidence: number }[];
  }) => {
    setIsProcessing(false);
    setIsComplete(true);
    
    console.log("Upload result:", result);
    
    // Make sure we have skills to display
    const allSkills = result.extractedSkills || [];
    
    // Only use Python skills for display
    const pythonSkills = allSkills.length > 0 
      ? allSkills.filter(s => s.source === 'python' || !s.source)
      : [{ name: "Example Skill", category: "Programming Languages", confidence: 90, source: 'python' }];
    
    // Create a map of Python skills for quick lookup
    const pythonSkillsMap = new Map();
    pythonSkills.forEach(skill => {
      pythonSkillsMap.set(skill.name.toLowerCase(), {
        name: skill.name,
        category: skill.category || "Programming Languages",
        confidence: skill.confidence,
        source: 'python'
      });
    });
    
    // Get TypeScript skills that are not in Python skills - these will be suggestions
    const typescriptSkills = result.extractedSkills.filter(s => 
      s.source === 'typescript' && 
      !pythonSkillsMap.has(s.name.toLowerCase())
    );
    
    // Create categories based on Python skills
    const categoriesMap = new Map();
    
    // Process Python skills and group by category
    pythonSkills.forEach(skill => {
      const category = skill.category || "Python";
      
      if (!categoriesMap.has(category)) {
        categoriesMap.set(category, []);
      }
      
      categoriesMap.get(category).push({
        name: skill.name,
        category: category,
        confidence: skill.confidence,
        source: 'python'
      });
    });
    
    // Convert categories map to array
    const mapped: SkillCategory[] = [];
    
    // Add all Python skill categories
    categoriesMap.forEach((skills, category) => {
      mapped.push({
        name: category,
        icon: FileText,
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
        skills: skills
      });
    });
    
    // Add TypeScript skills as suggestions
    if (typescriptSkills.length > 0) {
      mapped.push({
        name: "Suggested Skills",
        icon: Target,
        color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
        skills: typescriptSkills.map(s => ({ 
          name: s.name, 
          category: "Suggested", 
          confidence: s.confidence,
          source: 'typescript'
        }))
      });
    }
    
    // If we have additional suggested skills from the backend, add those too
    if (result.suggestedSkills && result.suggestedSkills.length > 0) {
      // Get existing skill names to avoid duplicates
      const existingSkillNames = new Set([
        ...Array.from(pythonSkillsMap.keys()),
        ...typescriptSkills.map(s => s.name.toLowerCase())
      ]);
      
      const uniqueSuggestedSkills = result.suggestedSkills
        .filter(s => !existingSkillNames.has(s.name.toLowerCase()))
        .map(s => ({ 
          name: s.name, 
          category: "Suggested", 
          confidence: s.confidence 
        }));
      
      if (uniqueSuggestedSkills.length > 0) {
        // If we already have a Suggested Skills category, add to it
        const suggestedIndex = mapped.findIndex(c => c.name === "Suggested Skills");
        if (suggestedIndex >= 0) {
          mapped[suggestedIndex].skills = [
            ...mapped[suggestedIndex].skills,
            ...uniqueSuggestedSkills
          ];
        } else {
          // Otherwise create a new category
          mapped.push({
            name: "Suggested Skills",
            icon: Target,
            color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
            skills: uniqueSuggestedSkills
          });
        }
      }
    }
    
    setExtractedSkills(mapped);
  };

  const handleReset = () => {
    setUploadedFile(null);
    setIsProcessing(false);
    setIsComplete(false);
    setExtractedSkills(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold">ResumeSkills</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <AuthButton user={user} onSignOut={onSignOut} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-muted/20 pointer-events-none rounded-3xl" />
            <div className="relative">
              <Badge variant="outline" className="mb-4">
                Professional Analysis Dashboard
              </Badge>
              <h2 className="text-4xl font-bold mb-4">
                AI-Powered Skill Extraction
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Upload your resume for comprehensive skill analysis using enterprise-grade AI. 
                Get detailed insights, categorized results, and optimization recommendations.
              </p>
            </div>
          </div>


          {/* Upload Section */}
          <div className="flex justify-center">
            <FileUpload
              onFileUpload={handleFileUpload}
              onUploadResult={handleUploadResult}
              isProcessing={isProcessing}
              isComplete={isComplete}
              onReset={handleReset}
            />
          </div>

          {/* Results Section */}
          {isProcessing && !extractedSkills && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Processing Resume</h3>
                <p className="text-muted-foreground">
                  Please wait while we analyze your resume and extract skills...
                </p>
              </div>
              <div className="flex justify-center">
                <Card className="w-full max-w-md p-6">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-medium">Analyzing skills...</p>
                    <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {extractedSkills && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Skills Analysis</h3>
                <p className="text-muted-foreground">
                  Here are the skills we found in your resume and suggestions for skills you might want to add
                </p>
              </div>
              <div className="flex justify-center">
                <SkillsDisplay categories={extractedSkills} />
              </div>
              
              {extractedSkills.length > 1 && (
                <div className="max-w-4xl mx-auto">
                  <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-amber-800 dark:text-amber-300">AI-Powered Skill Suggestions</h4>
                          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                            Based on your current skills, our AI has identified complementary skills that could enhance your profile. 
                            Consider adding these skills to your resume to improve your job prospects.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}