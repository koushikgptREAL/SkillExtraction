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
    
    // Will complete when server responds via onUploadResult
  };

  const handleUploadResult = (result: { textLength: number; skills: { name: string; category: string; confidence: number }[] }) => {
    setIsProcessing(false);
    setIsComplete(true);
    const mapped: SkillCategory[] = [
      {
        name: "Detected Skills",
        icon: FileText,
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
        skills: result.skills.map(s => ({ name: s.name, category: "Detected", confidence: s.confidence }))
      }
    ];
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