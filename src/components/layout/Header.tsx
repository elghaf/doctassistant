import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  userName?: string;
  userRole?: "patient" | "doctor" | "admin";
  userAvatar?: string;
  notificationCount?: number;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userName = "Guest",
  userRole = "patient",
  userAvatar,
  notificationCount = 0,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Left side - Logo/Brand */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-primary">
            Medical Portal
          </h1>
        </div>

        {/* Right side - User info and actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} />
              <AvatarFallback>
                {userName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Logout Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onLogout}
            className="hidden sm:flex"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;


