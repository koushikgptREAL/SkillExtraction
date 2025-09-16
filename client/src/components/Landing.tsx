import { Brain, CheckCircle, Upload, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthButton from "./AuthButton";
import ThemeToggle from "./ThemeToggle";

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
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Extract Skills from Your
              <span className="text-primary"> Resume</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your resume and instantly discover key skills with our AI-powered analysis. 
              Perfect for optimizing job applications and career development.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={onSignIn}
              data-testid="button-get-started"
            >
              <Zap className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to extract and optimize your resume skills
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover-elevate">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Simple Process</h2>
              <p className="text-lg text-muted-foreground">
                From upload to optimization in just a few clicks
              </p>
            </div>
            
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-lg">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Ready to Optimize Your Resume?</h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of job seekers who have improved their resumes with our AI-powered skill extraction.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8"
            onClick={onSignIn}
            data-testid="button-start-analyzing"
          >
            Start Analyzing Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold">ResumeSkills</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 ResumeSkills. AI-powered resume analysis for better career outcomes.
          </p>
        </div>
      </footer>
    </div>
  );
}