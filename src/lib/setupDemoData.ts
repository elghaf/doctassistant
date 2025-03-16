import { supabase } from "./supabase";
import { insertSampleQuestionnaires } from "@/components/questionnaires/SampleQuestionnaires";
import { insertSampleReports } from "@/components/reports/SampleReports";
import { insertSampleAppointments } from "@/components/appointments/SampleAppointments";

export async function setupDemoData() {
  try {
    console.log("Setting up demo data...");

    // Check if we already have profiles
    const { data: existingProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("role", "patient")
      .limit(1);

    if (profilesError) throw profilesError;

    // If we already have data, return the existing patient ID
    if (existingProfiles && existingProfiles.length > 0) {
      console.log("Demo data already exists, using existing patient");
      return { 
        success: true, 
        message: "Using existing demo data",
        patientId: existingProfiles[0].id
      };
    }

    // Create a demo patient profile
    const { data: patientData, error: patientError } = await supabase
      .from("profiles")
      .insert({
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        role: "patient",
      })
      .select()
      .single();

    if (patientError) throw patientError;

    // Create a demo doctor profile
    const { data: doctorData, error: doctorError } = await supabase
      .from("profiles")
      .insert({
        name: "Dr. Michael Chen",
        email: "dr.chen@example.com",
        role: "doctor",
      })
      .select()
      .single();

    if (doctorError) throw doctorError;

    const patientId = patientData.id;
    const doctorId = doctorData.id;

    // Insert sample data
    await Promise.all([
      insertSampleQuestionnaires(supabase, patientId),
      insertSampleReports(supabase, patientId, doctorId),
      insertSampleAppointments(supabase, patientId, doctorId),
    ]);

    console.log("Demo data setup complete!");
    return {
      success: true,
      message: "Demo data setup complete",
      patientId,
      doctorId,
    };
  } catch (error) {
    console.error("Error setting up demo data:", error);
    return { success: false, error };
  }
}
