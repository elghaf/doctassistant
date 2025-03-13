import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GitBranch,
  Search,
  Filter,
  Plus,
  User,
  Calendar,
  Clock,
  Settings,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { getWorkflowStatuses } from "@/lib/workflow";
import { supabase } from "@/lib/supabase";

interface WorkflowStatus {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface PatientWorkflow {
  id: string;
  patient_id: string;
  current_status_id: string;
  previous_status_id: string | null;
  assigned_to: string | null;
  notes: string | null;
  updated_at: string;
  created_at: string;
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
  };
  current_status: WorkflowStatus;
}

const WorkflowsPage = () => {
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState<WorkflowStatus[]>([]);
  const [workflows, setWorkflows] = useState<PatientWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch workflow statuses
      const statusesData = await getWorkflowStatuses();
      setStatuses(statusesData);

      // Fetch patient workflows with patient info and current status
      const { data: workflowsData, error: workflowsError } = await supabase
        .from("patient_workflow")
        .select(`
          *,
          patient:patient_id(*),
          current_status:current_status_id(*)
        `)
        .order("updated_at", { ascending: false });

      if (workflowsError) throw workflowsError;

      setWorkflows(workflowsData || []);
    } catch (err) {
      console.error("Error fetching workflow data:", err);
      setError("Failed to load workflow data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter workflows based on search query
  };

  const handleViewPatient = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  const filteredWorkflows = workflows.filter((workflow) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      `${workflow.patient.first_name} ${workflow.patient.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Filter by status tab
    const matchesStatus =
      activeTab === "all" ||
      statuses.find((s) => s.id === workflow.current_status_id)?.name.toLowerCase() === activeTab;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <DashboardLayout>
      <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Patient Workflows</h1>
              <p className="text-gray-500">Manage and track patient care workflows</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/settings/workflows")}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Manage Workflows
              </Button>
              <Button
                onClick={() => navigate("/patients")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Patient
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Workflow Status</CardTitle>
                <div className="flex items-center gap-2">
                  <form
                    onSubmit={handleSearch}
                    className="flex items-center gap-2"
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search patients..."
                        className="pl-10 w-[300px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </form>
                  <Button
                    variant="outline"
                    onClick={fetchData}
                    className="flex items-center gap-2"
                  >
                    <GitBranch className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>
              <CardDescription>
                View and manage patient care workflows by status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-4 flex flex-wrap">
                  <TabsTrigger value="all">All Workflows</TabsTrigger>
                  {statuses.map((status) => (
                    <TabsTrigger
                      key={status.id}
                      value={status.name.toLowerCase()}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                      <span>{status.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={activeTab}>
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                    </div>
                  ) : filteredWorkflows.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>