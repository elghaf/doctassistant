import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../dashboard/DashboardSidebar";

interface PatientLayoutProps {
  patientName?: string;
  patientAvatar?: string;
  activePath?: string;
}

const PatientLayout = ({
  patientName = "Sarah Johnson",
  patientAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  activePath = "/dashboard",
}: PatientLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <DashboardSidebar
        userType="patient"
        userName={patientName}
        userAvatar={patientAvatar}
        activePath={activePath}
      />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default PatientLayout;
