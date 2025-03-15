import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Plus, Bell } from "lucide-react";
import AppointmentRequests from "../appointments/AppointmentRequests";
import DailySchedule from "../appointments/DailySchedule";

interface DoctorHomeProps {
  doctorId?: string;
  doctorName?: string;
}

const DoctorHome = ({
  doctorId = "00000000-0000-0000-0000-000000000000",
  doctorName = "Dr. Sarah Johnson",
}: DoctorHomeProps) => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-600">Welcome back, {doctorName}</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Appointments Today</h3>
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
      </div>
    </div>
  );
};

export default DoctorHome;
