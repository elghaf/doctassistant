import React from "react";
import { SignIn, SignUp, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useCustomAuth } from "./AuthProvider";

interface ClerkAuthProps {
  view?: "sign-in" | "sign-up" | "user-button";
  redirectUrl?: string;
  onSuccess?: () => void;
}

const ClerkAuth = ({
  view = "sign-in",
  redirectUrl = "/dashboard",
  onSuccess,
}: ClerkAuthProps) => {
  const { isSignedIn, signOut } = useCustomAuth();

  if (isSignedIn && view === "user-button") {
    return (
      <div className="flex items-center gap-2">
        <UserButton afterSignOutUrl="/" />
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    );
  }

  if (view === "sign-in") {
    return (
      <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <SignIn redirectUrl={redirectUrl} signUpUrl="/register" afterSignInUrl={redirectUrl} onSuccess={onSuccess} />
      </div>
    );
  }

  if (view === "sign-up") {
    return (
      <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <SignUp redirectUrl={redirectUrl} signInUrl="/login" afterSignUpUrl={redirectUrl} onSuccess={onSuccess} />
      </div>
    );
  }

  return null;
};

export default ClerkAuth;
