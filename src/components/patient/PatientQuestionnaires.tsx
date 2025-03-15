import React from "react";
import QuestionnaireManager from "../questionnaires/QuestionnaireManager";
import { usePatientData } from "@/hooks/usePatientData";
import { useToast } from "@/components/ui/use-toast";

interface PatientQuestionnairesProps {
  patientId?: string;
}

const PatientQuestionnaires = ({
  patientId = "12345",
}: PatientQuestionnairesProps) => {
  const { toast } = useToast();
  const { submitQuestionnaire } = usePatientData(patientId);

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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Health Questionnaires
        </h1>
        <p className="text-gray-600">Complete your health assessments</p>
      </div>

      <QuestionnaireManager
        patientId={patientId}
        onSubmitQuestionnaire={handleSubmitQuestionnaire}
      />
    </div>
  );
};

export default PatientQuestionnaires;
