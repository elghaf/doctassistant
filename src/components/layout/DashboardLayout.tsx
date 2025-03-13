import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(prevState => !prevState);
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Sidebar */}
      {isMounted && (
        <Sidebar collapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />
      )}

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-col flex-1 overflow-hidden transition-all duration-300",
          sidebarCollapsed ? "ml-[70px]" : "ml-[280px]",
        )}
      >
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
