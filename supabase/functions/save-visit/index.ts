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

    const {
      patientId,
      appointmentId = null,
      visitDate,
      chiefComplaint = null,
      diagnosis = null,
      treatmentPlan = null,
      notes = null,
    } = await req.json();

    if (!patientId || !visitDate) {
      throw new Error("Patient ID and visit date are required");
    }

    // Save the visit to the database
    const { data, error } = await supabaseClient
      .from("visits")
      .insert({
        patient_id: patientId,
        appointment_id: appointmentId,
        visit_date: visitDate,
        chief_complaint: chiefComplaint,
        diagnosis: diagnosis,
        treatment_plan: treatmentPlan,
        notes: notes,
      })
      .select()
      .single();

    if (error) throw error;

    // If this visit is associated with an appointment, update the appointment status to completed
    if (appointmentId) {
      const { error: appointmentError } = await supabaseClient
        .from("appointments")
        .update({ status: "completed" })
        .eq("id", appointmentId);

      if (appointmentError) throw appointmentError;
    }

    return new Response(JSON.stringify({ success: true, data }), {
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
