import { Brain, CheckCircle, Upload, Search, Zap, Shield, Award, Users, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
              <Badge variant="secondary" className="px-3 py-1">
                <Users className="w-3 h-3 mr-1" />
                Trusted by 10K+ Users
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              Professional Resume
              <span className="block text-primary">Skill Analysis</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Leverage enterprise-grade AI to extract, categorize, and optimize skills from your resume. 
              Trusted by top companies and career professionals worldwide.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-shadow"
              onClick={onSignIn}
              data-testid="button-get-started"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Free Analysis
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-10 py-6 bg-background/50 backdrop-blur"
              data-testid="button-learn-more"
            >
              View Demo
            </Button>
          </div>
          
          <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground pt-6">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              GDPR compliant
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              SOC 2 certified
            </div>
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

      {/* Statistics Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Trusted by Industry Leaders</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals who have accelerated their careers with our platform
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <p className="text-muted-foreground">Resumes Analyzed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <p className="text-muted-foreground">Accuracy Rate</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Enterprise Clients</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">Expert Support</p>
            </div>
          </div>

          {/* Testimonial */}
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-muted/20 border-0">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-xl font-medium mb-4 italic">
                "This platform transformed how we screen candidates. The skill extraction is incredibly accurate 
                and saves our HR team countless hours. A game-changer for talent acquisition."
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-primary">SM</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">Sarah Mitchell</div>
                  <div className="text-sm text-muted-foreground">VP of Talent, TechCorp</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              Start Your Career Transformation
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Ready to Unlock Your Professional Potential?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join industry leaders who rely on our platform for strategic talent analysis. 
              Transform your resume into a competitive advantage today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-10 py-6 bg-white text-primary hover:bg-white/90"
                onClick={onSignIn}
                data-testid="button-start-analyzing"
              >
                Get Started Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-10 py-6 border-white/30 text-white hover:bg-white/10"
                data-testid="button-contact-sales"
              >
                Contact Sales
              </Button>
            </div>
            <p className="text-sm opacity-75">
              No setup fees • Cancel anytime • Enterprise support available
            </p>
          </div>
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