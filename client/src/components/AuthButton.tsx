import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

interface AuthButtonProps {
  onSignIn?: () => void;
  onSignOut?: () => void;
  user?: { name: string; email: string; avatar?: string } | null;
}

export default function AuthButton({ onSignIn, onSignOut, user }: AuthButtonProps) {
  const hasClerk = Boolean((import.meta.env as any).VITE_CLERK_PUBLISHABLE_KEY || (import.meta.env as any).NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (hasClerk) {
    return (
      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton 
            mode="modal"
            forceRedirectUrl="http://localhost:5000/dashboard"
          >
            <Button 
              data-testid="button-sign-in"
              className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-medium shadow-sm"
            >
              Continue with Google
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    );
  }
  const handleSignIn = () => {
    console.log('Google sign-in triggered');
    onSignIn?.();
  };

  const handleSignOut = () => {
    console.log('Sign out triggered');
    onSignOut?.();
  };

  if (user) {
    return (
      <Card className="w-fit">
        <CardContent className="flex items-center gap-3 p-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium" data-testid="text-user-name">{user.name}</span>
              <span className="text-xs text-muted-foreground" data-testid="text-user-email">{user.email}</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            data-testid="button-sign-out"
          >
            Sign out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button 
      onClick={handleSignIn}
      data-testid="button-sign-in"
      className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-medium shadow-sm"
    >
      Continue with Google
    </Button>
  );
}