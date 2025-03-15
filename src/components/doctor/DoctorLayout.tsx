import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../dashboard/DashboardSidebar";

interface DoctorLayoutProps {
  doctorName?: string;
  doctorAvatar?: string;
  activePath?: string;
}

const DoctorLayout = ({
  doctorName = "Dr. Sarah Johnson",
  doctorAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor",
  activePath = "/dashboard",
}: DoctorLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <DashboardSidebar
        userType="doctor"
        userName={doctorName}
        userAvatar={doctorAvatar}
        activePath={activePath}
      />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorLayout;
