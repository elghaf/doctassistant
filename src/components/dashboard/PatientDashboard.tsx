import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import DashboardSidebar from "./DashboardSidebar";
import PatientOverview from "./PatientOverview";
import AppointmentCalendar from "../appointments/AppointmentCalendar";
import AppointmentScheduler from "../appointments/AppointmentScheduler";
import UpcomingAppointments from "../appointments/UpcomingAppointments";
import QuestionnaireManager from "../questionnaires/QuestionnaireManager";
import PatientReportViewer from "../reports/PatientReportViewer";
import NotificationCenter from "../notifications/NotificationCenter";
import { usePatientData } from "@/hooks/usePatientData";
import { supabase } from "@/lib/supabase";

interface PatientDashboardProps {
  patientId?: string;
  patientName?: string;
  patientAvatar?: string;
}

const PatientDashboard = ({
  patientId = "12345", // This would come from auth in a real app
  patientName = "Sarah Johnson",
  patientAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
}: PatientDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [notificationCount, setNotificationCount] = useState(0);
  const { toast } = useToast();

  // Use the custom hook to fetch and manage patient data
  const {
    loading,
    error,
    patientProfile,
    appointments,
    questionnaires,
    reports,
    scheduleAppointment,
    cancelAppointment,
    submitQuestionnaire,
  } = usePatientData(patientId);

  // Use profile data if available
  const displayName = patientProfile?.name || patientName;

  // Fetch unread notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const { count, error } = await supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", patientId)
          .eq("status", "unread");

        if (error) throw error;
        setNotificationCount(count || 0);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotificationCount();

    // Subscribe to notifications to update count in real-time
    const subscription = supabase
      .channel(`public:notifications:user_id:${patientId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${patientId}`,
        },
        () => {
          fetchNotificationCount();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [patientId]);

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

  // Handle questionnaire submission
  const handleSubmitQuestionnaire = async (
    questionnaireId: string,
    data: any,
  ) => {
    try {
      await submitQuestionnaire(questionnaireId, data);
      toast({
        title: "Questionnaire Submitted",
        description: "Your questionnaire has been successfully submitted.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to submit questionnaire. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Format appointments for the calendar component
  const formattedAppointments = appointments.map((appointment) => ({
    id: appointment.id,
    date: new Date(appointment.appointment_date),
    time: appointment.time_slot || "9:00 AM", // Fallback time if not specified
    doctor: appointment.profiles?.name || "Doctor",
    type: appointment.appointment_type || "Check-up",
    status: appointment.status || "pending",
    notes: appointment.notes,
  }));

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <DashboardSidebar
        userType="patient"
        userName={displayName}
        userAvatar={patientAvatar}
        activePath="/dashboard"
      />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Patient Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {displayName}</p>
          </div>
          <NotificationCenter 
            userId={patientId}
            userRole="patient"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-white">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="questionnaires">Questionnaires</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <PatientOverview
              patientName={displayName}
              patientId={patientId}
              summaryData={{
                nextAppointment: formattedAppointments[0]
                  ? {
                      date: formattedAppointments[0].date.toISOString(),
                      time: formattedAppointments[0].time,
                      doctor: formattedAppointments[0].doctor,
                      type: formattedAppointments[0].type,
                    }
                  : undefined,
                pendingQuestionnaires: questionnaires.filter(
                  (q) => q.status === "pending",
                ).length,
                recentLabResults: {
                  count: reports.filter((r) => r.type === "lab results").length,
                  new: reports.filter(
                    (r) =>
                      r.type === "lab results" &&
                      new Date(r.report_date) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                  ).length,
                },
                notifications: {
                  count: 0, // Would come from notifications table
                  urgent: 0,
                },
              }}
            />
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardContent className="p-0">
                  <AppointmentCalendar
                    appointments={formattedAppointments}
                    onSchedule={handleScheduleAppointment}
                  />
                </CardContent>
              </Card>
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
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card>
              <CardContent className="p-0">
                <AppointmentScheduler
                  onAppointmentRequest={handleScheduleAppointment}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questionnaires Tab */}
          <TabsContent value="questionnaires">
            <QuestionnaireManager
              patientId={patientId}
              onSubmitQuestionnaire={handleSubmitQuestionnaire}
            />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <PatientReportViewer
              patientName={displayName}
              reports={reports.map((report) => ({
                id: report.id,
                title: report.title,
                date: report.report_date,
                type: report.type,
                summary: report.summary,
                aiSummary: report.ai_summary,
                status: report.status,
                doctor: report.profiles?.name || "Doctor",
              }))}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDashboard;
