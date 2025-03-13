import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SupabaseSetup } from "@/components/ui/env-setup";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Users,
  Activity,
  Calendar,
  FileText,
  PlusCircle,
  Search,
  Bell,
  ChevronRight,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardContent from "@/components/dashboard/DashboardContent";
import AddPatientModal from "@/components/patients/AddPatientModal";
import AISummaryModal from "@/components/ai/AISummaryModal";
import ReportBuilderModal from "@/components/reports/ReportBuilderModal";
import AppointmentModal from "@/components/appointments/AppointmentModal";
import DataManagementModal from "@/components/data/DataManagementModal";

const Home = () => {
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isAISummaryOpen, setIsAISummaryOpen] = useState(false);
  const [isReportBuilderOpen, setIsReportBuilderOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    const checkSupabaseConfig = async () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        try {
          const { supabase } = await import("@/lib/supabase");
          const { error } = await supabase
            .from("patients")
            .select("count", { count: "exact", head: true });

          if (!error) {
            setIsSupabaseConfigured(true);
          } else {
            setIsSupabaseModalOpen(true);
          }
        } catch (err) {
          console.error("Error connecting to Supabase:", err);
          setIsSupabaseModalOpen(true);
        }
      } else {
        setIsSupabaseModalOpen(true);
      }
    };

    checkSupabaseConfig();
  }, []);

  // Handlers for opening modals
  const handleAddPatient = () => setIsAddPatientOpen(true);
  const handleGenerateReport = () => setIsReportBuilderOpen(true);
  const handleScheduleAppointment = () => setIsAppointmentModalOpen(true);
  const handleManageData = () => setIsDataManagementOpen(true);
  const handleAISummary = () => setIsAISummaryOpen(true);

  // Handlers for navigation
  const handleViewAllPatients = () => {
    // In a real app, this would navigate to the patients page
    console.log("Navigate to patients page");
  };

  const handleViewAllAppointments = () => {
    // In a real app, this would navigate to the appointments page
    console.log("Navigate to appointments page");
  };

  const handleViewPatient = (id: string) => {
    // In a real app, this would navigate to the patient detail page
    console.log(`Navigate to patient ${id} details`);
  };

  const handleViewAppointment = (id: string) => {
    // In a real app, this would navigate to the appointment detail or open a modal
    console.log(`View appointment ${id} details`);
  };

  return (
    <DashboardLayout>
      <DashboardContent
        onAddPatient={handleAddPatient}
        onGenerateReport={handleGenerateReport}
        onScheduleAppointment={handleScheduleAppointment}
        onManageData={handleManageData}
        onAISummary={handleAISummary}
        onViewAllPatients={handleViewAllPatients}
        onViewAllAppointments={handleViewAllAppointments}
        onViewPatient={handleViewPatient}
        onViewAppointment={handleViewAppointment}
      />

      {/* Modals */}
      <AddPatientModal
        open={isAddPatientOpen}
        onOpenChange={setIsAddPatientOpen}
        onPatientAdded={(data) => {
          console.log("Patient added:", data);
          setIsAddPatientOpen(false);
        }}
      />

      <AISummaryModal
        isOpen={isAISummaryOpen}
        onOpenChange={setIsAISummaryOpen}
        onSaveSummary={(summary) => {
          console.log("Summary saved:", summary);
          setIsAISummaryOpen(false);
        }}
      />

      <ReportBuilderModal
        open={isReportBuilderOpen}
        onOpenChange={setIsReportBuilderOpen}
        onSave={(reportData) => {
          console.log("Report saved:", reportData);
          setIsReportBuilderOpen(false);
        }}
      />

      <AppointmentModal
        open={isAppointmentModalOpen}
        onOpenChange={setIsAppointmentModalOpen}
        onSave={(data) => {
          console.log("Appointment saved:", data);
          setIsAppointmentModalOpen(false);
        }}
      />

      <DataManagementModal
        open={isDataManagementOpen}
        onOpenChange={setIsDataManagementOpen}
        onExport={(format, options) => {
          console.log(
            `Exporting data in ${format} format with options:`,
            options,
          );
        }}
        onImport={(file) => {
          console.log("Importing data from file:", file.name);
        }}
      />

      {/* Supabase Configuration Modal */}
      <Dialog open={isSupabaseModalOpen} onOpenChange={setIsSupabaseModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Database Configuration</DialogTitle>
            <DialogDescription>
              Configure your Supabase database connection to enable data
              persistence.
            </DialogDescription>
          </DialogHeader>
          <SupabaseSetup />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Home;
