import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

const HomePage: React.FC = () => {
  const { user, isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if auth state is determined
    if (isSignedIn === false) {
      navigate("/login");
      return;
    }

    if (isSignedIn && user) {
      if (user.role === "patient") {
        navigate("/patient/dashboard");
      } else if (user.role === "doctor") {
        navigate("/doctor/dashboard");
      }
    }
  }, [isSignedIn, user, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Medical Portal</h1>
        <p className="text-gray-600">
          Please wait while we redirect you...
        </p>
      </div>
    </div>
  );
};

export default HomePage;
