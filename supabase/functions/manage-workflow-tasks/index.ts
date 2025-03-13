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
      action,
      taskId,
      patientId,
      statusId,
      title,
      description,
      dueDate,
      assignedTo,
      isCompleted,
      completedBy,
    } = await req.json();

    if (!action) {
      throw new Error("Action is required");
    }

    let result;

    switch (action) {
      case "create":
        if (!patientId || !statusId || !title) {
          throw new Error(
            "Patient ID, status ID, and title are required for creating a task",
          );
        }

        const { data: newTask, error: createError } = await supabaseClient
          .from("workflow_tasks")
          .insert({
            patient_id: patientId,
            status_id: statusId,
            title: title,
            description: description,
            due_date: dueDate,
            assigned_to: assignedTo,
            is_completed: false,
          })
          .select()
          .single();

        if (createError) {
          throw new Error(`Failed to create task: ${createError.message}`);
        }

        result = {
          success: true,
          message: "Task created successfully",
          task: newTask,
        };
        break;

      case "update":
        if (!taskId) {
          throw new Error("Task ID is required for updating a task");
        }

        const updateData: Record<string, any> = {};

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (dueDate !== undefined) updateData.due_date = dueDate;
        if (assignedTo !== undefined) updateData.assigned_to = assignedTo;
        if (statusId !== undefined) updateData.status_id = statusId;

        const { data: updatedTask, error: updateError } = await supabaseClient
          .from("workflow_tasks")
          .update(updateData)
          .eq("id", taskId)
          .select()
          .single();

        if (updateError) {
          throw new Error(`Failed to update task: ${updateError.message}`);
        }

        result = {
          success: true,
          message: "Task updated successfully",
          task: updatedTask,
        };
        break;

      case "complete":
        if (!taskId) {
          throw new Error("Task ID is required for completing a task");
        }

        const { data: completedTask, error: completeError } =
          await supabaseClient
            .from("workflow_tasks")
            .update({
              is_completed: true,
              completed_at: new Date().toISOString(),
              completed_by: completedBy,
            })
            .eq("id", taskId)
            .select()
            .single();

        if (completeError) {
          throw new Error(`Failed to complete task: ${completeError.message}`);
        }

        result = {
          success: true,
          message: "Task completed successfully",
          task: completedTask,
        };
        break;

      case "delete":
        if (!taskId) {
          throw new Error("Task ID is required for deleting a task");
        }

        const { error: deleteError } = await supabaseClient
          .from("workflow_tasks")
          .delete()
          .eq("id", taskId);

        if (deleteError) {
          throw new Error(`Failed to delete task: ${deleteError.message}`);
        }

        result = { success: true, message: "Task deleted successfully" };
        break;

      case "get":
        if (taskId) {
          // Get a specific task
          const { data: task, error: getError } = await supabaseClient
            .from("workflow_tasks")
            .select("*")
            .eq("id", taskId)
            .single();

          if (getError) {
            throw new Error(`Failed to get task: ${getError.message}`);
          }

          result = { success: true, task: task };
        } else if (patientId) {
          // Get all tasks for a patient
          let query = supabaseClient
            .from("workflow_tasks")
            .select("*")
            .eq("patient_id", patientId);

          if (statusId) {
            query = query.eq("status_id", statusId);
          }

          if (isCompleted !== undefined) {
            query = query.eq("is_completed", isCompleted);
          }

          const { data: tasks, error: getError } = await query.order(
            "due_date",
            { ascending: true },
          );

          if (getError) {
            throw new Error(`Failed to get tasks: ${getError.message}`);
          }

          result = { success: true, tasks: tasks };
        } else {
          throw new Error(
            "Either task ID or patient ID is required for getting tasks",
          );
        }
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
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
