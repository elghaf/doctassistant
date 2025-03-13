import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  ClipboardListIcon,
  FileTextIcon,
  HomeIcon,
  LogOutIcon,
  MessageSquareIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

interface DashboardSidebarProps {
  userType?: "patient" | "doctor" | "admin";
  userName?: string;
  userAvatar?: string;
  activePath?: string;
}

const DashboardSidebar = ({
  userType = "patient",
  userName = "John Doe",
  userAvatar = "",
  activePath = "/dashboard",
}: DashboardSidebarProps) => {
  // Define navigation items based on user type
  const getNavItems = () => {
    const commonItems = [
      { path: "/dashboard", label: "Dashboard", icon: <HomeIcon size={20} /> },
      {
        path: "/settings",
        label: "Settings",
        icon: <SettingsIcon size={20} />,
      },
    ];

    const patientItems = [
      {
        path: "/questionnaires",
        label: "Health Questionnaires",
        icon: <ClipboardListIcon size={20} />,
      },
      {
        path: "/appointments",
        label: "Appointments",
        icon: <CalendarIcon size={20} />,
      },
      {
        path: "/reports",
        label: "Medical Reports",
        icon: <FileTextIcon size={20} />,
      },
      {
        path: "/messages",
        label: "Messages",
        icon: <MessageSquareIcon size={20} />,
      },
    ];

    const doctorItems = [
      {
        path: "/appointment-requests",
        label: "Appointment Requests",
        icon: <CalendarIcon size={20} />,
      },
      {
        path: "/patients",
        label: "Patient List",
        icon: <UserIcon size={20} />,
      },
      {
        path: "/schedule",
        label: "Today's Schedule",
        icon: <ClipboardListIcon size={20} />,
      },
      {
        path: "/reports",
        label: "Medical Reports",
        icon: <FileTextIcon size={20} />,
      },
      {
        path: "/messages",
        label: "Messages",
        icon: <MessageSquareIcon size={20} />,
      },
    ];

    const adminItems = [
      {
        path: "/users",
        label: "User Management",
        icon: <UserIcon size={20} />,
      },
      {
        path: "/system",
        label: "System Configuration",
        icon: <SettingsIcon size={20} />,
      },
      { path: "/logs", label: "Access Logs", icon: <FileTextIcon size={20} /> },
    ];

    switch (userType) {
      case "doctor":
        return [...doctorItems, ...commonItems];
      case "admin":
        return [...adminItems, ...commonItems];
      default:
        return [...patientItems, ...commonItems];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="h-full w-[250px] bg-background border-r flex flex-col">
      {/* User profile section */}
      <div className="p-4 flex flex-col items-center space-y-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {userName
              .split(" ")
              .map((name) => name[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="font-medium">{userName}</h3>
          <p className="text-sm text-muted-foreground capitalize">{userType}</p>
        </div>
      </div>

      <Separator />

      {/* Navigation links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 font-normal",
                activePath === item.path && "bg-accent text-accent-foreground",
              )}
            >
              {item.icon}
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Logout button */}
      <div className="p-4 mt-auto">
        <Button variant="outline" className="w-full justify-start gap-3">
          <LogOutIcon size={20} />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
