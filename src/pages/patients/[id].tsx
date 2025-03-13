import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PatientHeader from "@/components/patients/PatientHeader";
import PatientTabs from "@/components/patients/PatientTabs";
import { PatientProvider } from "@/components/patients/PatientContext";
import { getPatientById } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email?: string;
  status?: string;
}

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPatient(id);
    }
  }, [id]);

  const fetchPatient = async (patientId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPatientById(patientId);
      setPatient(data);
    } catch (err) {
      console.error("Error fetching patient:", err);
      setError("Failed to load patient data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/patients");
  };

  const handleEdit = () => {
    // Implement edit functionality
    console.log("Edit patient", id);
  };

  const handleSchedule = () => {
    // Implement schedule appointment functionality
    console.log("Schedule appointment for patient", id);
  };

  const handleGenerateReport = () => {
    // Implement report generation functionality
    console.log("Generate report for patient", id);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="w-full h-full flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !patient) {
    return (
      <DashboardLayout>
        <div className="w-full h-full flex flex-col justify-center items-center p-6">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start max-w-md">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium">Error Loading Patient</h3>
              <p className="text-sm">{error || "Patient not found"}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-4 flex items-center gap-2"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Patients
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Format patient data for the header component
  const patientHeaderData = {
    id: patient.id,
    name: `${patient.first_name} ${patient.last_name}`,
    age: calculateAge(patient.date_of_birth),
    gender: patient.gender,
    dob: patient.date_of_birth,
    phone: patient.phone,
    email: patient.email || "",
    status: patient.status as "active" | "inactive" | "pending" | undefined,
  };

  return (
    <PatientProvider patientId={id}>
      <DashboardLayout>
        <div className="w-full h-full flex flex-col bg-gray-50">
          <PatientHeader
            patient={patientHeaderData}
            onBack={handleBack}
            onEdit={handleEdit}
            onSchedule={handleSchedule}
            onGenerateReport={handleGenerateReport}
          />
          <div className="flex-1 overflow-auto p-6">
            <PatientTabs patientId={id} />
          </div>
        </div>
      </DashboardLayout>
    </PatientProvider>
  );
};

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export default PatientDetailPage;
