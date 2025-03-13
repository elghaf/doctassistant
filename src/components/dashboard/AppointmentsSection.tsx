import React from "react";
import { format, isToday, isTomorrow, addDays } from "date-fns";
import { Calendar, Clock, Bell, ChevronRight, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  date: Date;
  time: string;
  duration: number; // in minutes
  type: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  hasPreVisitNotification: boolean;
}

interface AppointmentsSectionProps {
  appointments?: Appointment[];
  onViewAll?: () => void;
  onViewAppointment?: (id: string) => void;
  onScheduleAppointment?: () => void;
}

const AppointmentsSection = ({
  appointments: providedAppointments,
  onViewAll = () => {},
  onViewAppointment = () => {},
  onScheduleAppointment = () => {},
}: AppointmentsSectionProps) => {
  // Default appointments if none are provided
  const defaultAppointments: Appointment[] = [];

  const appointments = providedAppointments || defaultAppointments;

  // Get the upcoming appointments (limited to 3 for display)
  const upcomingAppointments = appointments
    .filter((appointment) => appointment.status !== "cancelled")
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE, MMM d");
  };

  return (
    <Card className="h-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              Your schedule for the next few days
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onScheduleAppointment}
            className="flex items-center gap-1"
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Schedule</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onViewAppointment(appointment.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">
                        {appointment.patientName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {appointment.type}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      appointment.status === "confirmed"
                        ? "default"
                        : "secondary"
                    }
                    className="text-xs"
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{getDateLabel(appointment.date)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{appointment.time}</span>
                  </div>
                  {appointment.hasPreVisitNotification && (
                    <div className="ml-auto">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        <Bell className="h-3 w-3 mr-1" />
                        Pre-visit
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center p-4">
            <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="font-medium">No upcoming appointments</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Schedule a new appointment to see it here
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={onScheduleAppointment}
            >
              Schedule Appointment
            </Button>
          </div>
        )}
      </CardContent>
      {upcomingAppointments.length > 0 && (
        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            className="w-full justify-center text-sm"
            onClick={onViewAll}
          >
            View All Appointments
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AppointmentsSection;
