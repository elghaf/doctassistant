import React, { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface PatientInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  lastVisit: string;
  status: "active" | "pending" | "inactive";
  avatar?: string;
}

interface PatientListProps {
  patients?: PatientInfo[];
  onPatientSelect?: (patientId: string) => void;
  onAddPatient?: () => void;
}

const PatientList = ({
  patients = [
    {
      id: "1",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "(555) 123-4567",
      dateOfBirth: "1985-06-15",
      lastVisit: "2023-10-12",
      status: "active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    },
    {
      id: "2",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "(555) 987-6543",
      dateOfBirth: "1978-03-22",
      lastVisit: "2023-11-05",
      status: "active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    {
      id: "3",
      name: "Emily Johnson",
      email: "emily.j@example.com",
      phone: "(555) 234-5678",
      dateOfBirth: "1992-09-08",
      lastVisit: "2023-09-30",
      status: "pending",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    },
    {
      id: "4",
      name: "Michael Brown",
      email: "michael.b@example.com",
      phone: "(555) 876-5432",
      dateOfBirth: "1965-11-17",
      lastVisit: "2023-10-25",
      status: "inactive",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    },
    {
      id: "5",
      name: "Sarah Wilson",
      email: "sarah.w@example.com",
      phone: "(555) 345-6789",
      dateOfBirth: "1989-04-30",
      lastVisit: "2023-11-10",
      status: "active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
  ],
  onPatientSelect = (id) => console.log(`Selected patient: ${id}`),
  onAddPatient = () => console.log("Add new patient clicked"),
}: PatientListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] =
    useState<PatientInfo[]>(patients);

  // Filter patients based on search term
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(term) ||
          patient.email.toLowerCase().includes(term) ||
          patient.phone.includes(term),
      );
      setFilteredPatients(filtered);
    }
  };

  // Get status badge color
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "inactive":
        return "outline";
      default:
        return "default";
    }
  };

  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Patient List</h1>
        <Button onClick={onAddPatient} className="flex items-center gap-2">
          <Plus size={16} />
          Add Patient
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search patients by name, email, or phone"
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          Filter
        </Button>
      </div>

      <div className="space-y-4">
        {filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="flex justify-center items-center h-32">
              <p className="text-gray-500">No patients found</p>
            </CardContent>
          </Card>
        ) : (
          filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onPatientSelect(patient.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={patient.avatar} alt={patient.name} />
                    <AvatarFallback>
                      {patient.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{patient.name}</h3>
                        <div className="text-sm text-gray-500">
                          {patient.email}
                        </div>
                      </div>
                      <Badge variant={getStatusBadgeVariant(patient.status)}>
                        {patient.status.charAt(0).toUpperCase() +
                          patient.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div>
                        <span className="text-gray-500">Phone:</span>{" "}
                        {patient.phone}
                      </div>
                      <div>
                        <span className="text-gray-500">DOB:</span>{" "}
                        {formatDate(patient.dateOfBirth)}
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500">Last Visit:</span>{" "}
                        {formatDate(patient.lastVisit)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PatientList;
