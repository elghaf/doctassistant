import { supabase } from "./supabase";

// Function to subscribe to real-time updates for a specific table
export const subscribeToTable = (
  table: string,
  callback: (payload: any) => void,
) => {
  const subscription = supabase
    .channel(`public:${table}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      (payload) => {
        callback(payload);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

// Function to subscribe to appointments for a specific user
export const subscribeToAppointments = (
  userId: string,
  userRole: "patient" | "doctor",
  callback: (payload: any) => void,
) => {
  const field = userRole === "patient" ? "patient_id" : "doctor_id";

  const subscription = supabase
    .channel(`public:appointments:${field}:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "appointments",
        filter: `${field}=eq.${userId}`,
      },
      (payload) => {
        callback(payload);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

// Function to subscribe to notifications for a specific user
export const subscribeToNotifications = (
  userId: string,
  callback: (payload: any) => void,
) => {
  const subscription = supabase
    .channel(`public:notifications:user_id:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};
