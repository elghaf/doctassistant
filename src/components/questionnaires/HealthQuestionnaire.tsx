import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface HealthQuestionnaireProps {
  patientId?: string;
  onSubmit?: (data: HealthQuestionnaireData) => void;
  isReadOnly?: boolean;
}

export interface HealthQuestionnaireData {
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
  };
  medicalHistory: {
    hasHeartDisease: boolean;
    hasDiabetes: boolean;
    hasAsthma: boolean;
    hasHypertension: boolean;
    hasArthritis: boolean;
    hasCancer: boolean;
    otherConditions: string;
  };
  currentSymptoms: {
    hasFever: boolean;
    hasCough: boolean;
    hasBreathingDifficulty: boolean;
    hasFatigue: boolean;
    hasHeadache: boolean;
    hasPain: boolean;
    painLocation: string;
    symptomDuration: string;
    symptomSeverity: string;
  };
  medications: {
    currentMedications: string;
    allergies: string;
  };
  lifestyle: {
    smokingStatus: string;
    alcoholConsumption: string;
    exerciseFrequency: string;
    dietDescription: string;
  };
  additionalNotes: string;
}

const HealthQuestionnaire: React.FC<HealthQuestionnaireProps> = ({
  patientId = "12345",
  onSubmit = () => {},
  isReadOnly = false,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const defaultValues: HealthQuestionnaireData = {
    personalInfo: {
      fullName: "John Doe",
      dateOfBirth: "1985-05-15",
      gender: "male",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
    },
    medicalHistory: {
      hasHeartDisease: false,
      hasDiabetes: false,
      hasAsthma: true,
      hasHypertension: false,
      hasArthritis: false,
      hasCancer: false,
      otherConditions: "Seasonal allergies",
    },
    currentSymptoms: {
      hasFever: false,
      hasCough: true,
      hasBreathingDifficulty: false,
      hasFatigue: true,
      hasHeadache: true,
      hasPain: false,
      painLocation: "",
      symptomDuration: "3-5 days",
      symptomSeverity: "moderate",
    },
    medications: {
      currentMedications: "Albuterol inhaler as needed, Claritin 10mg daily",
      allergies: "Penicillin, Peanuts",
    },
    lifestyle: {
      smokingStatus: "never",
      alcoholConsumption: "occasional",
      exerciseFrequency: "2-3 times per week",
      dietDescription: "Balanced diet with occasional fast food",
    },
    additionalNotes:
      "I've been experiencing more frequent headaches in the past month, possibly related to increased screen time.",
  };

  const form = useForm<HealthQuestionnaireData>({
    defaultValues,
  });

  const handleSubmit = (data: HealthQuestionnaireData) => {
    onSubmit(data);
    setIsSubmitted(true);
    // In a real app, this would send data to the server
    console.log("Form submitted:", data);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-background">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Questionnaire Submitted
            </CardTitle>
            <CardDescription className="text-center">
              Thank you for completing your health questionnaire.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-lg text-center">
              Your information has been successfully submitted and will be
              reviewed by your doctor before your appointment.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => setIsSubmitted(false)}>
              Return to Questionnaire
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-background">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Health Questionnaire</CardTitle>
          <CardDescription>
            Please complete this questionnaire to help us better understand your
            health needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="personalInfo.fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Full Name"
                            {...field}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personalInfo.dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} disabled={isReadOnly} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="personalInfo.gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          disabled={isReadOnly}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">
                              Non-binary
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">
                              Prefer not to say
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personalInfo.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Email"
                            {...field}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="personalInfo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phone Number"
                          {...field}
                          disabled={isReadOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Medical History Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Medical History</h3>
                <p className="text-sm text-muted-foreground">
                  Please check all conditions that apply to you:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="medicalHistory.hasHeartDisease"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Heart Disease</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalHistory.hasDiabetes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Diabetes</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalHistory.hasAsthma"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Asthma</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalHistory.hasHypertension"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Hypertension</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalHistory.hasArthritis"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Arthritis</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalHistory.hasCancer"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Cancer</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="medicalHistory.otherConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Medical Conditions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please list any other medical conditions not mentioned above"
                          {...field}
                          disabled={isReadOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Current Symptoms Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Current Symptoms</h3>
                <p className="text-sm text-muted-foreground">
                  Please check all symptoms you are currently experiencing:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currentSymptoms.hasFever"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Fever</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentSymptoms.hasCough"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Cough</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentSymptoms.hasBreathingDifficulty"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Difficulty Breathing</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentSymptoms.hasFatigue"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Fatigue</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentSymptoms.hasHeadache"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Headache</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentSymptoms.hasPain"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Pain</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch("currentSymptoms.hasPain") && (
                  <FormField
                    control={form.control}
                    name="currentSymptoms.painLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pain Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Where is your pain located?"
                            {...field}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currentSymptoms.symptomDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symptom Duration</FormLabel>
                        <Select
                          disabled={isReadOnly}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="How long have you had these symptoms?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="less than 24 hours">
                              Less than 24 hours
                            </SelectItem>
                            <SelectItem value="1-2 days">1-2 days</SelectItem>
                            <SelectItem value="3-5 days">3-5 days</SelectItem>
                            <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                            <SelectItem value="more than 2 weeks">
                              More than 2 weeks
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currentSymptoms.symptomSeverity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Symptom Severity</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                            disabled={isReadOnly}
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="mild" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Mild
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="moderate" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Moderate
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="severe" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Severe
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Medications Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Medications & Allergies</h3>

                <FormField
                  control={form.control}
                  name="medications.currentMedications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Medications</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please list all medications you are currently taking, including dosage and frequency"
                          {...field}
                          disabled={isReadOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medications.allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergies</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please list any known allergies to medications, foods, or other substances"
                          {...field}
                          disabled={isReadOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Lifestyle Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Lifestyle</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lifestyle.smokingStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Smoking Status</FormLabel>
                        <Select
                          disabled={isReadOnly}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select smoking status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="never">Never smoked</SelectItem>
                            <SelectItem value="former">
                              Former smoker
                            </SelectItem>
                            <SelectItem value="occasional">
                              Occasional smoker
                            </SelectItem>
                            <SelectItem value="regular">
                              Regular smoker
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lifestyle.alcoholConsumption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alcohol Consumption</FormLabel>
                        <Select
                          disabled={isReadOnly}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select alcohol consumption" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="occasional">
                              Occasional (1-2 drinks per week)
                            </SelectItem>
                            <SelectItem value="moderate">
                              Moderate (3-7 drinks per week)
                            </SelectItem>
                            <SelectItem value="heavy">
                              Heavy (8+ drinks per week)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="lifestyle.exerciseFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise Frequency</FormLabel>
                      <Select
                        disabled={isReadOnly}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select exercise frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="1 time per week">
                            1 time per week
                          </SelectItem>
                          <SelectItem value="2-3 times per week">
                            2-3 times per week
                          </SelectItem>
                          <SelectItem value="4-5 times per week">
                            4-5 times per week
                          </SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lifestyle.dietDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diet Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please describe your typical diet"
                          {...field}
                          disabled={isReadOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Additional Notes Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Notes</h3>

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide any additional information that you think would be helpful for your doctor to know"
                          {...field}
                          disabled={isReadOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!isReadOnly && (
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    Reset
                  </Button>
                  <Button type="submit">Submit Questionnaire</Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthQuestionnaire;
