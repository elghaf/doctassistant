import React from "react";
import { useToast } from "@/components/ui/use-toast";
import PatientOverview from "../dashboard/PatientOverview";
import { usePatientData } from "@/hooks/usePatientData";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PatientHomeProps {
  patientId?: string;
  patientName?: string;
}

const PatientHome = ({
  patientId = "12345",
  patientName = "Sarah Johnson",
}: PatientHomeProps) => {
  const { toast } = useToast();

  // Use the custom hook to fetch and manage patient data
  const {
    loading,
    error,
    patientProfile,
    appointments,
    questionnaires,
    reports,
  } = usePatientData(patientId);

  // Use profile data if available
  const displayName = patientProfile?.name || patientName;

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
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
        <p className="text-gray-600">Welcome back, {displayName}</p>
      </div>

      <div className="space-y-6">
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
              count: 0,
              urgent: 0,
            },
          }}
        />
      </div>
    </div>
  );
};

export default PatientHome;
