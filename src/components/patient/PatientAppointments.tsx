import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import AppointmentCalendar from "../appointments/AppointmentCalendar";
import AppointmentScheduler from "../appointments/AppointmentScheduler";
import UpcomingAppointments from "../appointments/UpcomingAppointments";
import { usePatientData } from "@/hooks/usePatientData";
import { useToast } from "@/components/ui/use-toast";

interface PatientAppointmentsProps {
  patientId?: string;
}

const PatientAppointments = ({
  patientId = "12345",
}: PatientAppointmentsProps) => {
  const { toast } = useToast();
  const { appointments, scheduleAppointment, cancelAppointment } =
    usePatientData(patientId);

  // Handle appointment scheduling
  const handleScheduleAppointment = async (appointmentData: any) => {
    try {
      await scheduleAppointment(appointmentData);
      toast({
        title: "Appointment Scheduled",
        description: "Your appointment has been successfully scheduled.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId);
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-600">Manage your medical appointments</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6 bg-white">
          <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="schedule">Schedule New</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <UpcomingAppointments
                appointments={appointments.map((appointment) => ({
                  id: appointment.id,
                  doctorName: appointment.profiles?.name || "Doctor",
                  doctorSpecialty: "General Practitioner", // This would come from doctor profile
                  date: new Date(appointment.appointment_date),
                  time: appointment.time_slot || "9:00 AM",
                  location: "Main Clinic", // This would come from appointment location
                  status: appointment.status || "pending",
                }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <AppointmentCalendar
                appointments={appointments.map((appointment) => ({
                  id: appointment.id,
                  date: new Date(appointment.appointment_date),
                  time: appointment.time_slot || "9:00 AM",
                  doctor: appointment.profiles?.name || "Doctor",
                  type: appointment.appointment_type || "Check-up",
                  status: appointment.status || "pending",
                  notes: appointment.notes,
                }))}
                onSchedule={handleScheduleAppointment}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardContent className="p-0">
              <AppointmentScheduler
                onAppointmentRequest={handleScheduleAppointment}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientAppointments;
