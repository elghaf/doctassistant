import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Stethoscope,
  FileText,
  ClipboardList,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Define the form schema with validation
const visitFormSchema = z.object({
  visitDate: z.date({
    required_error: "Visit date is required",
  }),
  chiefComplaint: z.string().min(1, { message: "Chief complaint is required" }),
  diagnosis: z.string().optional(),
  treatmentPlan: z.string().optional(),
  notes: z.string().optional(),
});

type VisitFormValues = z.infer<typeof visitFormSchema>;

interface VisitFormProps {
  patientId: string;
  appointmentId?: string;
  onSubmit: (data: VisitFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<VisitFormValues>;
  isLoading?: boolean;
}

const VisitForm = ({
  patientId,
  appointmentId,
  onSubmit,
  onCancel,
  defaultValues,
  isLoading = false,
}: VisitFormProps) => {
  // Set up the form with default values
  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: defaultValues || {
      visitDate: new Date(),
      chiefComplaint: "",
      diagnosis: "",
      treatmentPlan: "",
      notes: "",
    },
  });

  // Handle form submission
  const handleSubmit = (data: VisitFormValues) => {
    onSubmit(data);
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Record Patient Visit</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="visitDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Visit Date*</FormLabel>
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
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chiefComplaint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chief Complaint*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Stethoscope className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                          <Textarea
                            className="pl-10 min-h-[100px]"
                            placeholder="Enter the patient's main complaint or reason for visit"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnosis</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                          <Textarea
                            className="pl-10 min-h-[100px]"
                            placeholder="Enter diagnosis information"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="treatmentPlan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treatment Plan</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <ClipboardList className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                          <Textarea
                            className="pl-10 min-h-[100px]"
                            placeholder="Enter treatment plan details"
                            {...field}
                          />
                        </div>
                      </FormControl>
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
                      <FormControl>
                        <div className="relative">
                          <Info className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                          <Textarea
                            className="pl-10 min-h-[100px]"
                            placeholder="Enter any additional notes about the visit"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Include any relevant information not covered in other
                        sections.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-between pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Visit Record"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VisitForm;
