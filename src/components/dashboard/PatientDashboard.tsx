import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePatientData } from "@/hooks/usePatientData";
import PatientOverview from "./PatientOverview";
import Header from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const PatientDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { appointments, questionnaires, reports } = usePatientData(user?.id || "");

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        userName={user?.name}
        userRole="patient"
        userAvatar={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=patient"}
        notificationCount={3}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
        </div>

        <div className="space-y-6">
          <PatientOverview
            patientName={user?.name || ""}
            patientId={user?.id || ""}
            summaryData={{
              nextAppointment: appointments?.[0],
              pendingQuestionnaires: questionnaires?.filter(q => q.status === "pending").length || 0,
              recentLabResults: {
                count: reports?.length || 0,
                new: reports?.filter(r => !r.viewed).length || 0,
              },
              notifications: {
                count: 3,
                urgent: 1,
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
