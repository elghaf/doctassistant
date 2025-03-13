import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, AlertCircle, Plus, Trash } from "lucide-react";

const formSchema = z.object({
  conditions: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Condition name is required" }),
        diagnosedDate: z
          .string()
          .min(1, { message: "Diagnosis date is required" }),
        status: z.enum(["active", "managed", "resolved"]),
        notes: z.string().optional(),
      }),
    )
    .optional(),
  allergies: z
    .array(
      z.object({
        allergen: z.string().min(1, { message: "Allergen name is required" }),
        severity: z.enum(["mild", "moderate", "severe"]),
        reaction: z.string().min(1, { message: "Reaction is required" }),
        diagnosedDate: z.string().optional(),
      }),
    )
    .optional(),
  surgeries: z
    .array(
      z.object({
        procedure: z.string().min(1, { message: "Procedure name is required" }),
        date: z.string().min(1, { message: "Date is required" }),
        hospital: z.string().optional(),
        surgeon: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .optional(),
  familyHistory: z
    .object({
      heartDisease: z.boolean().optional(),
      diabetes: z.boolean().optional(),
      cancer: z.boolean().optional(),
      hypertension: z.boolean().optional(),
      stroke: z.boolean().optional(),
      mentalHealth: z.boolean().optional(),
      other: z.string().optional(),
    })
    .optional(),
  lifestyle: z
    .object({
      smoking: z.enum(["never", "former", "current"]).optional(),
      alcohol: z.enum(["none", "occasional", "moderate", "heavy"]).optional(),
      exercise: z.enum(["none", "light", "moderate", "heavy"]).optional(),
      diet: z.string().optional(),
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MedicalHistoryFormProps {
  patientId?: string;
  initialData?: FormValues;
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
}

const MedicalHistoryForm = ({
  patientId = "",
  initialData,
  onSubmit = () => {},
  onCancel = () => {},
}: MedicalHistoryFormProps) => {
  const defaultValues: FormValues = {
    conditions: [],
    allergies: [],
    surgeries: [],
    familyHistory: {
      heartDisease: false,
      diabetes: false,
      cancer: false,
      hypertension: false,
      stroke: false,
      mentalHealth: false,
      other: "",
    },
    lifestyle: {
      smoking: undefined,
      alcohol: undefined,
      exercise: undefined,
      diet: "",
    },
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || defaultValues,
  });

  // Use useFieldArray hook from react-hook-form to manage arrays of fields
  const {
    fields: conditionFields,
    append: appendCondition,
    remove: removeCondition,
  } = useFieldArray({
    control: form.control,
    name: "conditions",
    defaultValue: [defaultValues.conditions?.[0]],
  });

  const {
    fields: allergyFields,
    append: appendAllergy,
    remove: removeAllergy,
  } = useFieldArray({
    control: form.control,
    name: "allergies",
    defaultValue: [defaultValues.allergies?.[0]],
  });

  const {
    fields: surgeryFields,
    append: appendSurgery,
    remove: removeSurgery,
  } = useFieldArray({
    control: form.control,
    name: "surgeries",
    defaultValue: [defaultValues.surgeries?.[0]],
  });

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Medical Conditions Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex justify-between items-center">
                <span>Medical Conditions</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendCondition({
                      name: "",
                      diagnosedDate: format(new Date(), "yyyy-MM-dd"),
                      status: "active",
                      notes: "",
                    })
                  }
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Condition
                </Button>
              </CardTitle>
              <CardDescription>
                Enter all diagnosed medical conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {conditionFields.map((field, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative"
                >
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeCondition(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                  <FormField
                    control={form.control}
                    name={`conditions.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Hypertension" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`conditions.${index}.diagnosedDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Diagnosed</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="date" {...field} />
                            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`conditions.${index}.status`}
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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="managed">Managed</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`conditions.${index}.notes`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional details about the condition"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Allergies Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex justify-between items-center">
                <span>Allergies</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendAllergy({
                      allergen: "",
                      severity: "mild",
                      reaction: "",
                      diagnosedDate: format(new Date(), "yyyy-MM-dd"),
                    })
                  }
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Allergy
                </Button>
              </CardTitle>
              <CardDescription>
                List all known allergies and reactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {allergyFields.map((field, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative"
                >
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeAllergy(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                  <FormField
                    control={form.control}
                    name={`allergies.${index}.allergen`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergen</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Penicillin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`allergies.${index}.severity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mild">Mild</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="severe">Severe</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`allergies.${index}.reaction`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reaction</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Hives, difficulty breathing"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`allergies.${index}.diagnosedDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Identified</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="date" {...field} />
                            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Surgical History Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex justify-between items-center">
                <span>Surgical History</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendSurgery({
                      procedure: "",
                      date: format(new Date(), "yyyy-MM-dd"),
                      hospital: "",
                      surgeon: "",
                      notes: "",
                    })
                  }
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Surgery
                </Button>
              </CardTitle>
              <CardDescription>
                Record all past surgical procedures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {surgeryFields.map((field, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative"
                >
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeSurgery(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                  <FormField
                    control={form.control}
                    name={`surgeries.${index}.procedure`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Procedure</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Appendectomy" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`surgeries.${index}.date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="date" {...field} />
                            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`surgeries.${index}.hospital`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hospital</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Memorial Hospital"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`surgeries.${index}.surgeon`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surgeon</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Dr. Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`surgeries.${index}.notes`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional details about the procedure"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Family History Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Family History</CardTitle>
              <CardDescription>
                Select conditions present in immediate family members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="familyHistory.heartDisease"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Heart Disease</FormLabel>
                        <FormDescription>
                          Coronary artery disease, heart attack, heart failure
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="familyHistory.diabetes"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Diabetes</FormLabel>
                        <FormDescription>
                          Type 1 or Type 2 diabetes
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="familyHistory.cancer"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Cancer</FormLabel>
                        <FormDescription>
                          Any type of cancer in family history
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="familyHistory.hypertension"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Hypertension</FormLabel>
                        <FormDescription>High blood pressure</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="familyHistory.stroke"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Stroke</FormLabel>
                        <FormDescription>
                          Cerebrovascular accident (CVA)
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="familyHistory.mentalHealth"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Mental Health Conditions</FormLabel>
                        <FormDescription>
                          Depression, anxiety, bipolar disorder, schizophrenia
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="familyHistory.other"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Other Conditions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List any other relevant family medical conditions"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Lifestyle Information</CardTitle>
              <CardDescription>
                Information about patient's lifestyle and habits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="lifestyle.smoking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Smoking Status</FormLabel>
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
                          <SelectItem value="never">Never smoked</SelectItem>
                          <SelectItem value="former">Former smoker</SelectItem>
                          <SelectItem value="current">
                            Current smoker
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lifestyle.alcohol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alcohol Consumption</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="occasional">
                            Occasional (1-2 drinks/week)
                          </SelectItem>
                          <SelectItem value="moderate">
                            Moderate (3-7 drinks/week)
                          </SelectItem>
                          <SelectItem value="heavy">
                            Heavy (8+ drinks/week)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lifestyle.exercise"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise Frequency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="light">
                            Light (1-2 days/week)
                          </SelectItem>
                          <SelectItem value="moderate">
                            Moderate (3-5 days/week)
                          </SelectItem>
                          <SelectItem value="heavy">
                            Heavy (6-7 days/week)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lifestyle.diet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dietary Habits</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe patient's typical diet and any dietary restrictions"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Medical History</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MedicalHistoryForm;
