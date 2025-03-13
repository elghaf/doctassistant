import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Calendar,
  LogOut,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "appointment" | "patient" | "system";
}

interface HeaderProps {
  doctorName?: string;
  doctorAvatar?: string;
  notifications?: Notification[];
  onSearch?: (query: string) => void;
  onNotificationRead?: (id: string) => void;
  onNotificationClear?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
}

const Header = ({
  doctorName = "Dr. Sarah Johnson",
  doctorAvatar = "",
  notifications = [
    {
      id: "1",
      title: "Upcoming Appointment",
      description: "John Doe at 2:30 PM today",
      time: "30 minutes ago",
      read: false,
      type: "appointment",
    },
    {
      id: "2",
      title: "New Test Results",
      description: "Lab results for Jane Smith are ready",
      time: "2 hours ago",
      read: false,
      type: "patient",
    },
    {
      id: "3",
      title: "System Update",
      description: "New features available in the dashboard",
      time: "1 day ago",
      read: true,
      type: "system",
    },
  ],
  onSearch = () => {},
  onNotificationRead = () => {},
  onNotificationClear = () => {},
  onProfileClick = () => {},
  onSettingsClick = () => {},
  onLogout = () => {},
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/login");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleNotificationClick = (id: string) => {
    onNotificationRead(id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "patient":
        return <User className="h-4 w-4 text-green-500" />;
      case "system":
        return <Settings className="h-4 w-4 text-amber-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-20 px-6 flex items-center justify-between w-full">
      {/* Left side - Search */}
      <div className="w-1/3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search patients, appointments..."
            className="pl-10 w-full max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Right side - Notifications and Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <DropdownMenu
          open={notificationsOpen}
          onOpenChange={setNotificationsOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex justify-between items-center p-2">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onNotificationClear();
                    setNotificationsOpen(false);
                  }}
                  className="h-auto p-1 text-xs"
                >
                  Clear all
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-sm">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <Badge
                              variant="secondary"
                              className="ml-2 h-1.5 w-1.5 rounded-full p-0"
                            />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 px-4 text-center">
                <p className="text-gray-500 text-sm">No notifications</p>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 h-auto p-1"
            >
              <Avatar>
                <AvatarImage
                  src={
                    doctorAvatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctorName}`
                  }
                  alt={doctorName}
                />
                <AvatarFallback>
                  {doctorName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium">{doctorName}</p>
                <p className="text-xs text-gray-500">Medical Doctor</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
