import { supabase } from "./supabase";
import { Database } from "../types/supabase";
import {
  createAppointmentNotifications,
  createQuestionnaireNotification,
  createReportNotification,
} from "./notifications";

// Appointments API
export const appointmentsApi = {
  getUpcomingAppointments: async (patientId: string) => {
    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        id,
        appointment_date,
        status,
        reason,
        notes,
        duration,
        appointment_type,
        time_slot,
        doctor_id,
        profiles!doctor_id(name, email)
      `,
      )
      .eq("patient_id", patientId)
      .gte("appointment_date", new Date().toISOString())
      .order("appointment_date", { ascending: true });

    if (error) throw error;
    return data;
  },

  getAppointmentSlots: async (doctorId?: string, date?: string) => {
    let query = supabase
      .from("appointment_slots")
      .select("*")
      .eq("is_available", true);

    if (doctorId) {
      query = query.eq("doctor_id", doctorId);
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .gte("start_time", startOfDay.toISOString())
        .lte("start_time", endOfDay.toISOString());
    }

    const { data, error } = await query.order("start_time", {
      ascending: true,
    });
    if (error) throw error;
    return data;
  },

  scheduleAppointment: async (appointmentData: any) => {
    const { data, error } = await supabase
      .from("appointments")
      .insert(appointmentData)
      .select();

    if (error) throw error;

    // Create notifications for both patient and doctor
    try {
      await createAppointmentNotifications(
        appointmentData.patient_id,
        appointmentData.doctor_id,
        data[0],
        "created",
      );
    } catch (notificationError) {
      console.error(
        "Error creating appointment notifications:",
        notificationError,
      );
      // Don't throw here, we still want to return the appointment data
    }

    return data[0];
  },

  cancelAppointment: async (appointmentId: string) => {
    // First get the appointment to have patient and doctor IDs
    const { data: appointmentData, error: fetchError } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (fetchError) throw fetchError;

    // Update the appointment status
    const { data, error } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", appointmentId)
      .select();

    if (error) throw error;

    // Create notifications for both patient and doctor
    try {
      await createAppointmentNotifications(
        appointmentData.patient_id,
        appointmentData.doctor_id,
        data[0],
        "cancelled",
      );
    } catch (notificationError) {
      console.error(
        "Error creating appointment cancellation notifications:",
        notificationError,
      );
      // Don't throw here, we still want to return the appointment data
    }

    return data[0];
  },

  rescheduleAppointment: async (
    appointmentId: string,
    newDate: string,
    newTimeSlot: string,
  ) => {
    // First get the appointment to have patient and doctor IDs
    const { data: appointmentData, error: fetchError } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (fetchError) throw fetchError;

    // Update the appointment
    const { data, error } = await supabase
      .from("appointments")
      .update({
        appointment_date: newDate,
        time_slot: newTimeSlot,
        status: "pending",
      })
      .eq("id", appointmentId)
      .select();

    if (error) throw error;

    // Create notifications for both patient and doctor
    try {
      await createAppointmentNotifications(
        appointmentData.patient_id,
        appointmentData.doctor_id,
        data[0],
        "updated",
      );
    } catch (notificationError) {
      console.error(
        "Error creating appointment update notifications:",
        notificationError,
      );
      // Don't throw here, we still want to return the appointment data
    }

    return data[0];
  },
};

// Questionnaires API
export const questionnairesApi = {
  getPatientQuestionnaires: async (patientId: string) => {
    const { data, error } = await supabase
      .from("patient_questionnaires")
      .select(
        `
        id,
        status,
        due_date,
        completed_at,
        responses,
        questionnaires(id, title, description, type)
      `,
      )
      .eq("patient_id", patientId);

    if (error) throw error;
    return data;
  },

  getQuestionnaireById: async (questionnaireId: string) => {
    const { data, error } = await supabase
      .from("questionnaires")
      .select("*")
      .eq("id", questionnaireId)
      .single();

    if (error) throw error;
    return data;
  },

  submitQuestionnaire: async (
    patientQuestionnaireId: string,
    responses: any,
  ) => {
    // First get the questionnaire data
    const { data: questionnaireData, error: fetchError } = await supabase
      .from("patient_questionnaires")
      .select(
        `
        id,
        patient_id,
        questionnaires(id, title)
      `,
      )
      .eq("id", patientQuestionnaireId)
      .single();

    if (fetchError) throw fetchError;

    // Update the questionnaire
    const { data, error } = await supabase
      .from("patient_questionnaires")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        responses: responses,
      })
      .eq("id", patientQuestionnaireId)
      .select();

    if (error) throw error;

    // Create notification for patient
    try {
      await createQuestionnaireNotification(
        questionnaireData.patient_id,
        {
          id: questionnaireData.questionnaires.id,
          title: questionnaireData.questionnaires.title,
        },
        "completed",
      );
    } catch (notificationError) {
      console.error(
        "Error creating questionnaire completion notification:",
        notificationError,
      );
      // Don't throw here, we still want to return the data
    }

    return data[0];
  },
};

// Medical Reports API
export const reportsApi = {
  getPatientReports: async (patientId: string) => {
    const { data, error } = await supabase
      .from("medical_reports")
      .select(
        `
        id,
        title,
        type,
        summary,
        ai_summary,
        status,
        report_date,
        doctor_id,
        profiles!doctor_id(name)
      `,
      )
      .eq("patient_id", patientId)
      .order("report_date", { ascending: false });

    if (error) throw error;
    return data;
  },

  getReportById: async (reportId: string) => {
    const { data, error } = await supabase
      .from("medical_reports")
      .select(
        `
        id,
        title,
        type,
        summary,
        ai_summary,
        status,
        report_date,
        doctor_id,
        profiles!doctor_id(name)
      `,
      )
      .eq("id", reportId)
      .single();

    if (error) throw error;
    return data;
  },
};

// Patient Profile API
export const profileApi = {
  getPatientProfile: async (patientId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", patientId)
      .single();

    if (error) throw error;
    return data;
  },

  updatePatientProfile: async (patientId: string, profileData: any) => {
    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", patientId)
      .select();

    if (error) throw error;
    return data[0];
  },
};
