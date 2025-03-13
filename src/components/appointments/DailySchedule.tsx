import React, { useState } from "react";
import { format } from "date-fns";
import { CheckCircle, Clock, Calendar, User, X } from "lucide-react";

import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

interface Appointment {
  id: string;
  patientName: string;
  patientAvatar?: string;
  time: string;
  duration: number;
  reason: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
}

interface DailyScheduleProps {
  date?: Date;
  appointments?: Appointment[];
  onMarkComplete?: (appointmentId: string) => void;
  onCancel?: (appointmentId: string) => void;
}

const DailySchedule = ({
  date = new Date(),
  appointments = [
    {
      id: "1",
      patientName: "Sarah Johnson",
      patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      time: "09:00",
      duration: 30,
      reason: "Annual checkup",
      status: "scheduled",
    },
    {
      id: "2",
      patientName: "Michael Chen",
      patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      time: "10:00",
      duration: 45,
      reason: "Follow-up consultation",
      status: "in-progress",
    },
    {
      id: "3",
      patientName: "Emily Rodriguez",
      patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      time: "11:30",
      duration: 60,
      reason: "New patient consultation",
      status: "scheduled",
    },
    {
      id: "4",
      patientName: "David Wilson",
      patientAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      time: "14:00",
      duration: 30,
      reason: "Prescription renewal",
      status: "completed",
    },
  ],
  onMarkComplete = () => {},
  onCancel = () => {},
}: DailyScheduleProps) => {
  const [localAppointments, setLocalAppointments] =
    useState<Appointment[]>(appointments);

  const handleMarkComplete = (appointmentId: string) => {
    setLocalAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, status: "completed" as const }
          : appointment,
      ),
    );
    onMarkComplete(appointmentId);
  };

  const handleCancel = (appointmentId: string) => {
    setLocalAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === appointmentId
          ? { ...appointment, status: "cancelled" as const }
          : appointment,
      ),
    );
    onCancel(appointmentId);
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" /> Scheduled
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="default">
            <Clock className="mr-1 h-3 w-3" /> In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary">
            <CheckCircle className="mr-1 h-3 w-3" /> Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive">
            <X className="mr-1 h-3 w-3" /> Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Today's Schedule</h2>
          <p className="text-gray-500 flex items-center mt-1">
            <Calendar className="mr-2 h-4 w-4" />
            {format(date, "EEEE, MMMM do, yyyy")}
          </p>
        </div>
        <div>
          <Button variant="outline" className="mr-2">
            Previous Day
          </Button>
          <Button>Next Day</Button>
        </div>
      </div>

      {localAppointments.length === 0 ? (
        <Card className="text-center p-6">
          <p className="text-gray-500">No appointments scheduled for today.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {localAppointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage
                        src={appointment.patientAvatar}
                        alt={appointment.patientName}
                      />
                      <AvatarFallback>
                        {appointment.patientName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {appointment.patientName}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="mr-1 h-3 w-3" />
                        {appointment.time} ({appointment.duration} min)
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-700">
                  <strong>Reason:</strong> {appointment.reason}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-end space-x-2">
                {appointment.status === "scheduled" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleMarkComplete(appointment.id)}
                    >
                      Mark Complete
                    </Button>
                  </>
                )}
                {appointment.status === "in-progress" && (
                  <Button
                    size="sm"
                    onClick={() => handleMarkComplete(appointment.id)}
                  >
                    Mark Complete
                  </Button>
                )}
                {appointment.status === "completed" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-600"
                    disabled
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Completed
                  </Button>
                )}
                {appointment.status === "cancelled" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    disabled
                  >
                    <X className="mr-1 h-4 w-4" />
                    Cancelled
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailySchedule;
