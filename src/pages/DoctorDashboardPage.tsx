import React from "react";
import DoctorDashboard from "@/components/dashboard/DoctorDashboard";
import { useAuth } from "@/components/auth/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const DoctorDashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <DoctorDashboard
        doctorName={user?.name || ""}
        doctorAvatar={
          user?.avatar ||
          "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor"
        }
      />
    </ProtectedRoute>
  );
};

export default DoctorDashboardPage;
