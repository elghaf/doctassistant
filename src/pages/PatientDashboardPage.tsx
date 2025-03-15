import React from "react";
import PatientDashboard from "@/components/dashboard/PatientDashboard";
import { useAuth } from "@/components/auth/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const PatientDashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <PatientDashboard
        patientName={user?.name || ""}
        patientAvatar={
          user?.avatar ||
          "https://api.dicebear.com/7.x/avataaars/svg?seed=patient"
        }
      />
    </ProtectedRoute>
  );
};

export default PatientDashboardPage;
