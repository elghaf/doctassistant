import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UserPlus, Clipboard, Stethoscope, CheckCircle } from "lucide-react";
import PatientDetailsForm from "./PatientDetailsForm";
import MedicalHistoryForm from "./MedicalHistoryForm";
import SymptomsForm from "./SymptomsForm";
import { supabase } from "@/lib/supabase";

interface AddPatientModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({
  open = false,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [patientDetails, setPatientDetails] = useState<any>(null);
  const [medicalHistory, setMedicalHistory] = useState<any>(null);
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const [newPatientId, setNewPatientId] = useState<string | null>(null);

  const progress = (currentStep / 4) * 100;

  const resetForm = () => {
    setCurrentStep(1);
    setPatientDetails(null);
    setMedicalHistory(null);
    setSymptoms([]);
    setIsComplete(false);
    setIsSubmitting(false);
    setNewPatientId(null);
    if (onOpenChange) onOpenChange(false);
  };

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const getActiveTab = () => {
    switch (currentStep) {
      case 1:
        return "details";
      case 2:
        return "medical-history";
      case 3:
        return "symptoms";
      case 4:
        return "complete";
      default:
        return "details";
    }
  };

  const handlePatientDetailsSubmit = async (data: any) => {
    setPatientDetails(data);
    goToNextStep();
  };

  const handleMedicalHistorySubmit = async (data: any) => {
    setMedicalHistory(data);
    goToNextStep();
  };

  const handleSymptomsSubmit = async (data: any) => {
    setSymptoms(data);
    await finalizePatientCreation();
  };

  const finalizePatientCreation = async () => {
    try {
      setIsSubmitting(true);

      // 1. Create patient
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert({
          first_name: patientDetails.firstName,
          last_name: patientDetails.lastName,
          date_of_birth: patientDetails.dateOfBirth,
          gender: patientDetails.gender,
          email: patientDetails.email,
          phone: patientDetails.phone,
          address: patientDetails.address,
          city: patientDetails.city,
          state: patientDetails.state,
          zip_code: patientDetails.zipCode,
        })
        .select()
        .single();

      if (patientError) throw patientError;

      // Save the new patient ID
      setNewPatientId(patient.id);

      // 2. Create medical history
      if (medicalHistory) {
        const { error: historyError } = await supabase
          .from('medical_history')
          .insert({
            patient_id: patient.id,
            conditions: medicalHistory.conditions || [],
            allergies: medicalHistory.allergies || [],
            surgeries: medicalHistory.surgeries || [],
            family_history: medicalHistory.familyHistory || {},
            lifestyle: medicalHistory.lifestyle || {},
          });

        if (historyError) throw historyError;
      }

      // 3. Create symptoms
      if (symptoms.length > 0) {
        const { error: symptomsError } = await supabase
          .from('symptoms')
          .insert(
            symptoms.map(symptom => ({
              patient_id: patient.id,
              name: symptom.name,
              severity: symptom.severity,
              duration: symptom.duration,
              notes: symptom.notes,
            }))
          );

        if (symptomsError) throw symptomsError;
      }

      setIsComplete(true);
      goToNextStep();
    } catch (error) {
      console.error('Error creating patient:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewProfile = () => {
    if (newPatientId) {
      navigate(`/patients/${newPatientId}`);
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <Tabs value={getActiveTab()} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="details" disabled>
              <UserPlus className="h-4 w-4 mr-2" />
              Patient Details
            </TabsTrigger>
            <TabsTrigger value="medical-history" disabled>
              <Clipboard className="h-4 w-4 mr-2" />
              Medical History
            </TabsTrigger>
            <TabsTrigger value="symptoms" disabled>
              <Stethoscope className="h-4 w-4 mr-2" />
              Symptoms
            </TabsTrigger>
            <TabsTrigger value="complete" disabled>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete
            </TabsTrigger>
          </TabsList>

          <Progress value={progress} className="mb-6" />

          <TabsContent value="details">
            <PatientDetailsForm
              onSubmit={handlePatientDetailsSubmit}
              defaultValues={patientDetails}
            />
          </TabsContent>

          <TabsContent value="medical-history">
            <MedicalHistoryForm
              onSubmit={handleMedicalHistorySubmit}
              onBack={goToPreviousStep}
              initialData={medicalHistory}
            />
          </TabsContent>

          <TabsContent value="symptoms">
            <SymptomsForm
              initialSymptoms={symptoms}
              onSave={handleSymptomsSubmit}
              onBack={goToPreviousStep}
            />
          </TabsContent>

          <TabsContent value="complete">
            {isSubmitting ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                <p className="mt-4">Creating patient record...</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Patient Added Successfully</h3>
                <p className="text-gray-600 mb-6">
                  The patient record has been created successfully.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={handleViewProfile}>
                    View Patient Profile
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Add Another Patient
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientModal;
