import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  User,
  Calendar,
  Clock,
  ChevronRight,
  FileText,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  status?: string;
  profileImage?: string;
  lastVisit?: string;
}

interface PatientSummarySectionProps {
  onViewAll?: () => void;
  onViewPatient?: (id: string) => void;
  onAddPatient?: () => void;
}

const PatientSummarySection = ({
  onViewAll = () => {},
  onViewPatient = () => {},
  onAddPatient = () => {},
}: PatientSummarySectionProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPatients();
  }, []);

  const fetchRecentPatients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      // Transform data to match the expected format
      const formattedPatients = data.map((patient) => ({
        id: patient.id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        date_of_birth: patient.date_of_birth,
        gender: patient.gender,
        status: patient.status || "active",
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.first_name}${patient.last_name}`,
      }));

      setPatients(formattedPatients);
    } catch (error) {
      console.error("Error fetching recent patients:", error);
    } finally {
      setLoading(false);
    }
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
    <Card className="h-full bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>
              Recently added or updated patient records
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddPatient}
            className="flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : patients.length > 0 ? (
          <div className="space-y-3">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onViewPatient(patient.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={patient.profileImage}
                      alt={`${patient.first_name} ${patient.last_name}`}
                    />
                    <AvatarFallback>
                      {patient.first_name[0]}
                      {patient.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm">
                          {patient.first_name} {patient.last_name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>{patient.gender}</span>
                          <span>•</span>
                          <span>
                            {calculateAge(patient.date_of_birth)} years
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={getStatusColor(patient.status || "active")}
                      >
                        {(patient.status || "active").charAt(0).toUpperCase() +
                          (patient.status || "active").slice(1)}
                      </Badge>
                    </div>
                    {patient.lastVisit && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                        <Clock className="h-3 w-3" />
                        <span>
                          Last visit:{" "}
                          {new Date(patient.lastVisit).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center p-4">
            <User className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="font-medium">No patients yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add your first patient to get started
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={onAddPatient}
            >
              Add Patient
            </Button>
          </div>
        )}
      </CardContent>
      {patients.length > 0 && (
        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            className="w-full justify-center text-sm"
            onClick={onViewAll}
          >
            View All Patients
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PatientSummarySection;
