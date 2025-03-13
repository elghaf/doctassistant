import React, { useState, useEffect } from "react";
import { usePatient } from "@/components/patients/PatientContext";
import {
  getWorkflowStatuses,
  getPatientWorkflow,
  getWorkflowHistory,
  getWorkflowTasks,
  updatePatientWorkflow,
  createWorkflowTask,
  completeWorkflowTask,
  deleteWorkflowTask,
  WorkflowStatus,
  PatientWorkflow,
  WorkflowHistory,
  WorkflowTask,
} from "@/lib/workflow";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Plus,
  RefreshCw,
  Trash2,
  User,
} from "lucide-react";

interface WorkflowTabProps {
  patientId: string;
}

const WorkflowTab: React.FC<WorkflowTabProps> = ({ patientId }) => {
  const { patient } = usePatient();
  const [activeTab, setActiveTab] = useState("status");
  const [statuses, setStatuses] = useState<WorkflowStatus[]>([]);
  const [workflow, setWorkflow] = useState<PatientWorkflow | null>(null);
  const [history, setHistory] = useState<WorkflowHistory[]>([]);
  const [tasks, setTasks] = useState<WorkflowTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [statusNotes, setStatusNotes] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [taskDueDate, setTaskDueDate] = useState<string>("");

  useEffect(() => {
    if (patientId) {
      loadWorkflowData();
    }
  }, [patientId]);

  const loadWorkflowData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all workflow data in parallel
      const [statusesData, workflowData, historyData, tasksData] =
        await Promise.all([
          getWorkflowStatuses(),
          getPatientWorkflow(patientId),
          getWorkflowHistory(patientId),
          getWorkflowTasks({ patientId }),
        ]);

      setStatuses(statusesData);
      setWorkflow(workflowData);
      setHistory(historyData);
      setTasks(tasksData);

      // Set default selected status if workflow exists
      if (workflowData) {
        setSelectedStatus(workflowData.current_status_id);
      } else if (statusesData.length > 0) {
        // Default to first status if no workflow exists
        setSelectedStatus(statusesData[0].id);
      }
    } catch (err) {
      console.error("Error loading workflow data:", err);
      setError("Failed to load workflow data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      if (!selectedStatus) {
        setError("Please select a status");
        return;
      }

      await updatePatientWorkflow({
        patientId,
        statusId: selectedStatus,
        notes: statusNotes,
        performedBy: "Doctor", // This would come from auth context in a real app
      });

      // Reload workflow data
      await loadWorkflowData();
      setIsStatusDialogOpen(false);
      setStatusNotes("");
    } catch (err) {
      console.error("Error updating workflow status:", err);
      setError("Failed to update status. Please try again.");
    }
  };

  const handleAddTask = async () => {
    try {
      if (!taskTitle) {
        setError("Task title is required");
        return;
      }

      const statusId = workflow?.current_status_id || selectedStatus;

      await createWorkflowTask({
        patientId,
        statusId,
        title: taskTitle,
        description: taskDescription,
        dueDate: taskDueDate || undefined,
      });

      // Reload tasks
      const tasksData = await getWorkflowTasks({ patientId });
      setTasks(tasksData);

      // Reset form
      setIsTaskDialogOpen(false);
      setTaskTitle("");
      setTaskDescription("");
      setTaskDueDate("");
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Failed to add task. Please try again.");
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeWorkflowTask({
        taskId,
        completedBy: "Doctor", // This would come from auth context in a real app
      });

      // Reload tasks
      const tasksData = await getWorkflowTasks({ patientId });
      setTasks(tasksData);
    } catch (err) {
      console.error("Error completing task:", err);
      setError("Failed to complete task. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteWorkflowTask(taskId);

      // Reload tasks
      const tasksData = await getWorkflowTasks({ patientId });
      setTasks(tasksData);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task. Please try again.");
    }
  };

  const getStatusBadge = (statusId: string) => {
    const status = statuses.find((s) => s.id === statusId);
    if (!status) return null;

    return (
      <Badge
        style={{
          backgroundColor: `${status.color}20`, // 20% opacity
          color: status.color,
          borderColor: `${status.color}40`, // 40% opacity
        }}
      >
        {status.name}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 gap-2 mb-6">
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Current Status</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Status History</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Tasks</span>
          </TabsTrigger>
        </TabsList>

        {/* Current Status Tab */}
        <TabsContent value="status" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Patient Workflow Status</h3>
            <Button
              onClick={() => setIsStatusDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Update Status</span>
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
              <CardDescription>
                {workflow
                  ? "Current workflow status and information"
                  : "No workflow has been set up for this patient yet"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {workflow ? (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Status
                      </p>
                      <div className="mt-1">
                        {getStatusBadge(workflow.current_status_id)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Last Updated
                      </p>
                      <p className="mt-1">{formatDate(workflow.updated_at)}</p>
                    </div>
                    {workflow.assigned_to && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Assigned To
                        </p>
                        <p className="mt-1">{workflow.assigned_to}</p>
                      </div>
                    )}
                  </div>

                  {workflow.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Notes</p>
                      <p className="mt-1 text-gray-700">{workflow.notes}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Active Tasks</h4>
                    {tasks.filter((t) => !t.is_completed).length > 0 ? (
                      <ul className="space-y-2">
                        {tasks
                          .filter((t) => !t.is_completed)
                          .map((task) => (
                            <li
                              key={task.id}
                              className="flex items-center gap-2"
                            >
                              <div className="h-2 w-2 rounded-full bg-blue-500" />
                              <span>{task.title}</span>
                              {task.due_date && (
                                <span className="text-xs text-gray-500">
                                  (Due:{" "}
                                  {new Date(task.due_date).toLocaleDateString()}
                                  )
                                </span>
                              )}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No active tasks</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No workflow status has been set for this patient.
                  </p>
                  <Button
                    onClick={() => setIsStatusDialogOpen(true)}
                    className="mt-4"
                  >
                    Set Initial Status
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Status History</h3>
            <Button
              variant="outline"
              onClick={loadWorkflowData}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>

          {history.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>From Status</TableHead>
                      <TableHead>To Status</TableHead>
                      <TableHead>Performed By</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{formatDate(entry.created_at)}</TableCell>
                        <TableCell>
                          {entry.from_status ? (
                            <Badge
                              style={{
                                backgroundColor: `${entry.from_status.color}20`,
                                color: entry.from_status.color,
                                borderColor: `${entry.from_status.color}40`,
                              }}
                            >
                              {entry.from_status.name}
                            </Badge>
                          ) : (
                            <span className="text-gray-500">
                              Initial Status
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {entry.to_status && (
                            <Badge
                              style={{
                                backgroundColor: `${entry.to_status.color}20`,
                                color: entry.to_status.color,
                                borderColor: `${entry.to_status.color}40`,
                              }}
                            >
                              {entry.to_status.name}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{entry.performed_by || "System"}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {entry.notes || "-"}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  No status history available for this patient.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Workflow Tasks</h3>
            <Button
              onClick={() => setIsTaskDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </Button>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList>
              <TabsTrigger value="active">Active Tasks</TabsTrigger>
              <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="pt-4">
              {tasks.filter((t) => !t.is_completed).length > 0 ? (
                <div className="space-y-3">
                  {tasks
                    .filter((t) => !t.is_completed)
                    .map((task) => (
                      <Card key={task.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{task.title}</h4>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2">
                                {task.due_date && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>
                                      Due:{" "}
                                      {new Date(
                                        task.due_date,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                                {task.assigned_to && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <User className="h-3.5 w-3.5" />
                                    <span>Assigned to: {task.assigned_to}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => handleCompleteTask(task.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Complete</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      No active tasks for this patient.
                    </p>
                    <Button
                      onClick={() => setIsTaskDialogOpen(true)}
                      className="mt-4"
                    >
                      Add First Task
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="pt-4">
              {tasks.filter((t) => t.is_completed).length > 0 ? (
                <div className="space-y-3">
                  {tasks
                    .filter((t) => t.is_completed)
                    .map((task) => (
                      <Card key={task.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium line-through text-gray-500">
                                {task.title}
                              </h4>
                              {task.description && (
                                <p className="text-sm text-gray-400 mt-1">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2">
                                {task.completed_at && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                    <span>
                                      Completed: {formatDate(task.completed_at)}
                                    </span>
                                  </div>
                                )}
                                {task.completed_by && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <User className="h-3.5 w-3.5" />
                                    <span>By: {task.completed_by}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      No completed tasks for this patient.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {workflow ? "Update Patient Status" : "Set Initial Status"}
            </DialogTitle>
            <DialogDescription>
              {workflow
                ? "Change the current workflow status for this patient"
                : "Set the initial workflow status for this patient"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: status.color }}
                        />
                        <span>{status.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                placeholder="Add notes about this status change"
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>
              {workflow ? "Update Status" : "Set Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task for this patient's workflow
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Task Title*</label>
              <Input
                placeholder="Enter task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Add task description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <Input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTaskDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowTab;
