import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import PatientSidebar from "./PatientSidebar";

interface MainLayoutProps {
  children?: ReactNode;
  userRole?: "patient" | "doctor" | "admin";
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  pendingQuestionnaires?: number;
}

const MainLayout = ({
  children,
  userRole = "patient",
  userName = "Sarah Johnson",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  notificationCount = 3,
  pendingQuestionnaires = 2,
}: MainLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine which sidebar to show based on user role
  const renderSidebar = () => {
    if (userRole === "patient") {
      return (
        <PatientSidebar
          userName={userName}
          userAvatar={userAvatar}
          activePath={currentPath}
          notificationCount={notificationCount}
          pendingQuestionnaires={pendingQuestionnaires}
        />
      );
    }
    // Future implementation for doctor and admin sidebars
    return (
      <div className="h-full w-[280px] bg-background border-r flex flex-col p-4">
        <p className="text-center text-muted-foreground">
          {userRole} sidebar (not implemented)
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <Header
        userName={userName}
        userRole={userRole}
        userAvatar={userAvatar}
        notificationCount={notificationCount}
        onLogin={() => console.log("Login clicked")}
        onLogout={() => console.log("Logout clicked")}
        onNotificationsClick={() => console.log("Notifications clicked")}
      />

      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {renderSidebar()}

        {/* Content area */}
        <main className="flex-1 overflow-auto p-6">
          {children || (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Welcome to the Medical Office Management System
                </h2>
                <p className="text-gray-600 mt-2">
                  Select an option from the sidebar to get started
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
