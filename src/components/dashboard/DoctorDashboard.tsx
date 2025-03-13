import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Plus } from "lucide-react";

import DashboardSidebar from "./DashboardSidebar";
import AppointmentRequests from "../appointments/AppointmentRequests";
import PatientList from "../patients/PatientList";
import PatientDetails from "../patients/PatientDetails";
import DailySchedule from "../appointments/DailySchedule";

interface DoctorDashboardProps {
  doctorName?: string;
  doctorAvatar?: string;
}

const DoctorDashboard = ({
  doctorName = "Dr. Sarah Johnson",
  doctorAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor",
}: DoctorDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );

  // Handle patient selection
  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab("patient-details");
  };

  // Handle back to patient list
  const handleBackToPatients = () => {
    setSelectedPatientId(null);
    setActiveTab("patients");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <DashboardSidebar
        userType="doctor"
        userName={doctorName}
        userAvatar={doctorAvatar}
        activePath="/dashboard"
      />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600">Welcome back, {doctorName}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-white">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointment-requests">
              Appointment Requests
            </TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
            {selectedPatientId && (
              <TabsTrigger value="patient-details">Patient Details</TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">
                        Appointments Today
                      </h3>
                      <p className="text-3xl font-bold mt-2">8</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-500" />
                  </div>
                  <Button variant="link" className="mt-4 p-0">
                    View Schedule
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Pending Requests</h3>
                      <p className="text-3xl font-bold mt-2">5</p>
                    </div>
                    <FileText className="h-8 w-8 text-orange-500" />
                  </div>
                  <Button variant="link" className="mt-4 p-0">
                    Review Requests
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Total Patients</h3>
                      <p className="text-3xl font-bold mt-2">124</p>
                    </div>
                    <Plus className="h-8 w-8 text-green-500" />
                  </div>
                  <Button variant="link" className="mt-4 p-0">
                    Add New Patient
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-0">
                  <DailySchedule />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-0">
                  <AppointmentRequests />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appointment Requests Tab */}
          <TabsContent value="appointment-requests">
            <AppointmentRequests />
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients">
            <PatientList onPatientSelect={handlePatientSelect} />
          </TabsContent>

          {/* Today's Schedule Tab */}
          <TabsContent value="schedule">
            <DailySchedule />
          </TabsContent>

          {/* Patient Details Tab */}
          <TabsContent value="patient-details">
            {selectedPatientId && (
              <div>
                <Button
                  variant="outline"
                  onClick={handleBackToPatients}
                  className="mb-4"
                >
                  Back to Patient List
                </Button>
                <PatientDetails />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DoctorDashboard;
