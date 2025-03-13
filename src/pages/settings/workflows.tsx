import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GitBranch,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Save,
} from "lucide-react";
import { getWorkflowStatuses, getWorkflowTransitions } from "@/lib/workflow";

const WorkflowsSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("statuses");
  const [statuses, setStatuses] = useState<any[]>([]);
  const [transitions, setTransitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isTransitionDialogOpen, setIsTransitionDialogOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#3b82f6");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statusesData = await getWorkflowStatuses();
        const transitionsData = await getWorkflowTransitions();
        setStatuses(statusesData);
        setTransitions(transitionsData);
      } catch (error) {
        console.error("Error fetching workflow data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddStatus = () => {
    setIsStatusDialogOpen(true);
  };

  const handleAddTransition = () => {
    setIsTransitionDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Workflow Management</h1>
              <p className="text-gray-500">
                Configure patient workflow statuses and transitions
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Settings
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="statuses"
                className="flex items-center gap-2 py-3"
              >
                <GitBranch className="h-4 w-4" />
                <span>Workflow Statuses</span>
              </TabsTrigger>
              <TabsTrigger
                value="transitions"
                className="flex items-center gap-2 py-3"
              >
                <ArrowRight className="h-4 w-4" />
                <span>Status Transitions</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="statuses" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Workflow Statuses</CardTitle>
                    <CardDescription>
                      Define the different statuses a patient can have in your
                      workflow
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleAddStatus}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Status
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Status Name</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {statuses.map((status) => (
                            <TableRow key={status.id}>
                              <TableCell className="font-medium">
                                {status.name}
                              </TableCell>
                              <TableCell>
                                <div
                                  className="h-5 w-5 rounded-full"
                                  style={{ backgroundColor: status.color }}
                                />
                              </TableCell>
                              <TableCell>{status.description}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transitions" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Status Transitions</CardTitle>
                    <CardDescription>
                      Define how patients can move between different statuses
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleAddTransition}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Transition
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>From Status</TableHead>
                            <TableHead>To Status</TableHead>
                            <TableHead>Transition Name</TableHead>
                            <TableHead>Requires Approval</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transitions.map((transition) => {
                            const fromStatus = statuses.find(
                              (s) => s.id === transition.from_status_id,
                            );
                            const toStatus = statuses.find(
                              (s) => s.id === transition.to_status_id,
                            );
                            return (
                              <TableRow key={transition.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="h-3 w-3 rounded-full"
                                      style={{
                                        backgroundColor: fromStatus?.color,
                                      }}
                                    />
                                    <span>{fromStatus?.name || "Any"}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="h-3 w-3 rounded-full"
                                      style={{
                                        backgroundColor: toStatus?.color,
                                      }}
                                    />
                                    <span>{toStatus?.name}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{transition.name}</TableCell>
                                <TableCell>
                                  {transition.requires_approval ? "Yes" : "No"}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Status</DialogTitle>
            <DialogDescription>
              Create a new workflow status for patient management
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="statusName">Status Name</Label>
              <Input id="statusName" placeholder="e.g. In Treatment" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="statusColor">Status Color</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="statusColor"
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-20 h-10"
                />
                <div className="flex-1">
                  <div
                    className="h-10 w-full rounded-md"
                    style={{ backgroundColor: selectedColor }}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="statusDescription">Description</Label>
              <Textarea
                id="statusDescription"
                placeholder="Describe what this status represents"
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
            <Button className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Transition Dialog */}
      <Dialog
        open={isTransitionDialogOpen}
        onOpenChange={setIsTransitionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transition</DialogTitle>
            <DialogDescription>
              Define how patients can move between statuses
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromStatus">From Status</Label>
                <select
                  id="fromStatus"
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Any Status</option>
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="toStatus">To Status</Label>
                <select id="toStatus" className="w-full p-2 border rounded-md">
                  <option value="">Select Status</option>
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transitionName">Transition Name</Label>
              <Input id="transitionName" placeholder="e.g. Start Treatment" />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requiresApproval"
                className="rounded border-gray-300"
              />
              <Label htmlFor="requiresApproval">
                Requires approval before transition
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTransitionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Transition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default WorkflowsSettingsPage;
