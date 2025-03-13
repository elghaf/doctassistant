import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://iskqxrxunokidopnvlfg.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlza3F4cnh1bm9raWRvcG52bGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MTA5NTYsImV4cCI6MjA1NzM4Njk1Nn0.NBNVkzYYDEe64S1JgnmXgnFaxdDFo4JIPFnK3N5HsJo";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Database helper functions

// Patients
export async function getPatients() {
  const { data, error } = await supabase.from("patients").select("*");
  if (error) throw error;
  return data;
}

// Patient Summaries
export async function getPatientSummaries(patientId: string) {
  const { data, error } = await supabase
    .from("patient_summaries")
    .select("*")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function savePatientSummary(patientId: string, summary: string) {
  const { data, error } = await supabase
    .from("patient_summaries")
    .insert({
      patient_id: patientId,
      summary,
    })
    .select();
  if (error) throw error;
  return data[0];
}

export async function getPatientById(id: string) {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createPatient(patientData: any) {
  const { data, error } = await supabase
    .from("patients")
    .insert(patientData)
    .select();
  if (error) throw error;
  return data[0];
}

export async function updatePatient(id: string, patientData: any) {
  const { data, error } = await supabase
    .from("patients")
    .update(patientData)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
}

// Medical History
export async function getMedicalHistoryByPatientId(patientId: string) {
  const { data, error } = await supabase
    .from("medical_history")
    .select("*")
    .eq("patient_id", patientId)
    .single();
  if (error && error.code !== "PGRST116") throw error; // PGRST116 is the error code for no rows returned
  return data;
}

export async function createMedicalHistory(medicalHistoryData: any) {
  const { data, error } = await supabase
    .from("medical_history")
    .insert(medicalHistoryData)
    .select();
  if (error) throw error;
  return data[0];
}

export async function updateMedicalHistory(
  id: string,
  medicalHistoryData: any,
) {
  const { data, error } = await supabase
    .from("medical_history")
    .update(medicalHistoryData)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
}

// Appointments
export async function getAppointments() {
  const { data, error } = await supabase.from("appointments").select("*");
  if (error) throw error;
  return data;
}

export async function getAppointmentsByPatientId(patientId: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("patient_id", patientId);
  if (error) throw error;
  return data;
}

export async function createAppointment(appointmentData: any) {
  const { data, error } = await supabase
    .from("appointments")
    .insert(appointmentData)
    .select();
  if (error) throw error;
  return data[0];
}

// Reports
export async function getReportsByPatientId(patientId: string) {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("patient_id", patientId);
  if (error) throw error;
  return data;
}

export async function createReport(reportData: any) {
  const { data, error } = await supabase
    .from("reports")
    .insert(reportData)
    .select();
  if (error) throw error;
  return data[0];
}

// Visits
export async function getVisitsByPatientId(patientId: string) {
  const { data, error } = await supabase
    .from("visits")
    .select("*")
    .eq("patient_id", patientId)
    .order("visit_date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createVisit(visitData: any) {
  const { data, error } = await supabase
    .from("visits")
    .insert(visitData)
    .select();
  if (error) throw error;
  return data[0];
}

// Symptoms
export async function getSymptomsByPatientId(patientId: string) {
  const { data, error } = await supabase
    .from("symptoms")
    .select("*")
    .eq("patient_id", patientId)
    .order("recorded_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createSymptoms(symptomsData: any[]) {
  const { data, error } = await supabase
    .from("symptoms")
    .insert(symptomsData)
    .select();
  if (error) throw error;
  return data;
}
