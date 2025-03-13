import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPatients } from "@/lib/supabase";
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
import { UserPlus, Search, Filter, Calendar, FileText } from "lucide-react";
import AddPatientModal from "@/components/patients/AddPatientModal";
import PatientSearchModal from "@/components/patients/PatientSearchModal";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email?: string;
  last_visit?: string;
  next_appointment?: string;
  status?: "active" | "inactive" | "pending";
}

const PatientsPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientAdded = () => {
    fetchPatients();
    setIsAddPatientOpen(false);
  };

  const handleViewPatient = (id: string) => {
    navigate(`/patients/${id}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter patients based on search query
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery) ||
      (patient.email &&
        patient.email.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Mock data for demonstration
  const mockPatients: Patient[] = [];

  const displayPatients = patients.length > 0 ? patients : mockPatients;

  return (
    <DashboardLayout>
      <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Patients</h1>
              <p className="text-gray-500">Manage and view patient records</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsSearchModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Advanced Search
              </Button>
              <Button
                onClick={() => setIsAddPatientOpen(true)}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add Patient
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Patient Records</CardTitle>
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
                </div>
              </div>
              <CardDescription>
                View and manage all patient records in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead>Next Appointment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayPatients
                        .filter((patient) =>
                          searchQuery
                            ? `${patient.first_name} ${patient.last_name}`
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                            : true,
                        )
                        .map((patient) => (
                          <TableRow
                            key={patient.id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleViewPatient(patient.id)}
                          >
                            <TableCell className="font-medium">
                              {patient.first_name} {patient.last_name}
                            </TableCell>
                            <TableCell>{patient.gender}</TableCell>
                            <TableCell>
                              {new Date(
                                patient.date_of_birth,
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{patient.phone}</span>
                                {patient.email && (
                                  <span className="text-xs text-gray-500">
                                    {patient.email}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {patient.last_visit
                                ? new Date(
                                    patient.last_visit,
                                  ).toLocaleDateString()
                                : "No visits"}
                            </TableCell>
                            <TableCell>
                              {patient.next_appointment ? (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5 text-blue-500" />
                                  {new Date(
                                    patient.next_appointment,
                                  ).toLocaleDateString()}
                                </div>
                              ) : (
                                "None scheduled"
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={getStatusColor(
                                  patient.status || "active",
                                )}
                              >
                                {patient.status
                                  ? patient.status.charAt(0).toUpperCase() +
                                    patient.status.slice(1)
                                  : "Active"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div
                                className="flex items-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewPatient(patient.id)}
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    // Schedule appointment
                                  }}
                                >
                                  <Calendar className="h-4 w-4" />
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
        </div>
      </div>

      <AddPatientModal
        open={isAddPatientOpen}
        onOpenChange={setIsAddPatientOpen}
        onPatientAdded={handlePatientAdded}
      />

      <PatientSearchModal
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
      />
    </DashboardLayout>
  );
};

export default PatientsPage;
