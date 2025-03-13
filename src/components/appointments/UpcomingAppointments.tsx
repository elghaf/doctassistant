import React, { useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  X,
  Edit,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  date: Date;
  time: string;
  location: string;
  status: "confirmed" | "pending" | "cancelled";
}

interface UpcomingAppointmentsProps {
  appointments?: Appointment[];
}

const UpcomingAppointments = ({
  appointments = defaultAppointments,
}: UpcomingAppointmentsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] =
    useState<Appointment | null>(null);
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] =
    useState<Appointment | null>(null);

  const handleCancelClick = (appointment: Appointment) => {
    setAppointmentToCancel(appointment);
    setOpenCancelDialog(true);
  };

  const handleRescheduleClick = (appointment: Appointment) => {
    setAppointmentToReschedule(appointment);
    setOpenRescheduleDialog(true);
  };

  const handleCancelConfirm = () => {
    // In a real app, this would call an API to cancel the appointment
    console.log("Cancelling appointment:", appointmentToCancel?.id);
    setOpenCancelDialog(false);
  };

  const handleRescheduleConfirm = () => {
    // In a real app, this would call an API to reschedule the appointment
    console.log(
      "Rescheduling appointment:",
      appointmentToReschedule?.id,
      "to date:",
      selectedDate,
    );
    setOpenRescheduleDialog(false);
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Upcoming Appointments</h2>

      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No upcoming appointments</p>
          <p className="text-muted-foreground mt-2">
            Schedule a new appointment to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Dr. {appointment.doctorName} -{" "}
                      {appointment.doctorSpecialty}
                    </CardTitle>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      <span className="mr-3">
                        {format(appointment.date, "MMMM d, yyyy")}
                      </span>
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      appointment.status === "confirmed"
                        ? "default"
                        : appointment.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{appointment.location}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 bg-muted/20 py-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRescheduleClick(appointment)}
                  disabled={appointment.status === "cancelled"}
                >
                  <Edit className="mr-1 h-4 w-4" /> Reschedule
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancelClick(appointment)}
                  disabled={appointment.status === "cancelled"}
                >
                  <X className="mr-1 h-4 w-4" /> Cancel
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Cancel Appointment Dialog */}
      <AlertDialog open={openCancelDialog} onOpenChange={setOpenCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your appointment with Dr.{" "}
              {appointmentToCancel?.doctorName} on{" "}
              {appointmentToCancel?.date &&
                format(appointmentToCancel.date, "MMMM d, yyyy")}{" "}
              at {appointmentToCancel?.time}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-destructive text-destructive-foreground"
            >
              Yes, Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reschedule Appointment Dialog */}
      <Dialog
        open={openRescheduleDialog}
        onOpenChange={setOpenRescheduleDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              Current appointment with Dr. {appointmentToReschedule?.doctorName}
              :
              <br />
              <span className="font-medium">
                {appointmentToReschedule?.date &&
                  format(appointmentToReschedule.date, "MMMM d, yyyy")}{" "}
                at {appointmentToReschedule?.time}
              </span>
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Select New Date</h4>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Select New Time</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "9:00 AM",
                    "10:00 AM",
                    "11:00 AM",
                    "1:00 PM",
                    "2:00 PM",
                    "3:00 PM",
                  ].map((time) => (
                    <Button key={time} variant="outline" className="text-sm">
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenRescheduleDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRescheduleConfirm}>
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Default appointments for demonstration
const defaultAppointments: Appointment[] = [
  {
    id: "1",
    doctorName: "Sarah Johnson",
    doctorSpecialty: "Cardiologist",
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    time: "10:00 AM",
    location: "Main Hospital, Room 302",
    status: "confirmed",
  },
  {
    id: "2",
    doctorName: "Michael Chen",
    doctorSpecialty: "Dermatologist",
    date: new Date(new Date().setDate(new Date().getDate() + 7)),
    time: "2:30 PM",
    location: "Medical Center, Suite 105",
    status: "pending",
  },
  {
    id: "3",
    doctorName: "Emily Rodriguez",
    doctorSpecialty: "Neurologist",
    date: new Date(new Date().setDate(new Date().getDate() + 14)),
    time: "9:15 AM",
    location: "Neurology Clinic, Floor 4",
    status: "confirmed",
  },
];

export default UpcomingAppointments;
