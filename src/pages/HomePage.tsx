import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

const HomePage: React.FC = () => {
  const { user, isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && user) {
      if (user.role === "patient") {
        navigate("/patient-dashboard");
      } else if (user.role === "doctor") {
        navigate("/doctor-dashboard");
      }
    } else if (!isSignedIn) {
      navigate("/login");
    }
  }, [isSignedIn, user, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Redirecting...</h1>
        <p className="text-gray-600">
          Please wait while we redirect you to the appropriate dashboard.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
