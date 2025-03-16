import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import {
  format,
  addDays,
  isBefore,
  isAfter,
  addHours,
  setHours,
  setMinutes,
} from "date-fns";
import { Clock, Calendar as CalendarIcon, Info } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AppointmentSchedulerProps {
  availableTimeSlots?: Array<{
    date: Date;
    slots: Array<{ start: Date; end: Date; available: boolean }>;
  }>;
  onAppointmentRequest?: (appointmentData: AppointmentFormData) => void;
}

interface Doctor {
  id: string;
  name: string;
}

interface AppointmentFormData {
  appointment_date: Date;
  time_slot: string;
  reason: string;
  notes: string;
  appointment_type: string;
  doctor_id: string;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({
  availableTimeSlots = generateMockTimeSlots(),
  onAppointmentRequest = () => {},
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<AppointmentFormData>({
    defaultValues: {
      appointment_date: new Date(),
      time_slot: "",
      reason: "",
      notes: "",
      appointment_type: "regular",
      doctor_id: "",
    },
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name")
          .eq("role", "doctor");

        if (error) throw error;
        setDoctors(data || []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        toast({
          title: "Error",
          description: "Failed to load doctors. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [toast]);

  // Filter available time slots for the selected date
  const availableSlotsForDate = selectedDate
    ? availableTimeSlots
        .find(
          (day) =>
            format(day.date, "yyyy-MM-dd") ===
            format(selectedDate, "yyyy-MM-dd"),
        )
        ?.slots.filter((slot) => slot.available) || []
    : [];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slotTime: string) => {
    setSelectedSlot(slotTime);
    form.setValue("time_slot", slotTime);
    form.setValue("appointment_date", selectedDate as Date);
  };

  const handleAppointmentSubmit = (data: AppointmentFormData) => {
    console.log("Submitting appointment with data:", data);
    
    if (!data.doctor_id) {
      toast({
        title: "Error",
        description: "Please select a doctor for your appointment",
        variant: "destructive",
      });
      return;
    }

    onAppointmentRequest({
      appointment_date: data.appointment_date,
      time_slot: data.time_slot,
      reason: data.reason,
      notes: data.notes,
      appointment_type: data.appointment_type,
      doctor_id: data.doctor_id,
      duration: 30,
      status: 'pending'
    });
    setDialogOpen(false);
    toast({
      title: "Appointment Requested",
      description: `Your appointment request for ${format(data.appointment_date, "MMMM do, yyyy")} at ${data.time_slot} has been submitted.`,
    });
    form.reset();
    setSelectedSlot(null);
  };

  // Function to determine if a date should be disabled
  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (isBefore(date, new Date())) return true;

    // Disable dates more than 3 months in the future
    if (isAfter(date, addDays(new Date(), 90))) return true;

    // Disable weekends (0 is Sunday, 6 is Saturday)
    const day = date.getDay();
    if (day === 0 || day === 6) return true;

    // Check if there are any available slots for this date
    const dateHasSlots = availableTimeSlots.some(
      (daySlot) =>
        format(daySlot.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd") &&
        daySlot.slots.some((slot) => slot.available),
    );

    return !dateHasSlots;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">
        Schedule an Appointment
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Calendar Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Select a Date
          </h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="rounded-md border"
          />

          <div className="mt-4 text-sm text-gray-500">
            <p className="flex items-center">
              <Info className="h-4 w-4 mr-1" />
              Only dates with available slots are selectable
            </p>
          </div>
        </div>

        {/* Time Slots Section */}
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Available Time Slots
          </h3>

          {selectedDate ? (
            <div>
              <p className="text-sm mb-4">
                Selected date:{" "}
                <span className="font-medium">
                  {format(selectedDate, "MMMM do, yyyy")}
                </span>
              </p>

              {availableSlotsForDate.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableSlotsForDate.map((slot, index) => {
                    const timeString = `${format(slot.start, "h:mm a")} - ${format(slot.end, "h:mm a")}`;
                    return (
                      <Button
                        key={index}
                        variant={
                          selectedSlot === timeString ? "default" : "outline"
                        }
                        className="text-sm py-2"
                        onClick={() => handleSlotSelect(timeString)}
                      >
                        {timeString}
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    No available time slots for this date.
                  </p>
                  <p className="text-sm mt-2">Please select another date.</p>
                </div>
              )}

              {selectedSlot && (
                <div className="mt-6">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">Request Appointment</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Request Appointment</DialogTitle>
                      </DialogHeader>

                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(handleAppointmentSubmit)}
                          className="space-y-4"
                        >
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormItem>
                                <FormLabel>Date</FormLabel>
                                <Input
                                  value={
                                    selectedDate
                                      ? format(selectedDate, "MMMM do, yyyy")
                                      : ""
                                  }
                                  disabled
                                />
                              </FormItem>
                              <FormItem>
                                <FormLabel>Time</FormLabel>
                                <Input value={selectedSlot || ""} disabled />
                              </FormItem>
                            </div>

                            <FormField
                              control={form.control}
                              name="doctor_id"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Doctor</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a doctor" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {doctors.map((doctor) => (
                                        <SelectItem key={doctor.id} value={doctor.id}>
                                          {doctor.name}
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
                              name="appointment_type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Appointment Type</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select appointment type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="regular">
                                        Regular Checkup
                                      </SelectItem>
                                      <SelectItem value="followup">
                                        Follow-up Visit
                                      </SelectItem>
                                      <SelectItem value="urgent">
                                        Urgent Care
                                      </SelectItem>
                                      <SelectItem value="specialist">
                                        Specialist Consultation
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="reason"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Reason for Visit</FormLabel>
                                  <Input
                                    placeholder="Brief description of your visit reason"
                                    {...field}
                                  />
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="notes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Additional Notes</FormLabel>
                                  <Textarea
                                    placeholder="Any additional information the doctor should know"
                                    className="min-h-[80px]"
                                    {...field}
                                  />
                                  <FormDescription>
                                    Include any symptoms, medications, or
                                    concerns.
                                  </FormDescription>
                                </FormItem>
                              )}
                            />
                          </div>

                          <DialogFooter>
                            <Button type="submit">Confirm Request</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                Please select a date to view available time slots.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to generate mock time slots for the next 30 days
function generateMockTimeSlots() {
  const slots = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = addDays(today, i);
    const day = date.getDay();

    // Skip weekends
    if (day === 0 || day === 6) continue;

    const daySlots = [];
    // Generate time slots from 9 AM to 4 PM with 1-hour intervals
    for (let hour = 9; hour < 16; hour++) {
      const start = setMinutes(setHours(new Date(date), hour), 0);
      const end = addHours(start, 1);

      // Randomly mark some slots as unavailable
      const available = Math.random() > 0.3;

      daySlots.push({
        start,
        end,
        available,
      });
    }

    slots.push({
      date,
      slots: daySlots,
    });
  }

  return slots;
}

export default AppointmentScheduler;

