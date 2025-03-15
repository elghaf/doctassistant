import React, { useState } from "react";
import PatientList from "../patients/PatientList";
import PatientDetails from "../patients/PatientDetails";
import { Button } from "@/components/ui/button";

const DoctorPatients = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );

  // Handle patient selection
  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  // Handle back to patient list
  const handleBackToPatients = () => {
    setSelectedPatientId(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
        <p className="text-gray-600">Manage your patient records</p>
      </div>

      {selectedPatientId ? (
        <div>
          <Button
            variant="outline"
            onClick={handleBackToPatients}
            className="mb-4"
          >
            Back to Patient List
          </Button>
          <PatientDetails patientId={selectedPatientId} />
        </div>
      ) : (
        <PatientList onPatientSelect={handlePatientSelect} />
      )}
    </div>
  );
};

export default DoctorPatients;
