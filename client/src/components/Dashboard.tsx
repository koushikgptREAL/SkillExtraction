import { useState } from "react";
import AuthButton from "./AuthButton";
import FileUpload from "./FileUpload";
import SkillsDisplay, { type SkillCategory } from "./SkillsDisplay";
import ThemeToggle from "./ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Brain, Target } from "lucide-react";

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
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">
              Extract Skills from Your Resume
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your resume and instantly discover key skills with our AI-powered analysis. 
              Perfect for optimizing your job applications and career development.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Resumes Analyzed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234+</div>
                <p className="text-sm text-muted-foreground">Successfully processed</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-green-500" />
                  Skills Detected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25,000+</div>
                <p className="text-sm text-muted-foreground">Unique skills identified</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-purple-500" />
                  Accuracy Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-sm text-muted-foreground">Skill detection accuracy</p>
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