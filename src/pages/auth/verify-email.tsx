import React from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const VerifyEmailPage = () => {
  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Please check your email for a verification link"
    >
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <Mail className="h-12 w-12 text-blue-500" />
        </div>
        <p className="text-gray-600">
          We've sent you an email with a verification link. Please click the link to verify your account.
        </p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Didn't receive the email?
          </p>
          <Button variant="outline" className="w-full">
            Resend verification email
          </Button>
        </div>
        <div className="text-sm">
          <Link to="/auth/login" className="text-blue-600 hover:text-blue-800">
            Back to login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;