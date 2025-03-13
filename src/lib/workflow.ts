import { supabase } from "./supabase";

// Types
export interface WorkflowStatus {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface WorkflowTransition {
  id: string;
  from_status_id: string;
  to_status_id: string;
  name: string;
  requires_approval: boolean;
}

export interface PatientWorkflow {
  id: string;
  patient_id: string;
  current_status_id: string;
  previous_status_id: string | null;
  assigned_to: string | null;
  notes: string | null;
  updated_at: string;
  created_at: string;
  current_status?: WorkflowStatus;
}

export interface WorkflowHistory {
  id: string;
  patient_id: string;
  from_status_id: string | null;
  to_status_id: string;
  transition_id: string | null;
  performed_by: string | null;
  notes: string | null;
  created_at: string;
  from_status?: WorkflowStatus;
  to_status?: WorkflowStatus;
}

export interface WorkflowTask {
  id: string;
  patient_id: string;
  status_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  assigned_to: string | null;
  is_completed: boolean;
  completed_at: string | null;
  completed_by: string | null;
  created_at: string;
  status?: WorkflowStatus;
}

// Functions to interact with workflow
export async function getWorkflowStatuses(): Promise<WorkflowStatus[]> {
  const { data, error } = await supabase
    .from("workflow_status")
    .select("*")
    .order("name");

  if (error) throw error;
  return data || [];
}

export async function getWorkflowTransitions(): Promise<WorkflowTransition[]> {
  const { data, error } = await supabase
    .from("workflow_transitions")
    .select("*");

  if (error) throw error;
  return data || [];
}

export async function getPatientWorkflow(
  patientId: string,
): Promise<PatientWorkflow | null> {
  const { data, error } = await supabase
    .from("patient_workflow")
    .select(
      `
      *,
      current_status:current_status_id(id, name, description, color)
    `,
    )
    .eq("patient_id", patientId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function getWorkflowHistory(
  patientId: string,
): Promise<WorkflowHistory[]> {
  const { data, error } = await supabase
    .from("workflow_history")
    .select(
      `
      *,
      from_status:from_status_id(id, name, description, color),
      to_status:to_status_id(id, name, description, color)
    `,
    )
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updatePatientWorkflow(params: {
  patientId: string;
  statusId: string;
  previousStatusId?: string;
  assignedTo?: string;
  notes?: string;
  performedBy?: string;
}): Promise<{ workflowId: string }> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-update-patient-workflow",
      {
        body: params,
      },
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating patient workflow:", error);
    throw error;
  }
}

export async function getWorkflowTasks(params: {
  patientId: string;
  statusId?: string;
  isCompleted?: boolean;
}): Promise<WorkflowTask[]> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-manage-workflow-tasks",
      {
        body: {
          action: "get",
          patientId: params.patientId,
          statusId: params.statusId,
          isCompleted: params.isCompleted,
        },
      },
    );

    if (error) throw error;
    return data.tasks || [];
  } catch (error) {
    console.error("Error getting workflow tasks:", error);
    throw error;
  }
}

export async function createWorkflowTask(params: {
  patientId: string;
  statusId: string;
  title: string;
  description?: string;
  dueDate?: string;
  assignedTo?: string;
}): Promise<WorkflowTask> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-manage-workflow-tasks",
      {
        body: {
          action: "create",
          patientId: params.patientId,
          statusId: params.statusId,
          title: params.title,
          description: params.description,
          dueDate: params.dueDate,
          assignedTo: params.assignedTo,
        },
      },
    );

    if (error) throw error;
    return data.task;
  } catch (error) {
    console.error("Error creating workflow task:", error);
    throw error;
  }
}

export async function updateWorkflowTask(params: {
  taskId: string;
  title?: string;
  description?: string;
  dueDate?: string;
  assignedTo?: string;
  statusId?: string;
}): Promise<WorkflowTask> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-manage-workflow-tasks",
      {
        body: {
          action: "update",
          taskId: params.taskId,
          title: params.title,
          description: params.description,
          dueDate: params.dueDate,
          assignedTo: params.assignedTo,
          statusId: params.statusId,
        },
      },
    );

    if (error) throw error;
    return data.task;
  } catch (error) {
    console.error("Error updating workflow task:", error);
    throw error;
  }
}

export async function completeWorkflowTask(params: {
  taskId: string;
  completedBy?: string;
}): Promise<WorkflowTask> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-manage-workflow-tasks",
      {
        body: {
          action: "complete",
          taskId: params.taskId,
          completedBy: params.completedBy,
        },
      },
    );

    if (error) throw error;
    return data.task;
  } catch (error) {
    console.error("Error completing workflow task:", error);
    throw error;
  }
}

export async function deleteWorkflowTask(taskId: string): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke(
      "supabase-functions-manage-workflow-tasks",
      {
        body: {
          action: "delete",
          taskId: taskId,
        },
      },
    );

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting workflow task:", error);
    throw error;
  }
}
