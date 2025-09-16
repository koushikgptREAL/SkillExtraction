import { useState } from "react";
import AuthButton from "./AuthButton";
import FileUpload from "./FileUpload";
import SkillsDisplay, { type SkillCategory } from "./SkillsDisplay";
import ThemeToggle from "./ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Brain, Target, TrendingUp, Award, Shield } from "lucide-react";

interface DashboardProps {
  user?: { name: string; email: string; avatar?: string } | null;
  onSignOut?: () => void;
}

export default function Dashboard({ user, onSignOut }: DashboardProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<SkillCategory[] | null>(null);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    setIsComplete(false);
    setExtractedSkills(null);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      // Mock extracted skills - in real app this would come from the backend
      setExtractedSkills([
        {
          name: "Programming Languages",
          icon: FileText,
          color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
          skills: [
            { name: "JavaScript", category: "Programming Languages", confidence: 95 },
            { name: "Python", category: "Programming Languages", confidence: 88 },
            { name: "TypeScript", category: "Programming Languages", confidence: 82 }
          ]
        }
      ]);
    }, 2000);
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Platform Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">50,234+</div>
                <p className="text-sm text-muted-foreground">Resumes analyzed globally</p>
                <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% this month
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Brain className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  AI Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">95.7%</div>
                <p className="text-sm text-muted-foreground">Skill detection accuracy</p>
                <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Industry leading
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  Enterprise Grade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">99.9%</div>
                <p className="text-sm text-muted-foreground">System uptime SLA</p>
                <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  SOC 2 certified
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upload Section */}
          <div className="flex justify-center">
            <FileUpload
              onFileUpload={handleFileUpload}
              isProcessing={isProcessing}
              isComplete={isComplete}
              onReset={handleReset}
            />
          </div>

          {/* Results Section */}
          {extractedSkills && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Extracted Skills</h3>
                <p className="text-muted-foreground">
                  Here are the skills we found in your resume
                </p>
              </div>
              <div className="flex justify-center">
                <SkillsDisplay categories={extractedSkills} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}