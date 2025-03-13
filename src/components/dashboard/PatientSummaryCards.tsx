import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CalendarClock, FileText, FlaskConical, Bell } from "lucide-react";
import { Badge } from "../ui/badge";

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
}

const SummaryCard = ({
  icon,
  title,
  value,
  description,
  footer,
  className = "",
}: SummaryCardProps) => {
  return (
    <Card className={`bg-white h-full ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <CardDescription className="mt-1">{description}</CardDescription>
        )}
      </CardContent>
      {footer && <CardFooter className="pt-2">{footer}</CardFooter>}
    </Card>
  );
};

interface PatientSummaryCardsProps {
  nextAppointment?: {
    date: string;
    time: string;
    doctor: string;
    type: string;
  };
  pendingQuestionnaires?: number;
  recentLabResults?: {
    count: number;
    new: number;
  };
  notifications?: {
    count: number;
    urgent: number;
  };
}

const PatientSummaryCards = ({
  nextAppointment = {
    date: "May 15, 2023",
    time: "10:30 AM",
    doctor: "Dr. Sarah Johnson",
    type: "Annual Check-up",
  },
  pendingQuestionnaires = 2,
  recentLabResults = {
    count: 3,
    new: 1,
  },
  notifications = {
    count: 5,
    urgent: 2,
  },
}: PatientSummaryCardsProps) => {
  return (
    <div className="w-full bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<CalendarClock className="h-5 w-5 text-blue-600" />}
          title="Next Appointment"
          value={nextAppointment.date}
          description={`${nextAppointment.time} with ${nextAppointment.doctor}`}
          footer={
            <div className="w-full text-xs">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {nextAppointment.type}
              </Badge>
            </div>
          }
        />

        <SummaryCard
          icon={<FileText className="h-5 w-5 text-amber-600" />}
          title="Pending Questionnaires"
          value={pendingQuestionnaires}
          description={
            pendingQuestionnaires === 1
              ? "Questionnaire needs your attention"
              : "Questionnaires need your attention"
          }
          footer={
            <div className="w-full">
              <div className="text-xs text-amber-600 font-medium">
                {pendingQuestionnaires > 0
                  ? "Please complete soon"
                  : "All caught up!"}
              </div>
            </div>
          }
        />

        <SummaryCard
          icon={<FlaskConical className="h-5 w-5 text-emerald-600" />}
          title="Lab Results"
          value={recentLabResults.count}
          description={`${recentLabResults.new} new result${recentLabResults.new !== 1 ? "s" : ""} available`}
          footer={
            <div className="w-full">
              <div className="text-xs text-emerald-600 font-medium">
                {recentLabResults.new > 0
                  ? "New results to review"
                  : "All reviewed"}
              </div>
            </div>
          }
        />

        <SummaryCard
          icon={<Bell className="h-5 w-5 text-purple-600" />}
          title="Notifications"
          value={notifications.count}
          description={`${notifications.urgent} urgent notification${notifications.urgent !== 1 ? "s" : ""}`}
          footer={
            <div className="w-full">
              <div className="text-xs text-purple-600 font-medium">
                {notifications.urgent > 0
                  ? "Requires immediate attention"
                  : "No urgent notifications"}
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default PatientSummaryCards;
