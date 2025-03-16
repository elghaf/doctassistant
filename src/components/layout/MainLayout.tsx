import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import PatientSidebar from "./PatientSidebar";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "../hooks/useToast";

interface MainLayoutProps {
  children?: ReactNode;
  userRole?: "patient" | "doctor" | "admin";
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  pendingQuestionnaires?: number;
}

const MainLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

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
        userName={user?.name}
        userRole={user?.role}
        userAvatar={user?.avatar}
        notificationCount={notificationCount}
        onLogin={() => console.log("Login clicked")}
        onLogout={handleLogout}
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

