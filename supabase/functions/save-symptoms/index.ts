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

    const { patientId, symptoms } = await req.json();

    if (
      !patientId ||
      !symptoms ||
      !Array.isArray(symptoms) ||
      symptoms.length === 0
    ) {
      throw new Error("Patient ID and symptoms array are required");
    }

    // Prepare symptoms data for insertion
    const symptomsData = symptoms.map((symptom) => ({
      patient_id: patientId,
      name: symptom.name,
      severity: symptom.severity,
      duration: symptom.duration || null,
      notes: symptom.notes || null,
    }));

    // Save the symptoms to the database
    const { data, error } = await supabaseClient
      .from("symptoms")
      .insert(symptomsData)
      .select();

    if (error) throw error;

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
