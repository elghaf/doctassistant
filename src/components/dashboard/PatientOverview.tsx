import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, FileText, User } from "lucide-react";
import PatientSummaryCards from "./PatientSummaryCards";
import AppointmentCalendar from "../appointments/AppointmentCalendar";
import PatientReportViewer from "../reports/PatientReportViewer";

interface PatientOverviewProps {
  patientName?: string;
  patientId?: string;
  summaryData?: {
    nextAppointment?: {
      date: string;
      time: string;
      doctor: string;
      type: string;
    };
    pendingQuestionnaires?: number;
    recentLabResults?: {
      count: number;
      new: number;
    };
    notifications?: {
      count: number;
      urgent: number;
    };
  };
}

const PatientOverview = ({
  patientName = "John Doe",
  patientId = "P-12345",
  summaryData = {
    nextAppointment: {
      date: "May 15, 2023",
      time: "10:30 AM",
      doctor: "Dr. Sarah Johnson",
      type: "Annual Check-up",
    },
    pendingQuestionnaires: 2,
    recentLabResults: {
      count: 3,
      new: 1,
    },
    notifications: {
      count: 5,
      urgent: 2,
    },
  },
}: PatientOverviewProps) => {
  return (
    <div className="w-full h-full bg-gray-50 p-6 space-y-6">
      {/* Patient Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{patientName}</h1>
            <p className="text-gray-500">Patient ID: {patientId}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Medical Records
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Button>
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {summaryData.notifications.urgent > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {summaryData.notifications.urgent}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <PatientSummaryCards
        nextAppointment={summaryData.nextAppointment}
        pendingQuestionnaires={summaryData.pendingQuestionnaires}
        recentLabResults={summaryData.recentLabResults}
        notifications={summaryData.notifications}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="reports">Reports & Lab Results</TabsTrigger>
          <TabsTrigger value="questionnaires">Questionnaires</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Appointments Card */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            {index === 0
                              ? "Annual Check-up"
                              : index === 1
                                ? "Follow-up Consultation"
                                : "Vaccination Appointment"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {index === 0
                              ? "May 15, 2023 • 10:30 AM"
                              : index === 1
                                ? "June 2, 2023 • 2:00 PM"
                                : "June 18, 2023 • 11:15 AM"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {index === 0
                              ? "Dr. Sarah Johnson"
                              : index === 1
                                ? "Dr. Michael Chen"
                                : "Dr. Emily Rodriguez"}
                          </p>
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {index === 0 ? "Confirmed" : "Pending"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">
                    View All Appointments
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports Card */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-emerald-600" />
                  Recent Medical Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            {index === 0
                              ? "Complete Blood Count"
                              : index === 1
                                ? "Lipid Panel"
                                : "Chest X-Ray"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {index === 0
                              ? "April 30, 2023"
                              : index === 1
                                ? "March 15, 2023"
                                : "February 22, 2023"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {index === 0
                              ? "Dr. Sarah Johnson"
                              : index === 1
                                ? "Dr. Michael Chen"
                                : "Dr. Emily Rodriguez"}
                          </p>
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${index === 0 ? "bg-green-100 text-green-700" : index === 1 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}
                        >
                          {index === 0
                            ? "Normal"
                            : index === 1
                              ? "Abnormal"
                              : "Normal"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">
                    View All Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Questionnaires Section */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-amber-600" />
                Pending Questionnaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summaryData.pendingQuestionnaires > 0 ? (
                  Array.from({ length: summaryData.pendingQuestionnaires }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">
                              {index === 0
                                ? "Pre-Appointment Health Assessment"
                                : "Annual Health Questionnaire"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {index === 0
                                ? "Required before your appointment on May 15"
                                : "Annual update of your health information"}
                            </p>
                          </div>
                          <Button size="sm">Complete Now</Button>
                        </div>
                      </div>
                    ),
                  )
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No pending questionnaires at this time.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentCalendar />
        </TabsContent>

        <TabsContent value="reports">
          <PatientReportViewer patientName={patientName} />
        </TabsContent>

        <TabsContent value="questionnaires">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Health Questionnaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-medium text-amber-800 mb-2">
                    Pending Questionnaires
                  </h3>
                  {summaryData.pendingQuestionnaires > 0 ? (
                    <div className="space-y-4">
                      {Array.from(
                        { length: summaryData.pendingQuestionnaires },
                        (_, index) => (
                          <div
                            key={index}
                            className="bg-white p-4 rounded-md border border-amber-100 flex justify-between items-center"
                          >
                            <div>
                              <h4 className="font-medium">
                                {index === 0
                                  ? "Pre-Appointment Health Assessment"
                                  : "Annual Health Questionnaire"}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {index === 0
                                  ? "Required before your appointment on May 15"
                                  : "Annual update of your health information"}
                              </p>
                              <p className="text-xs text-amber-600 mt-1">
                                {index === 0
                                  ? "Due in 5 days"
                                  : "Due in 14 days"}
                              </p>
                            </div>
                            <Button>Start</Button>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      No pending questionnaires at this time.
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-4">Completed Questionnaires</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">
                              {index === 0
                                ? "Mental Health Assessment"
                                : index === 1
                                  ? "Medication Review"
                                  : "Lifestyle and Diet Questionnaire"}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Completed on{" "}
                              {index === 0
                                ? "April 10, 2023"
                                : index === 1
                                  ? "March 22, 2023"
                                  : "February 15, 2023"}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            View Results
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientOverview;
