import React, { useState } from "react";
import { format, addDays, addMinutes, parse } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  Bell,
  X,
  Check,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface Patient {
  id: string;
  name: string;
  profileImage?: string;
  lastVisit?: string;
}

interface AppointmentModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (data: AppointmentFormValues) => void;
  onCancel?: () => void;
  appointment?: Partial<AppointmentFormValues>;
  patients?: Patient[];
  isEditing?: boolean;
}

const appointmentSchema = z.object({
  patientId: z.string({
    required_error: "Please select a patient",
  }),
  date: z.date({
    required_error: "Appointment date is required",
  }),
  time: z.string({
    required_error: "Appointment time is required",
  }),
  duration: z
    .number({
      required_error: "Duration is required",
    })
    .min(15, {
      message: "Duration must be at least 15 minutes",
    }),
  type: z.string({
    required_error: "Appointment type is required",
  }),
  notes: z.string().optional(),
  status: z.enum(["scheduled", "confirmed", "completed", "cancelled"]),
  sendPreVisitNotification: z.boolean().default(false),
  preVisitNotificationTime: z.number().optional(),
  preVisitIncludeDetails: z.boolean().default(false),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const AppointmentModal = ({
  open = true,
  onOpenChange = () => {},
  onSave = () => {},
  onCancel = () => {},
  appointment,
  patients = [
    {
      id: "1",
      name: "Sarah Johnson",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      lastVisit: "2023-12-15",
    },
    {
      id: "2",
      name: "Michael Chen",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      lastVisit: "2024-01-05",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      lastVisit: "2024-01-22",
    },
    {
      id: "4",
      name: "David Wilson",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      lastVisit: "2023-11-30",
    },
  ],
  isEditing = false,
}: AppointmentModalProps) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    appointment?.patientId
      ? patients.find((p) => p.id === appointment.patientId) || null
      : null,
  );

  const defaultValues: Partial<AppointmentFormValues> = {
    patientId: appointment?.patientId || "",
    date: appointment?.date || undefined,
    time: appointment?.time || "",
    duration: appointment?.duration || undefined,
    type: appointment?.type || "",
    notes: appointment?.notes || "",
    status: appointment?.status || "scheduled",
    sendPreVisitNotification: appointment?.sendPreVisitNotification || false,
    preVisitNotificationTime:
      appointment?.preVisitNotificationTime || undefined,
    preVisitIncludeDetails: appointment?.preVisitIncludeDetails || false,
  };

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues,
  });

  const watchSendPreVisitNotification = form.watch("sendPreVisitNotification");

  const handleSubmit = async (data: AppointmentFormValues) => {
    try {
      // Save appointment data to Supabase
      const { createAppointment } = await import("@/lib/supabase");

      const newAppointment = await createAppointment({
        patient_id: data.patientId,
        date: data.date.toISOString().split("T")[0],
        time: data.time,
        duration: data.duration,
        type: data.type,
        status: data.status,
        notes: data.notes || null,
        send_pre_visit_notification: data.sendPreVisitNotification,
        pre_visit_notification_time: data.preVisitNotificationTime || null,
        pre_visit_include_details: data.preVisitIncludeDetails,
      });

      // Call the onSave callback with the complete appointment data
      onSave({
        ...data,
        id: newAppointment.id,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving appointment data:", error);
      // You could add error handling UI here
    }
  };

  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    setSelectedPatient(patient || null);
  };

  const appointmentTypes = [
    { value: "initial", label: "Initial Consultation" },
    { value: "follow-up", label: "Follow-up" },
    { value: "physical", label: "Annual Physical" },
    { value: "urgent", label: "Urgent Care" },
    { value: "specialist", label: "Specialist Referral" },
    { value: "lab", label: "Lab Work" },
    { value: "procedure", label: "Medical Procedure" },
  ];

  const durations = [
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 45, label: "45 minutes" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" },
    { value: 120, label: "2 hours" },
  ];

  const notificationTimes = [
    { value: 1, label: "1 hour before" },
    { value: 2, label: "2 hours before" },
    { value: 24, label: "1 day before" },
    { value: 48, label: "2 days before" },
    { value: 72, label: "3 days before" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Appointment" : "Schedule New Appointment"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the appointment details below."
              : "Fill in the details to schedule a new patient appointment."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Patient Selection */}
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Patient</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handlePatientSelect(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={patient.profileImage}
                                alt={patient.name}
                              />
                              <AvatarFallback>
                                {patient.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>{patient.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Patient Info Card (if selected) */}
            {selectedPatient && (
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={selectedPatient.profileImage}
                    alt={selectedPatient.name}
                  />
                  <AvatarFallback>
                    {selectedPatient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedPatient.name}</h4>
                  {selectedPatient.lastVisit && (
                    <p className="text-sm text-muted-foreground">
                      Last visit:{" "}
                      {new Date(selectedPatient.lastVisit).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  type="button"
                  asChild
                >
                  <a href={`/patients/${selectedPatient.id}`} target="_blank">
                    View Patient Profile
                  </a>
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Selection */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={
                              "w-full pl-3 text-left font-normal flex justify-between items-center"
                            }
                          >
                            <div className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </div>
                            <div></div>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < addDays(new Date(), -1)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time Selection */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <FormControl>
                        <Input type="time" className="pl-10" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {durations.map((duration) => (
                          <SelectItem
                            key={duration.value}
                            value={duration.value.toString()}
                          >
                            {duration.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Appointment Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {appointmentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              Scheduled
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="confirmed">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Confirmed
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="completed">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-gray-700 border-gray-200"
                            >
                              Completed
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="cancelled">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-200"
                            >
                              Cancelled
                            </Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes about this appointment"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include any special instructions or preparation needed for
                    this appointment.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Pre-Visit Notification */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pre-Visit Notification</h3>
              <FormField
                control={form.control}
                name="sendPreVisitNotification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Send Pre-Visit Notification
                      </FormLabel>
                      <FormDescription>
                        Automatically send a notification with patient
                        information before the appointment.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {watchSendPreVisitNotification && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4 border-l-2 border-primary/20">
                  <FormField
                    control={form.control}
                    name="preVisitNotificationTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notification Timing</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select when to send" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {notificationTimes.map((time) => (
                              <SelectItem
                                key={time.value}
                                value={time.value.toString()}
                              >
                                {time.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preVisitIncludeDetails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Include Patient Details</FormLabel>
                          <FormDescription>
                            Include medical history and recent visits in the
                            notification
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update Appointment" : "Schedule Appointment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
