import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
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
      statusId,
      previousStatusId,
      assignedTo,
      notes,
      performedBy,
    } = await req.json();

    if (!patientId || !statusId) {
      throw new Error("Patient ID and status ID are required");
    }

    // Check if patient exists
    const { data: patient, error: patientError } = await supabaseClient
      .from("patients")
      .select("id")
      .eq("id", patientId)
      .single();

    if (patientError) {
      throw new Error(`Patient not found: ${patientError.message}`);
    }

    // Check if status exists
    const { data: status, error: statusError } = await supabaseClient
      .from("workflow_status")
      .select("id")
      .eq("id", statusId)
      .single();

    if (statusError) {
      throw new Error(`Status not found: ${statusError.message}`);
    }

    // Check if patient workflow exists
    const { data: existingWorkflow, error: workflowError } =
      await supabaseClient
        .from("patient_workflow")
        .select("id, current_status_id")
        .eq("patient_id", patientId)
        .single();

    let workflowId;
    let currentPreviousStatusId = previousStatusId;

    if (workflowError && workflowError.code === "PGRST116") {
      // Workflow doesn't exist, create it
      const { data: newWorkflow, error: createError } = await supabaseClient
        .from("patient_workflow")
        .insert({
          patient_id: patientId,
          current_status_id: statusId,
          previous_status_id: null,
          assigned_to: assignedTo,
          notes: notes,
        })
        .select()
        .single();

      if (createError) {
        throw new Error(`Failed to create workflow: ${createError.message}`);
      }

      workflowId = newWorkflow.id;
    } else {
      // Workflow exists, update it
      currentPreviousStatusId = existingWorkflow.current_status_id;

      const { data: updatedWorkflow, error: updateError } = await supabaseClient
        .from("patient_workflow")
        .update({
          current_status_id: statusId,
          previous_status_id: currentPreviousStatusId,
          assigned_to: assignedTo,
          notes: notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingWorkflow.id)
        .select()
        .single();

      if (updateError) {
        throw new Error(`Failed to update workflow: ${updateError.message}`);
      }

      workflowId = existingWorkflow.id;
    }

    // Record workflow history
    const { error: historyError } = await supabaseClient
      .from("workflow_history")
      .insert({
        patient_id: patientId,
        from_status_id: currentPreviousStatusId,
        to_status_id: statusId,
        performed_by: performedBy,
        notes: notes,
      });

    if (historyError) {
      throw new Error(`Failed to record history: ${historyError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Patient workflow updated successfully",
        workflowId: workflowId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
