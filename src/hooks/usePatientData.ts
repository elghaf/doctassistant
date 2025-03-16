import { useState, useEffect } from "react";
import {
  appointmentsApi,
  questionnairesApi,
  reportsApi,
  profileApi,
} from "../lib/api";
import { supabase } from "../lib/supabase";

// Helper function to validate UUID format
function isValidUUID(uuid: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function usePatientData(patientId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (!patientId) return;

    // Check if patientId is a valid UUID
    if (!isValidUUID(patientId)) {
      setError(new Error("Invalid patient ID format. Must be a valid UUID."));
      setLoading(false);
      return;
    }

    const fetchPatientData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const [profileData, appointmentsData, questionnairesData, reportsData] =
          await Promise.all([
            profileApi.getPatientProfile(patientId),
            appointmentsApi.getUpcomingAppointments(patientId),
            questionnairesApi.getPatientQuestionnaires(patientId),
            reportsApi.getPatientReports(patientId),
          ]);

        setPatientProfile(profileData);
        setAppointments(appointmentsData);
        setQuestionnaires(questionnairesData);
        setReports(reportsData);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();

    // Set up realtime subscriptions
    const appointmentsSubscription = supabase
      .channel("appointments-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `patient_id=eq.${patientId}`,
        },
        () => {
          appointmentsApi
            .getUpcomingAppointments(patientId)
            .then((data) => setAppointments(data))
            .catch((err) => console.error("Error updating appointments:", err));
        },
      )
      .subscribe();

    const questionnairesSubscription = supabase
      .channel("questionnaires-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "patient_questionnaires",
          filter: `patient_id=eq.${patientId}`,
        },
        () => {
          questionnairesApi
            .getPatientQuestionnaires(patientId)
            .then((data) => setQuestionnaires(data))
            .catch((err) =>
              console.error("Error updating questionnaires:", err),
            );
        },
      )
      .subscribe();

    const reportsSubscription = supabase
      .channel("reports-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "medical_reports",
          filter: `patient_id=eq.${patientId}`,
        },
        () => {
          reportsApi
            .getPatientReports(patientId)
            .then((data) => setReports(data))
            .catch((err) => console.error("Error updating reports:", err));
        },
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      appointmentsSubscription.unsubscribe();
      questionnairesSubscription.unsubscribe();
      reportsSubscription.unsubscribe();
    };
  }, [patientId]);

  // Functions to update data
  const scheduleAppointment = async (appointmentData: any) => {
    try {
      console.log("Scheduling appointment with data:", appointmentData);
      
      // Validate required fields
      if (!appointmentData.doctor_id) {
        throw new Error("Doctor ID is required for scheduling an appointment");
      }
      
      if (!appointmentData.appointment_date) {
        throw new Error("Appointment date is required");
      }
      
      // Ensure we're using the correct column names and all required fields
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: patientId,
          doctor_id: appointmentData.doctor_id,
          appointment_date: appointmentData.appointment_date,
          time_slot: appointmentData.time_slot || "9:00 AM",
          appointment_type: appointmentData.appointment_type || "Check-up",
          status: appointmentData.status || 'scheduled',
          notes: appointmentData.notes || '',
          duration: appointmentData.duration || 30,
        })
        .select();

      if (error) {
        console.error("Database error when scheduling appointment:", error);
        throw error;
      }
      
      // Add the new appointment to the state
      setAppointments(prev => [...prev, data[0]]);
      return data[0];
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      throw error;
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      if (!isValidUUID(appointmentId)) {
        throw new Error("Invalid appointment ID format. Must be a valid UUID.");
      }

      const updatedAppointment =
        await appointmentsApi.cancelAppointment(appointmentId);
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? updatedAppointment : app,
        ),
      );
      return updatedAppointment;
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      throw err;
    }
  };

  const submitQuestionnaire = async (
    patientQuestionnaireId: string,
    responses: any,
  ) => {
    try {
      if (!isValidUUID(patientQuestionnaireId)) {
        throw new Error(
          "Invalid questionnaire ID format. Must be a valid UUID.",
        );
      }

      const updatedQuestionnaire = await questionnairesApi.submitQuestionnaire(
        patientQuestionnaireId,
        responses,
      );
      setQuestionnaires((prev) =>
        prev.map((q) =>
          q.id === patientQuestionnaireId ? updatedQuestionnaire : q,
        ),
      );
      return updatedQuestionnaire;
    } catch (err) {
      console.error("Error submitting questionnaire:", err);
      throw err;
    }
  };

  const refetchAppointments = async () => {
    // Implement the logic to fetch updated appointments
    const { data, error } = await supabase
      .from('appointments')
      .select('*, profiles(*)')
      .eq('patient_id', patientId)
      .order('appointment_date', { ascending: true });

    if (error) throw error;
    setAppointments(data || []);
  };

  return {
    loading,
    error,
    patientProfile,
    appointments,
    questionnaires,
    reports,
    scheduleAppointment,
    cancelAppointment,
    submitQuestionnaire,
    refetchAppointments,
  };
}
