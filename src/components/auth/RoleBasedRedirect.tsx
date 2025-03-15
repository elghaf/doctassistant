import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface RoleBasedRedirectProps {
  children: React.ReactNode;
}

const RoleBasedRedirect: React.FC<RoleBasedRedirectProps> = ({ children }) => {
  const { user, isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && user) {
      if (user.role === "patient") {
        navigate("/patient-dashboard");
      } else if (user.role === "doctor") {
        navigate("/doctor-dashboard");
      }
    }
  }, [isSignedIn, user, navigate]);

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRedirect;
