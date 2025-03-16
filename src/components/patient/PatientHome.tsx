import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePatientData } from "@/hooks/usePatientData";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PatientOverview from "../dashboard/PatientOverview";

const PatientHome = () => {
  const { user } = useAuth();
  const { loading, error, patientProfile, appointments, questionnaires, reports } = usePatientData(user?.id || "");

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  const summaryData = {
    nextAppointment: appointments?.[0],
    pendingQuestionnaires: questionnaires?.filter(q => q.status === 'pending').length || 0,
    recentLabResults: {
      count: reports?.length || 0,
      new: reports?.filter(r => !r.viewed).length || 0,
    },
    notifications: {
      count: 0, // Replace with actual notifications count
      urgent: 0, // Replace with actual urgent notifications count
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <PatientOverview
          patientName={patientProfile?.name}
          patientId={user?.id}
          summaryData={summaryData}
        />
      </div>
    </div>
  );
};

export default PatientHome;
