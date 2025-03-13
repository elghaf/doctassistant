import React, { useState, useEffect } from "react";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Plus,
  User,
  FileText,
  Edit,
  Trash2,
  Bell,
} from "lucide-react";
import AppointmentModal from "@/components/appointments/AppointmentModal";
import { getAppointments } from "@/lib/supabase";

interface Appointment {
  id: string;
  patient_id: string;
  patient_name?: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  send_pre_visit_notification: boolean;
}

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentAdded = () => {
    fetchAppointments();
    setIsAppointmentModalOpen(false);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentModalOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter appointments based on search query
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE, MMM d");
  };

  // Mock data for demonstration
  const mockAppointments: Appointment[] = [];

  const displayAppointments =
    appointments.length > 0 ? appointments : mockAppointments;

  const upcomingAppointments = displayAppointments.filter(
    (appointment) =>
      appointment.status === "scheduled" || appointment.status === "confirmed",
  );

  const completedAppointments = displayAppointments.filter(
    (appointment) => appointment.status === "completed",
  );

  const cancelledAppointments = displayAppointments.filter(
    (appointment) => appointment.status === "cancelled",
  );

  return (
    <DashboardLayout>
      <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Appointments</h1>
              <p className="text-gray-500">Manage patient appointments</p>
            </div>
            <Button
              onClick={() => {
                setSelectedAppointment(null);
                setIsAppointmentModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Schedule Appointment
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Appointment Schedule</CardTitle>
                <div className="flex items-center gap-2">
                  <form
                    onSubmit={handleSearch}
                    className="flex items-center gap-2"
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search appointments..."
                        className="pl-10 w-[300px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
              <CardDescription>
                View and manage all scheduled appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="upcoming">
                    Upcoming ({upcomingAppointments.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completed ({completedAppointments.length})
                  </TabsTrigger>
                  <TabsTrigger value="cancelled">
                    Cancelled ({cancelledAppointments.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming">
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Patient</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Pre-Visit</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {upcomingAppointments
                            .filter((appointment) =>
                              searchQuery
                                ? appointment.patient_name
                                    ?.toLowerCase()
                                    .includes(searchQuery.toLowerCase()) ||
                                  appointment.type
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase())
                                : true,
                            )
                            .map((appointment) => (
                              <TableRow key={appointment.id}>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5 text-gray-500" />
                                      <span>
                                        {getDateLabel(appointment.date)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500">
                                      <Clock className="h-3.5 w-3.5" />
                                      <span>{appointment.time}</span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                      <User className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">
                                      {appointment.patient_name}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {appointment.type.charAt(0).toUpperCase() +
                                    appointment.type.slice(1)}
                                </TableCell>
                                <TableCell>
                                  {appointment.duration} min
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={getStatusColor(
                                      appointment.status,
                                    )}
                                  >
                                    {appointment.status
                                      .charAt(0)
                                      .toUpperCase() +
                                      appointment.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {appointment.send_pre_visit_notification ? (
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-50 text-blue-700 border-blue-200"
                                    >
                                      <Bell className="h-3 w-3 mr-1" />
                                      Enabled
                                    </Badge>
                                  ) : (
                                    <span className="text-gray-500 text-sm">
                                      Not set
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        // View details
                                      }}
                                    >
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleEditAppointment(appointment)
                                      }
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        // Cancel appointment
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="completed">
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Patient</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {completedAppointments
                            .filter((appointment) =>
                              searchQuery
                                ? appointment.patient_name
                                    ?.toLowerCase()
                                    .includes(searchQuery.toLowerCase()) ||
                                  appointment.type
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase())
                                : true,
                            )
                            .map((appointment) => (
                              <TableRow key={appointment.id}>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5 text-gray-500" />
                                      <span>
                                        {format(
                                          parseISO(appointment.date),
                                          "MMM d, yyyy",
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500">
                                      <Clock className="h-3.5 w-3.5" />
                                      <span>{appointment.time}</span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                      <User className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">
                                      {appointment.patient_name}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {appointment.type.charAt(0).toUpperCase() +
                                    appointment.type.slice(1)}
                                </TableCell>
                                <TableCell>
                                  {appointment.duration} min
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={getStatusColor(
                                      appointment.status,
                                    )}
                                  >
                                    {appointment.status
                                      .charAt(0)
                                      .toUpperCase() +
                                      appointment.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        // View details
                                      }}
                                    >
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="cancelled">
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Patient</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cancelledAppointments
                            .filter((appointment) =>
                              searchQuery
                                ? appointment.patient_name
                                    ?.toLowerCase()
                                    .includes(searchQuery.toLowerCase()) ||
                                  appointment.type
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase())
                                : true,
                            )
                            .map((appointment) => (
                              <TableRow key={appointment.id}>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5 text-gray-500" />
                                      <span>
                                        {format(
                                          parseISO(appointment.date),
                                          "MMM d, yyyy",
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500">
                                      <Clock className="h-3.5 w-3.5" />
                                      <span>{appointment.time}</span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                      <User className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">
                                      {appointment.patient_name}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {appointment.type.charAt(0).toUpperCase() +
                                    appointment.type.slice(1)}
                                </TableCell>
                                <TableCell>
                                  {appointment.duration} min
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={getStatusColor(
                                      appointment.status,
                                    )}
                                  >
                                    {appointment.status
                                      .charAt(0)
                                      .toUpperCase() +
                                      appointment.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        // View details
                                      }}
                                    >
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        // Reschedule
                                      }}
                                    >
                                      <Calendar className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <AppointmentModal
        open={isAppointmentModalOpen}
        onOpenChange={setIsAppointmentModalOpen}
        appointment={selectedAppointment || undefined}
        isEditing={!!selectedAppointment}
        onSave={handleAppointmentAdded}
      />
    </DashboardLayout>
  );
};

export default AppointmentsPage;
