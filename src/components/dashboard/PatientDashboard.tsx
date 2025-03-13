import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import DashboardSidebar from "./DashboardSidebar";
import PatientOverview from "./PatientOverview";
import AppointmentCalendar from "../appointments/AppointmentCalendar";
import AppointmentScheduler from "../appointments/AppointmentScheduler";
import UpcomingAppointments from "../appointments/UpcomingAppointments";
import QuestionnaireManager from "../questionnaires/QuestionnaireManager";
import PatientReportViewer from "../reports/PatientReportViewer";

interface PatientDashboardProps {
  patientName?: string;
  patientAvatar?: string;
}

const PatientDashboard = ({
  patientName = "Sarah Johnson",
  patientAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
}: PatientDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <DashboardSidebar
        userType="patient"
        userName={patientName}
        userAvatar={patientAvatar}
        activePath="/dashboard"
      />

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Patient Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {patientName}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-white">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="questionnaires">Questionnaires</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <PatientOverview patientName={patientName} />
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardContent className="p-0">
                  <AppointmentCalendar />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-0">
                  <UpcomingAppointments />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card>
              <CardContent className="p-0">
                <AppointmentScheduler />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questionnaires Tab */}
          <TabsContent value="questionnaires">
            <QuestionnaireManager />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <PatientReportViewer patientName={patientName} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDashboard;
