import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/components/Landing";
import Dashboard from "@/components/Dashboard";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

function Router() {
  // TODO: remove mock functionality - replace with real Firebase auth
  const [user, setUser] = useState<User | null>(null);

  const handleSignIn = () => {
    // TODO: implement real Google OAuth with Firebase
    console.log('Sign in with Google');
    // Mock user for demo
    setUser({
      name: "John Smith",
      email: "john.smith@example.com"
    });
  };

  const handleSignOut = () => {
    // TODO: implement real sign out
    console.log('Sign out');
    setUser(null);
  };

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
      {/* Fallback */}
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
