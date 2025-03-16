import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentCalendar from "../appointments/AppointmentCalendar";
import AppointmentScheduler from "../appointments/AppointmentScheduler";
import UpcomingAppointments from "../appointments/UpcomingAppointments";
import { usePatientData } from "@/hooks/usePatientData";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";

const PatientAppointments = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { appointments, scheduleAppointment, cancelAppointment, refetchAppointments } = usePatientData(user?.id);

  // Handle appointment scheduling
  const handleScheduleAppointment = async (appointmentData: any) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    // Validate doctor_id
    if (!appointmentData.doctor_id) {
      toast({
        title: "Error",
        description: "Please select a doctor for the appointment",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Scheduling appointment with data:", {
        ...appointmentData,
        patient_id: user.id,
      });
      
      await scheduleAppointment({
        ...appointmentData,
        patient_id: user.id,
        // Ensure the date is properly formatted
        appointment_date: new Date(appointmentData.appointment_date).toISOString(),
        // Make sure doctor_id is included
        doctor_id: appointmentData.doctor_id,
        duration: appointmentData.duration || 30,
        status: appointmentData.status || 'pending'
      });
      
      await refetchAppointments();
      
      toast({
        title: "Appointment Scheduled",
        description: "Your appointment has been successfully scheduled.",
      });
    } catch (err) {
      console.error("Error in handleScheduleAppointment:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to schedule appointment. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Handle appointment cancellation
  const handleCancelAppointment = async (appointmentId: string) => {
    if (!appointmentId) {
      toast({
        title: "Error",
        description: "Invalid appointment ID",
        variant: "destructive",
      });
      return;
    }

    // Show confirmation toast before cancelling
    const confirmed = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmed) return;

    try {
      await cancelAppointment(appointmentId);
      
      // Refresh appointments data after cancellation
      await refetchAppointments(); // You'll need to add this function from usePatientData

      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to cancel appointment: ${errorMessage}`,
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
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
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
