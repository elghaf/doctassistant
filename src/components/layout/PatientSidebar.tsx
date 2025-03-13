import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  HomeIcon,
  CalendarIcon,
  ClipboardListIcon,
  FileTextIcon,
  BellIcon,
} from "lucide-react";

interface PatientSidebarProps {
  userName?: string;
  userAvatar?: string;
  activePath?: string;
  notificationCount?: number;
  pendingQuestionnaires?: number;
}

const PatientSidebar = ({
  userName = "Sarah Johnson",
  userAvatar = "",
  activePath = "/dashboard",
  notificationCount = 3,
  pendingQuestionnaires = 2,
}: PatientSidebarProps) => {
  // Define navigation items for patient
  const navItems = [
    { path: "/dashboard", label: "Overview", icon: <HomeIcon size={20} /> },
    {
      path: "/appointments",
      label: "Appointments",
      icon: <CalendarIcon size={20} />,
    },
    {
      path: "/questionnaires",
      label: "Questionnaires",
      icon: <ClipboardListIcon size={20} />,
      badge: pendingQuestionnaires > 0 ? pendingQuestionnaires : undefined,
    },
    {
      path: "/reports",
      label: "Medical Reports",
      icon: <FileTextIcon size={20} />,
    },
    {
      path: "/notifications",
      label: "Notifications",
      icon: <BellIcon size={20} />,
      badge: notificationCount > 0 ? notificationCount : undefined,
    },
  ];

  return (
    <div className="h-full w-[280px] bg-background border-r flex flex-col">
      {/* User profile section */}
      <div className="p-6 flex flex-col items-center space-y-3">
        <Avatar className="h-20 w-20">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {userName
              .split(" ")
              .map((name) => name[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h3 className="font-medium text-lg">{userName}</h3>
          <p className="text-sm text-muted-foreground">Patient Portal</p>
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
                "w-full justify-start gap-3 font-normal h-12",
                activePath === item.path && "bg-accent text-accent-foreground"
              )}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && (
                <Badge variant="destructive" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default PatientSidebar;
