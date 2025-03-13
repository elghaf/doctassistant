import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReportBuilderModal from '@/components/reports/ReportBuilderModal';

const ReportsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Only show the modal when we have a selected patient
  const handleCreateReport = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div>
        {/* Your reports list/table here */}
      </div>

      {/* Only render modal if we have a selected patient */}
      {selectedPatient && (
        <ReportBuilderModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          patientData={{
            id: selectedPatient.id,
            name: selectedPatient.name,
            age: selectedPatient.age,
            gender: selectedPatient.gender,
            dob: selectedPatient.dob,
            diagnosis: selectedPatient.diagnosis || [],
            medications: selectedPatient.medications || [],
            vitals: selectedPatient.vitals || {
              bloodPressure: '',
              heartRate: 0,
              temperature: 0
            }
          }}
          onSave={(reportData) => {
            console.log('Report saved:', reportData);
            setIsModalOpen(false);
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default ReportsPage;
