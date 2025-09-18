import { useEffect, useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUser, useClerk } from "@clerk/clerk-react";
import Landing from "@/components/Landing";
import Dashboard from "@/components/Dashboard";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

function Router() {
  const [user, setUser] = useState<User | null>(null);
  const { user: clerkUser, isLoaded } = useUser();
  const clerk = useClerk();

  useEffect(() => {
    if (clerkUser && isLoaded) {
      setUser({
        name: clerkUser.fullName || clerkUser.firstName || "User",
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        avatar: clerkUser.imageUrl
      });
    } else if (isLoaded && !clerkUser) {
      // Fallback to API auth if Clerk user is not available
      fetch('/api/auth/me', { credentials: 'include' })
        .then(async (r) => {
          if (r.status === 401) return null;
          const u = await r.json();
          return { name: u.username, email: u.username } as User;
        })
        .then((u) => { if (u) setUser(u); })
        .catch(() => {});
    }
  }, [clerkUser, isLoaded]);

  const handleSignIn = () => {
    const hasClerk = Boolean((import.meta.env as any).VITE_CLERK_PUBLISHABLE_KEY || (import.meta.env as any).NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
    if (hasClerk) {
      // Clerk's <SignInButton /> handles opening the modal; no redirect needed here
      return;
    }
    window.location.href = '/api/auth/google';
  };

  const handleSignOut = async () => {
    const hasClerk = Boolean((import.meta.env as any).VITE_CLERK_PUBLISHABLE_KEY || (import.meta.env as any).NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
    if (hasClerk && clerk) {
      await clerk.signOut();
    } else {
      await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' });
    }
    setUser(null);
  };

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/">
        {user ? (
          <Dashboard user={user} onSignOut={handleSignOut} />
        ) : (
          <Landing onSignIn={handleSignIn} user={user} />
        )}
      </Route>
      <Route path="/dashboard">
        {user ? (
          <Dashboard user={user} onSignOut={handleSignOut} />
        ) : (
          <Landing onSignIn={handleSignIn} user={user} />
        )}
      </Route>
      <Route>
        {user ? (
          <Dashboard user={user} onSignOut={handleSignOut} />
        ) : (
          <Landing onSignIn={handleSignIn} user={user} />
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
