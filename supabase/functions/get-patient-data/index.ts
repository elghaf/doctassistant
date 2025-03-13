import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { patientId } = await req.json();

    if (!patientId) {
      throw new Error("Patient ID is required");
    }

    // Get patient data
    const { data: patient, error: patientError } = await supabaseClient
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .single();

    if (patientError) throw patientError;

    // Get medical history
    const { data: medicalHistory, error: medicalHistoryError } =
      await supabaseClient
        .from("medical_history")
        .select("*")
        .eq("patient_id", patientId)
        .single();

    // Get appointments
    const { data: appointments, error: appointmentsError } =
      await supabaseClient
        .from("appointments")
        .select("*")
        .eq("patient_id", patientId)
        .order("date", { ascending: true });

    // Get visits
    const { data: visits, error: visitsError } = await supabaseClient
      .from("visits")
      .select("*")
      .eq("patient_id", patientId)
      .order("visit_date", { ascending: false });

    // Get symptoms
    const { data: symptoms, error: symptomsError } = await supabaseClient
      .from("symptoms")
      .select("*")
      .eq("patient_id", patientId);

    // Get reports
    const { data: reports, error: reportsError } = await supabaseClient
      .from("reports")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    // Get AI summaries
    const { data: aiSummaries, error: aiSummariesError } = await supabaseClient
      .from("ai_summaries")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    // Combine all patient data
    const patientData = {
      patient,
      medicalHistory: medicalHistory || null,
      appointments: appointments || [],
      visits: visits || [],
      symptoms: symptoms || [],
      reports: reports || [],
      aiSummaries: aiSummaries || [],
    };

    return new Response(JSON.stringify(patientData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
