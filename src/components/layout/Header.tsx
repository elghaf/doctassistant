import React from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Bell, LogOut, Menu, User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

interface HeaderProps {
  userName?: string;
  userRole?: "patient" | "doctor" | "admin";
  userAvatar?: string;
  notificationCount?: number;
  onLogin?: () => void;
  onLogout?: () => void;
  onNotificationsClick?: () => void;
}

const Header = ({
  userName = "Guest",
  userRole = "patient",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=medical",
  notificationCount = 3,
  onLogin = () => {},
  onLogout = () => {},
  onNotificationsClick = () => {},
}: HeaderProps) => {
  const navigate = useNavigate();
  const { user, isSignedIn, signOut } = useAuth();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 md:px-8 lg:px-12">
      <div className="flex items-center">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white text-xl font-bold">M</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Medical Office</h1>
            <p className="text-sm text-gray-500">Management System</p>
          </div>
        </Link>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isSignedIn && user ? (
              <>
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={handleLogin}>
                <User className="mr-2 h-4 w-4" />
                <span>Login</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop Authentication */}
      <div className="hidden md:flex items-center gap-4">
        {isSignedIn && user ? (
          <div className="flex items-center gap-3">
            <div className="text-right mr-2">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        ) : (
          <Button onClick={handleLogin}>
            <User className="mr-2 h-4 w-4" />
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
