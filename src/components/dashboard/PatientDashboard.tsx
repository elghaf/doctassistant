import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { database } from "@/lib/database";
import DashboardSidebar from "./DashboardSidebar";
import AppointmentScheduler from "../appointments/AppointmentScheduler";
import HealthQuestionnaire from "../questionnaires/HealthQuestionnaire";
import MedicalReportsList from "../reports/MedicalReportsList";
import UpcomingAppointments from "../appointments/UpcomingAppointments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Calendar, FileText, User, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const [notificationsData] = await Promise.all([
          database.notifications.getUnread(user.id),
          // Add other data fetching here (appointments, questionnaires, etc.)
        ]);

        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const markAllNotificationsAsRead = async () => {
    if (!user) return;

    try {
      await Promise.all(
        notifications.map((notification) =>
          database.notifications.markAsRead(notification.id)
        )
      );
      setNotifications([]);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        userType={user?.role}
        userName={user?.name}
        userAvatar={user?.avatar}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header with welcome message */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user?.name}
              </h1>
              <p className="text-gray-600">
                Manage your health information and appointments
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.name
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Main dashboard content */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-5 w-full max-w-4xl mx-auto mb-6">
              <TabsTrigger value={DASHBOARD_TABS.OVERVIEW}>Overview</TabsTrigger>
              <TabsTrigger value={DASHBOARD_TABS.APPOINTMENTS}>Appointments</TabsTrigger>
              <TabsTrigger value={DASHBOARD_TABS.QUESTIONNAIRES}>Questionnaires</TabsTrigger>
              <TabsTrigger value={DASHBOARD_TABS.REPORTS}>Medical Reports</TabsTrigger>
              <TabsTrigger value={DASHBOARD_TABS.NOTIFICATIONS}>Notifications</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value={DASHBOARD_TABS.OVERVIEW} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Quick Stats Cards */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-primary" />
                      Upcoming Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">
                      Next: June 15th, 10:00 AM
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-primary" />
                      Medical Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">7</p>
                    <p className="text-sm text-muted-foreground">
                      2 new reports available
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-primary" />
                      Health Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-500">Good</p>
                    <p className="text-sm text-muted-foreground">
                      Last checkup: May 10th
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest health-related activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.slice(0, 3).map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start space-x-4 p-3 rounded-lg bg-gray-50"
                      >
                        <div
                          className={`rounded-full p-2 ${notification.read ? "bg-gray-200" : "bg-blue-100"}`}
                        >
                          <Bell
                            className={`h-4 w-4 ${notification.read ? "text-gray-500" : "text-blue-500"}`}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-gray-600">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule an Appointment</CardTitle>
                    <CardDescription>
                      Book your next visit with a doctor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => setActiveTab(DASHBOARD_TABS.APPOINTMENTS)}
                    >
                      <Calendar className="mr-2 h-4 w-4" /> Schedule Now
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Complete Health Questionnaire</CardTitle>
                    <CardDescription>
                      Update your health information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => setActiveTab(DASHBOARD_TABS.QUESTIONNAIRES)}
                    >
                      <FileText className="mr-2 h-4 w-4" /> Start Questionnaire
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value={DASHBOARD_TABS.APPOINTMENTS} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule an Appointment</CardTitle>
                  <CardDescription>
                    Book your next visit with a doctor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AppointmentScheduler />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>
                    View and manage your scheduled appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UpcomingAppointments />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Questionnaires Tab */}
            <TabsContent value={DASHBOARD_TABS.QUESTIONNAIRES}>
              <Card>
                <CardHeader>
                  <CardTitle>Health Questionnaire</CardTitle>
                  <CardDescription>
                    Complete your health information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HealthQuestionnaire />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medical Reports Tab */}
            <TabsContent value={DASHBOARD_TABS.REPORTS}>
              <Card>
                <CardHeader>
                  <CardTitle>Medical Reports</CardTitle>
                  <CardDescription>
                    View and download your medical reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MedicalReportsList />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value={DASHBOARD_TABS.NOTIFICATIONS}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      Stay updated with your health information
                    </CardDescription>
                  </div>
                  {notifications.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllNotificationsAsRead}
                    >
                      Mark all as read
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {notifications.length === 0 ? (
                    <div className="text-center py-10">
                      <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-500">No notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg border ${!notification.read ? "bg-blue-50 border-blue-100" : "bg-white"}`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">
                              {notification.title}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {notification.date.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-1 text-gray-600">
                            {notification.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
