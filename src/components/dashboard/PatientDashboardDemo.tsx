import React, { useEffect, useState } from "react";
import { usePatientData } from "@/hooks/usePatientData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import UpcomingAppointments from "@/components/appointments/UpcomingAppointments";
import { setupDemoData } from "@/lib/setupDemoData";

export default function PatientDashboardDemo() {
  const [demoPatientId, setDemoPatientId] = useState<string | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(true);

  useEffect(() => {
    const initializeDemoData = async () => {
      try {
        setIsSettingUp(true);
        const result = await setupDemoData();
        if (result.success && result.patientId) {
          setDemoPatientId(result.patientId);
        } else {
          setSetupError(result.error?.message || "Failed to set up demo data");
        }
      } catch (error) {
        setSetupError(error instanceof Error ? error.message : "Unknown error occurred");
      } finally {
        setIsSettingUp(false);
      }
    };

    initializeDemoData();
  }, []);

  const {
    loading,
    error,
    patientProfile,
    appointments,
    questionnaires,
    reports,
  } = usePatientData(demoPatientId || "");

  if (isSettingUp) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Setting up demo data...</p>
        </div>
      </div>
    );
  }

  if (setupError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Setup Error</AlertTitle>
        <AlertDescription>{setupError}</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6 pb-16 block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">
          {patientProfile?.name || "Patient"}'s Dashboard
        </h2>
        <p className="text-muted-foreground">
          View your health information, appointments, and more.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {appointments?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {appointments?.length
                    ? "You have upcoming appointments"
                    : "No upcoming appointments"}
                </p>
                <Button variant="link" className="px-0 mt-2">
                  View details
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Questionnaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {questionnaires?.filter((q) => q.status === "pending")
                    .length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {questionnaires?.filter((q) => q.status === "pending").length
                    ? "You have questionnaires to complete"
                    : "No pending questionnaires"}
                </p>
                <Button variant="link" className="px-0 mt-2">
                  Complete now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Recent Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reports?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {reports?.length
                    ? "You have medical reports"
                    : "No medical reports"}
                </p>
                <Button variant="link" className="px-0 mt-2">
                  View reports
                </Button>
              </CardContent>
            </Card>
          </div>

          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Demo Mode</AlertTitle>
            <AlertDescription>
              This is a demo dashboard using a randomly generated UUID. For real
              data, use the setupDemoData function.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="appointments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments && appointments.length > 0 ? (
                <UpcomingAppointments appointments={appointments} />
              ) : (
                <p className="text-muted-foreground">
                  No upcoming appointments scheduled.
                </p>
              )}
              <Button className="mt-4">Schedule New Appointment</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {reports && reports.length > 0 ? (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer"
                    >
                      <h3 className="font-medium">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.report_date).toLocaleDateString()}
                      </p>
                      <p className="mt-2">{report.summary}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No medical reports available.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
