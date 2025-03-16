import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, FileText, User } from "lucide-react";

interface PatientOverviewProps {
  patientName: string;
  patientId: string;
  summaryData: {
    nextAppointment?: {
      title: string;
      date: Date;
      doctorName: string;
      status: string;
    };
    pendingQuestionnaires: number;
    recentLabResults: {
      count: number;
      new: number;
    };
    notifications: {
      count: number;
      urgent: number;
    };
  };
}

const PatientOverview = ({
  patientName,
  patientId,
  summaryData,
}: PatientOverviewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{patientName}</h2>
            <p className="text-gray-500">Patient ID: {patientId}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Medical Records
          </Button>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Next Appointment</h3>
            {summaryData.nextAppointment ? (
              <>
                <p className="text-lg">{summaryData.nextAppointment.title}</p>
                <p className="text-sm text-gray-500">
                  {summaryData.nextAppointment.date.toLocaleDateString()} • {" "}
                  {summaryData.nextAppointment.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm">{summaryData.nextAppointment.doctorName}</p>
                <p className="text-sm capitalize">{summaryData.nextAppointment.status}</p>
              </>
            ) : (
              <p className="text-gray-500">No upcoming appointments</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Pending Questionnaires</h3>
            <p className="text-2xl font-bold">{summaryData.pendingQuestionnaires}</p>
            <p className="text-sm text-gray-500">
              {summaryData.pendingQuestionnaires === 0 
                ? "All caught up!"
                : "Questionnaires need your attention"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Lab Results</h3>
            <p className="text-2xl font-bold">{summaryData.recentLabResults.count}</p>
            <p className="text-sm text-gray-500">
              {summaryData.recentLabResults.new} new results available
            </p>
            <p className="text-sm">
              {summaryData.recentLabResults.new === 0 ? "All reviewed" : "New results to review"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-2xl font-bold">{summaryData.notifications.count}</p>
            <p className="text-sm text-gray-500">
              {summaryData.notifications.urgent} urgent notifications
            </p>
            <p className="text-sm">
              {summaryData.notifications.urgent === 0 
                ? "No urgent notifications" 
                : "Urgent notifications pending"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientOverview;
