import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import AppointmentRequests from "../appointments/AppointmentRequests";
import DailySchedule from "../appointments/DailySchedule";

const DoctorAppointments = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-600">Manage your patient appointments</p>
      </div>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="mb-6 bg-white">
          <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
          <TabsTrigger value="requests">Appointment Requests</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card>
            <CardContent className="p-0">
              <DailySchedule />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardContent className="p-0">
              <AppointmentRequests />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardContent className="p-0">
              <DailySchedule showUpcoming={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorAppointments;
