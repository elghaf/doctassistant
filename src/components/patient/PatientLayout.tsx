import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import DashboardSidebar from "../dashboard/DashboardSidebar";

const PatientLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <DashboardSidebar
        userType="patient"
        userName={user?.name || "Patient"}
        userAvatar={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=patient"}
        activePath={location.pathname}
      />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default PatientLayout;
