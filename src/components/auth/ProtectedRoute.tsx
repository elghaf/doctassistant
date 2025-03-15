import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "patient" | "doctor";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, check if the user has that role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to the appropriate dashboard based on user role
    if (user?.role === "patient") {
      return <Navigate to="/patient-dashboard" replace />;
    } else if (user?.role === "doctor") {
      return <Navigate to="/doctor-dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
