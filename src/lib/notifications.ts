import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";

export type NotificationType =
  | "appointment"
  | "questionnaire"
  | "report"
  | "message"
  | "system";

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Create a notification for a user
export const createNotification = async ({
  userId,
  title,
  message,
  type,
  actionUrl,
  metadata,
}: CreateNotificationParams) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        id: uuidv4(),
        user_id: userId,
        title,
        message,
        type,
        status: "unread",
        created_at: new Date().toISOString(),
        action_url: actionUrl,
        metadata,
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Create appointment notifications for both patient and doctor
export const createAppointmentNotifications = async (
  patientId: string,
  doctorId: string,
  appointmentData: any,
  action: "created" | "updated" | "cancelled",
) => {
  const appointmentDate = new Date(appointmentData.appointment_date);
  const formattedDate = appointmentDate.toLocaleDateString();
  const timeSlot = appointmentData.time_slot || "";

  let patientTitle = "";
  let patientMessage = "";
  let doctorTitle = "";
  let doctorMessage = "";

  switch (action) {
    case "created":
      patientTitle = "Appointment Scheduled";
      patientMessage = `Your appointment has been scheduled for ${formattedDate} at ${timeSlot}.`;
      doctorTitle = "New Appointment";
      doctorMessage = `A new appointment has been scheduled for ${formattedDate} at ${timeSlot}.`;
      break;
    case "updated":
      patientTitle = "Appointment Updated";
      patientMessage = `Your appointment has been rescheduled to ${formattedDate} at ${timeSlot}.`;
      doctorTitle = "Appointment Updated";
      doctorMessage = `An appointment has been rescheduled to ${formattedDate} at ${timeSlot}.`;
      break;
    case "cancelled":
      patientTitle = "Appointment Cancelled";
      patientMessage = `Your appointment for ${formattedDate} at ${timeSlot} has been cancelled.`;
      doctorTitle = "Appointment Cancelled";
      doctorMessage = `An appointment for ${formattedDate} at ${timeSlot} has been cancelled.`;
      break;
  }

  const actionUrl = `/appointments/${appointmentData.id}`;

  try {
    // Create notification for patient
    await createNotification({
      userId: patientId,
      title: patientTitle,
      message: patientMessage,
      type: "appointment",
      actionUrl,
      metadata: { appointmentId: appointmentData.id },
    });

    // Create notification for doctor
    await createNotification({
      userId: doctorId,
      title: doctorTitle,
      message: doctorMessage,
      type: "appointment",
      actionUrl,
      metadata: { appointmentId: appointmentData.id, patientId },
    });
  } catch (error) {
    console.error("Error creating appointment notifications:", error);
    throw error;
  }
};

// Create questionnaire notification
export const createQuestionnaireNotification = async (
  userId: string,
  questionnaireData: any,
  action: "assigned" | "completed" | "reminder",
) => {
  let title = "";
  let message = "";

  switch (action) {
    case "assigned":
      title = "New Health Questionnaire";
      message = `You have been assigned a new health questionnaire: ${questionnaireData.title}.`;
      break;
    case "completed":
      title = "Questionnaire Completed";
      message = `You have completed the ${questionnaireData.title} questionnaire.`;
      break;
    case "reminder":
      title = "Questionnaire Reminder";
      message = `Reminder: Please complete your ${questionnaireData.title} questionnaire.`;
      break;
  }

  const actionUrl = `/questionnaires/${questionnaireData.id}`;

  try {
    await createNotification({
      userId,
      title,
      message,
      type: "questionnaire",
      actionUrl,
      metadata: { questionnaireId: questionnaireData.id },
    });
  } catch (error) {
    console.error("Error creating questionnaire notification:", error);
    throw error;
  }
};

// Create medical report notification
export const createReportNotification = async (
  patientId: string,
  reportData: any,
) => {
  try {
    await createNotification({
      userId: patientId,
      title: "New Medical Report",
      message: `A new medical report (${reportData.title}) is available for your review.`,
      type: "report",
      actionUrl: `/reports/${reportData.id}`,
      metadata: { reportId: reportData.id },
    });
  } catch (error) {
    console.error("Error creating report notification:", error);
    throw error;
  }
};

// Create message notification
export const createMessageNotification = async (
  recipientId: string,
  senderId: string,
  senderName: string,
  messagePreview: string,
) => {
  try {
    await createNotification({
      userId: recipientId,
      title: "New Message",
      message: `${senderName}: ${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? "..." : ""}`,
      type: "message",
      actionUrl: `/messages/${senderId}`,
      metadata: { senderId },
    });
  } catch (error) {
    console.error("Error creating message notification:", error);
    throw error;
  }
};
