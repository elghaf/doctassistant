import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Edit,
  FileText,
  Clock,
  MessageSquare,
  Share2,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";

interface PatientHeaderProps {
  patient?: {
    id: string;
    name: string;
    age: number;
    gender: string;
    dob: string;
    phone: string;
    email: string;
    insuranceProvider?: string;
    insuranceNumber?: string;
    lastVisit?: string;
    nextAppointment?: string;
    profileImage?: string;
    status?: "active" | "inactive" | "pending";
  };
  onBack?: () => void;
  onEdit?: () => void;
  onSchedule?: () => void;
  onGenerateReport?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
}

const PatientHeader = ({
  patient,
  onBack = () => {},
  onEdit = () => {},
  onSchedule = () => {},
  onGenerateReport = () => {},
  onMessage = () => {},
  onShare = () => {},
}: PatientHeaderProps) => {
  // Default patient data if none is provided
  const defaultPatient = {
    id: "P12345",
    name: "Jane Doe",
    age: 42,
    gender: "Female",
    dob: "1982-05-15",
    phone: "(555) 123-4567",
    email: "jane.doe@example.com",
    insuranceProvider: "Blue Cross Blue Shield",
    insuranceNumber: "BCB123456789",
    lastVisit: "2023-11-10",
    nextAppointment: "2024-02-15",
    status: "active" as const,
  };

  const patientData = patient || defaultPatient;

  // Format date of birth to show age
  const formatDOB = (dob: string) => {
    const date = new Date(dob);
    return `${date.toLocaleDateString()} (${patientData.age} years)`;
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Status badge color
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
    <div className="w-full bg-white border-b p-6 shadow-sm">
      {/* Back button and patient ID */}
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-gray-500"
          onClick={onBack}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Patients
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Patient ID:</span>
          <Badge variant="outline">{patientData.id}</Badge>
          {patientData.status && (
            <div
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                patientData.status,
              )}`}
            >
              {patientData.status.charAt(0).toUpperCase() +
                patientData.status.slice(1)}
            </div>
          )}
        </div>
      </div>

      {/* Main patient info */}
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <Avatar className="h-20 w-20 border-2 border-primary/10">
          {patientData.profileImage ? (
            <AvatarImage
              src={patientData.profileImage}
              alt={patientData.name}
            />
          ) : (
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {getInitials(patientData.name)}
            </AvatarFallback>
          )}
        </Avatar>

        {/* Patient details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{patientData.name}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>DOB: {formatDOB(patientData.dob)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-1">Gender:</span>
                  <span>{patientData.gender}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
                {patientData.lastVisit && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      Last Visit:{" "}
                      {new Date(patientData.lastVisit).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {patientData.nextAppointment && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      Next Appointment:{" "}
                      {new Date(
                        patientData.nextAppointment,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={onSchedule}
              >
                <Clock className="h-4 w-4" />
                Schedule
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={onGenerateReport}
              >
                <FileText className="h-4 w-4" />
                Report
              </Button>
            </div>
          </div>

          {/* Contact and insurance info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mt-4">
            <div className="flex items-center text-sm">
              <span className="text-gray-500 mr-2">Phone:</span>
              <span>{patientData.phone}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-gray-500 mr-2">Email:</span>
              <span>{patientData.email}</span>
            </div>
            {patientData.insuranceProvider && (
              <div className="flex items-center text-sm">
                <span className="text-gray-500 mr-2">Insurance:</span>
                <span>{patientData.insuranceProvider}</span>
              </div>
            )}
            {patientData.insuranceNumber && (
              <div className="flex items-center text-sm">
                <span className="text-gray-500 mr-2">Policy Number:</span>
                <span>{patientData.insuranceNumber}</span>
              </div>
            )}
          </div>

          {/* Additional action buttons for mobile */}
          <div className="flex gap-2 mt-4 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={onMessage}
            >
              <MessageSquare className="h-4 w-4" />
              Message
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-amber-600"
            >
              <AlertCircle className="h-4 w-4" />
              Alert
            </Button>
          </div>
        </div>

        {/* Additional action buttons for desktop */}
        <div className="hidden md:flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={onMessage}
          >
            <MessageSquare className="h-4 w-4" />
            Message
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={onShare}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-amber-600"
          >
            <AlertCircle className="h-4 w-4" />
            Alert
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;
