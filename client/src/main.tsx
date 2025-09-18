import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = (
  (import.meta.env as any).VITE_CLERK_PUBLISHABLE_KEY ||
  (import.meta.env as any).NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
) as string | undefined;

// Get redirection URLs from environment variables
const signInUrl = (import.meta.env as any).NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in";
const signUpUrl = (import.meta.env as any).NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up";
const afterSignInUrl = (import.meta.env as any).NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "/";
const afterSignUpUrl = (import.meta.env as any).NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/";

const root = createRoot(document.getElementById("root")!);
if (PUBLISHABLE_KEY) {
  root.render(
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      afterSignInUrl={afterSignInUrl}
      afterSignUpUrl={afterSignUpUrl}
      navigate={(to) => window.location.href = to}
    >
      <App />
    </ClerkProvider>
  );
} else {
  console.warn("Clerk publishable key missing; rendering without ClerkProvider");
  root.render(<App />);
}
