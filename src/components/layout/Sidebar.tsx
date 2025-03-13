import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Users,
  FileText,
  Calendar,
  Database,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Brain,
  BarChart,
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({ collapsed = false, onToggle = () => {} }: SidebarProps) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  // Update local state when prop changes
  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onToggle?.(); // Call the parent's onToggle handler
  };

  const navigationItems = [
    {
      name: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/",
    },
    {
      name: "Patients",
      icon: <Users className="h-5 w-5" />,
      path: "/patients",
    },
    {
      name: "Appointments",
      icon: <Calendar className="h-5 w-5" />,
      path: "/appointments",
    },
    {
      name: "Reports",
      icon: <FileText className="h-5 w-5" />,
      path: "/reports",
    },
    {
      name: "AI Assistant",
      icon: <Brain className="h-5 w-5" />,
      path: "/ai-assistant",
    },
    {
      name: "Analytics",
      icon: <BarChart className="h-5 w-5" />,
      path: "/analytics",
    },
    {
      name: "Data Management",
      icon: <Database className="h-5 w-5" />,
      path: "/data-management",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={cn(
        "h-full bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed left-0 top-0 z-40",
        isCollapsed ? "w-[70px]" : "w-[280px]",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center mr-2">
              <span className="text-white font-bold">DA</span>
            </div>
            <h1 className="text-xl font-bold">Doctor's Asst</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-auto"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <TooltipProvider delayDuration={0} disableHoverableContent>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive(item.path)
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 hover:bg-gray-100",
                        isCollapsed && "justify-center px-2",
                      )}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">{item.name}</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <TooltipProvider delayDuration={0} disableHoverableContent>
          <div className="flex flex-col space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "justify-start",
                    isCollapsed && "justify-center px-2",
                  )}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  {!isCollapsed && <span>Settings</span>}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">Settings</TooltipContent>
              )}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "justify-start",
                    isCollapsed && "justify-center px-2",
                  )}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  {!isCollapsed && <span>Logout</span>}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">Logout</TooltipContent>
              )}
            </Tooltip>
          </div>
        </TooltipProvider>

        {!isCollapsed && (
          <div className="mt-4 flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=doctor"
                alt="Doctor profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Dr. Sarah Johnson</p>
              <p className="text-xs text-gray-500">Cardiologist</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
