import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { format, addDays, isSameDay } from "date-fns";
import { CalendarIcon, Clock, Users, PlusCircle } from "lucide-react";

interface Appointment {
  id: string;
  date: Date;
  time: string;
  doctor: string;
  type: string;
  status: "confirmed" | "pending" | "cancelled";
  notes?: string;
}

interface AppointmentCalendarProps {
  appointments?: Appointment[];
  onSchedule?: (appointment: Omit<Appointment, "id" | "status">) => void;
  onViewDetails?: (appointmentId: string) => void;
}

const AppointmentCalendar = ({
  appointments = [
    {
      id: "1",
      date: new Date(),
      time: "10:00 AM",
      doctor: "Dr. Sarah Johnson",
      type: "Check-up",
      status: "confirmed" as const,
      notes: "Annual physical examination",
    },
    {
      id: "2",
      date: addDays(new Date(), 3),
      time: "2:30 PM",
      doctor: "Dr. Michael Chen",
      type: "Follow-up",
      status: "pending" as const,
    },
    {
      id: "3",
      date: addDays(new Date(), 7),
      time: "11:15 AM",
      doctor: "Dr. Emily Rodriguez",
      type: "Consultation",
      status: "confirmed" as const,
    },
  ],
  onSchedule = () => {},
  onViewDetails = () => {},
}: AppointmentCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Form state for new appointment
  const [newAppointment, setNewAppointment] = useState({
    date: new Date(),
    time: "",
    doctor: "",
    type: "",
    notes: "",
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsDialogOpen(true);
  };

  const handleScheduleSubmit = () => {
    onSchedule({
      date: selectedDate || new Date(),
      time: newAppointment.time,
      doctor: newAppointment.doctor,
      type: newAppointment.type,
      notes: newAppointment.notes,
    });
    setIsScheduleDialogOpen(false);
    // Reset form
    setNewAppointment({
      date: new Date(),
      time: "",
      doctor: "",
      type: "",
      notes: "",
    });
  };

  // Filter appointments for the selected date
  const appointmentsForSelectedDate = appointments.filter(
    (appointment) => selectedDate && isSameDay(appointment.date, selectedDate),
  );

  // Function to get appointment dates for highlighting in calendar
  const getAppointmentDates = () => {
    return appointments.map((appointment) => appointment.date);
  };

  // Function to render the status badge with appropriate color
  const renderStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-white">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Calendar</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewAppointment((prev) => ({
                    ...prev,
                    date: selectedDate || new Date(),
                  }));
                  setIsScheduleDialogOpen(true);
                }}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border"
              // Highlight dates with appointments
              modifiers={{
                appointment: getAppointmentDates(),
              }}
              modifiersStyles={{
                appointment: {
                  fontWeight: "bold",
                  backgroundColor: "#e2f0ff",
                  borderRadius: "50%",
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-white">
          <CardHeader>
            <CardTitle>
              {selectedDate
                ? `Appointments for ${format(selectedDate, "MMMM d, yyyy")}`
                : "Select a date to view appointments"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointmentsForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {appointmentsForSelectedDate.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleAppointmentClick(appointment)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">
                          {appointment.type}
                        </h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{appointment.doctor}</span>
                        </div>
                      </div>
                      <div>{renderStatusBadge(appointment.status)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold">No appointments</h3>
                <p className="mt-1">No appointments scheduled for this date.</p>
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      setNewAppointment((prev) => ({
                        ...prev,
                        date: selectedDate || new Date(),
                      }));
                      setIsScheduleDialogOpen(true);
                    }}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Schedule Appointment Dialog */}
      <Dialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Date</label>
              <div className="col-span-3">
                <p className="text-sm">
                  {selectedDate
                    ? format(selectedDate, "MMMM d, yyyy")
                    : "Select a date"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Time</label>
              <div className="col-span-3">
                <Select
                  onValueChange={(value) =>
                    setNewAppointment((prev) => ({ ...prev, time: value }))
                  }
                  value={newAppointment.time}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                    <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                    <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                    <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Doctor</label>
              <div className="col-span-3">
                <Select
                  onValueChange={(value) =>
                    setNewAppointment((prev) => ({ ...prev, doctor: value }))
                  }
                  value={newAppointment.doctor}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. Sarah Johnson">
                      Dr. Sarah Johnson
                    </SelectItem>
                    <SelectItem value="Dr. Michael Chen">
                      Dr. Michael Chen
                    </SelectItem>
                    <SelectItem value="Dr. Emily Rodriguez">
                      Dr. Emily Rodriguez
                    </SelectItem>
                    <SelectItem value="Dr. David Wilson">
                      Dr. David Wilson
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Type</label>
              <div className="col-span-3">
                <Select
                  onValueChange={(value) =>
                    setNewAppointment((prev) => ({ ...prev, type: value }))
                  }
                  value={newAppointment.type}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Check-up">Check-up</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                    <SelectItem value="Urgent Care">Urgent Care</SelectItem>
                    <SelectItem value="Vaccination">Vaccination</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Notes</label>
              <div className="col-span-3">
                <Textarea
                  placeholder="Additional notes or concerns"
                  value={newAppointment.notes}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsScheduleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleScheduleSubmit}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Appointment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="font-medium text-lg">
                    {selectedAppointment.type}
                  </h3>
                  {renderStatusBadge(selectedAppointment.status)}
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="font-medium">Date:</div>
                  <div className="col-span-2">
                    {format(selectedAppointment.date, "MMMM d, yyyy")}
                  </div>

                  <div className="font-medium">Time:</div>
                  <div className="col-span-2">{selectedAppointment.time}</div>

                  <div className="font-medium">Doctor:</div>
                  <div className="col-span-2">{selectedAppointment.doctor}</div>

                  {selectedAppointment.notes && (
                    <>
                      <div className="font-medium">Notes:</div>
                      <div className="col-span-2">
                        {selectedAppointment.notes}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                {selectedAppointment.status === "confirmed" && (
                  <Button variant="destructive" size="sm">
                    Cancel Appointment
                  </Button>
                )}
                {selectedAppointment.status === "pending" && (
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                )}
                <Button size="sm" onClick={() => setIsDetailsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentCalendar;
