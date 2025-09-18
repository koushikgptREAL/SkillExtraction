import { Brain, CheckCircle, Upload, Search, Zap, Shield, Award, Users, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AuthButton from "./AuthButton";
import ThemeToggle from "./ThemeToggle";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

interface LandingProps {
  onSignIn?: () => void;
  user?: { name: string; email: string; avatar?: string } | null;
}

export default function Landing({ onSignIn, user }: LandingProps) {
  const features = [
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Simply drag and drop your PDF resume or click to browse files"
    },
    {
      icon: Search,
      title: "AI-Powered Analysis", 
      description: "Our advanced algorithms scan your resume for relevant skills and keywords"
    },
    {
      icon: CheckCircle,
      title: "Instant Results",
      description: "Get categorized skills with confidence scores in seconds"
    }
  ];

  const steps = [
    "Upload your resume in PDF format",
    "AI analyzes and extracts skills",
    "View categorized results with confidence scores",
    "Optimize your resume for better job matches"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">ResumeSkills</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {!user && (
                <AuthButton onSignIn={onSignIn} />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-muted/30 pointer-events-none" />
        <div className="max-w-5xl mx-auto space-y-10 relative">
          <div className="space-y-6">
            <div className="flex justify-center gap-2 mb-6">
              <Badge variant="secondary" className="px-3 py-1">
                <Shield className="w-3 h-3 mr-1" />
                Enterprise Security
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <Award className="w-3 h-3 mr-1" />
                95% Accuracy
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              Placement Preparation
              <span className="block text-primary">Assistant</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Leverage enterprise-grade AI to extract, categorize, and optimize skills from your resume
              to build your career professionals worldwide.
            </p>
          </div>
          
          <div className="flex justify-center">
            {Boolean((import.meta.env as any).VITE_CLERK_PUBLISHABLE_KEY || (import.meta.env as any).NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) ? (
              <SignedOut>
                <SignInButton 
                  mode="modal"
                  forceRedirectUrl="http://localhost:5000/dashboard"
                >
                  <Button 
                    size="lg" 
                    className="text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-shadow"
                    data-testid="button-get-started"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Start Analysis
                  </Button>
                </SignInButton>
              </SignedOut>
            ) : (
              <Button 
                size="lg" 
                className="text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-shadow"
                onClick={onSignIn}
                data-testid="button-get-started"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Analysis
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Enterprise-Grade Solution
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Powered by Advanced AI</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our proprietary machine learning algorithms analyze resumes with the same precision 
              used by Fortune 500 companies for talent acquisition.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover-elevate border-0 shadow-md bg-card/50 backdrop-blur">
                  <CardHeader className="pb-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-6 relative">
                      <Icon className="w-10 h-10 text-primary" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Analysis Process Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">How Our System Analyzes Your Resume</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI-powered analysis that breaks down your resume into actionable insights
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start gap-6 p-6 rounded-xl bg-muted/30 hover-elevate">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-lg">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Text Extraction & Processing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our system extracts all text content from your PDF resume using advanced OCR technology, 
                  preserving formatting and structure while preparing it for analysis.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 rounded-xl bg-muted/30 hover-elevate">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-lg">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Intelligent Keyword Matching</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We scan your resume against our comprehensive database of 10,000+ skills, technologies, 
                  and professional competencies using natural language processing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 rounded-xl bg-muted/30 hover-elevate">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-lg">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Context-Aware Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI understands context and relationships between skills, identifying not just explicit mentions 
                  but also implied competencies based on experience and project descriptions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 rounded-xl bg-muted/30 hover-elevate">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-lg">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Smart Categorization</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Detected skills are automatically organized into relevant categories like programming languages, 
                  frameworks, soft skills, and industry-specific competencies for easy review.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 rounded-xl bg-muted/30 hover-elevate">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-lg">5</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Confidence Scoring</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Each skill receives a confidence score based on frequency, context, and relevance, 
                  helping you understand which skills are most prominently featured in your resume.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}