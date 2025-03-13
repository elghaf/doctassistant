import React, { useState } from "react";
import { Search, Filter, X, Calendar, User, Phone, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email?: string;
  status?: "active" | "inactive" | "pending";
}

interface PatientSearchModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelectPatient?: (patientId: string) => void;
}

const PatientSearchModal = ({
  open = false,
  onOpenChange = () => {},
  onSelectPatient = () => {},
}: PatientSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real implementation, this would call the Supabase API
      // For now, we'll simulate a search with mock data
      const { supabase } = await import("@/lib/supabase");

      let query = supabase.from("patients").select("*");

      // Apply filters
      if (searchQuery) {
        query = query.or(
          `first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`,
        );
      }

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      if (filterGender !== "all") {
        query = query.eq("gender", filterGender);
      }

      const { data, error } = await query.order("last_name", {
        ascending: true,
      });

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error("Error searching patients:", error);
      // You could add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPatient = (patientId: string) => {
    onSelectPatient(patientId);
    onOpenChange(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setFilterGender("all");
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Patient Search</DialogTitle>
          <DialogDescription>
            Search for patients by name, contact information, or other criteria.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by name, phone, or email"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <div className="w-40">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-40">
                  <Select value={filterGender} onValueChange={setFilterGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Searching..." : "Search"}
                </Button>

                {(searchQuery ||
                  filterStatus !== "all" ||
                  filterGender !== "all") && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearSearch}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </form>

          <div className="border rounded-md">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            ) : patients.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        {patient.first_name} {patient.last_name}
                      </TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-gray-500" />
                          <span>
                            {new Date(
                              patient.date_of_birth,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 text-gray-500" />
                            <span>{patient.phone}</span>
                          </div>
                          {patient.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3.5 w-3.5 text-gray-500" />
                              <span className="text-xs">{patient.email}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(patient.status || "active")}
                        >
                          {patient.status
                            ? patient.status.charAt(0).toUpperCase() +
                              patient.status.slice(1)
                            : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleSelectPatient(patient.id)}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                <User className="h-10 w-10 text-gray-300 mb-2" />
                <h3 className="font-medium">No patients found</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-md">
                  {searchQuery ||
                  filterStatus !== "all" ||
                  filterGender !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "Start by searching for a patient by name, phone number, or email"}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientSearchModal;
