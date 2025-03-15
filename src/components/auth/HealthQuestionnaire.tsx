import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface HealthQuestionnaireProps {
  patientId: string;
  onSubmit: (data: any) => void;
}

const HealthQuestionnaire: React.FC<HealthQuestionnaireProps> = ({
  patientId,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    generalHealth: "",
    symptoms: [] as string[],
    concerns: "",
    medications: "",
    hasMedications: "",
    hasAllergies: "",
    allergies: "",
    smokingStatus: "",
    alcoholConsumption: "",
    exerciseFrequency: "",
    exerciseRoutine: "",
  });

  const [currentSection, setCurrentSection] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sections = [
    {
      title: "General Health",
      description: "Tell us about your overall health",
    },
    {
      title: "Medications",
      description: "Information about your current medications",
    },
    {
      title: "Lifestyle",
      description: "Information about your lifestyle habits",
    },
  ];

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData((prev) => {
      const currentValues = prev[field] as string[];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [field]: currentValues.filter((v) => v !== value),
        };
      } else {
        return { ...prev, [field]: [...currentValues, value] };
      }
    });
  };

  const validateSection = (sectionIndex: number) => {
    const newErrors: Record<string, string> = {};

    if (sectionIndex === 0) {
      if (!formData.generalHealth) {
        newErrors.generalHealth = "Please rate your overall health";
      }
      if (formData.symptoms.length === 0) {
        newErrors.symptoms = "Please select at least one option";
      }
    } else if (sectionIndex === 1) {
      if (!formData.hasMedications) {
        newErrors.hasMedications = "Please select an option";
      }
      if (formData.hasMedications === "Yes" && !formData.medications) {
        newErrors.medications = "Please list your medications";
      }
      if (!formData.hasAllergies) {
        newErrors.hasAllergies = "Please select an option";
      }
      if (formData.hasAllergies === "Yes" && !formData.allergies) {
        newErrors.allergies = "Please list your allergies";
      }
    } else if (sectionIndex === 2) {
      if (!formData.smokingStatus) {
        newErrors.smokingStatus = "Please select your smoking status";
      }
      if (!formData.alcoholConsumption) {
        newErrors.alcoholConsumption = "Please select your alcohol consumption";
      }
      if (!formData.exerciseFrequency) {
        newErrors.exerciseFrequency = "Please select your exercise frequency";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentSection((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (validateSection(currentSection)) {
      onSubmit({
        patientId,
        responses: formData,
        submittedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Annual Health Assessment</CardTitle>
        <CardDescription>
          Please complete this questionnaire before your annual check-up
          appointment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {sections.map((section, index) => (
              <div
                key={index}
                className={`text-sm ${index === currentSection ? "font-bold" : "text-muted-foreground"}`}
              >
                {section.title}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{
                width: `${((currentSection + 1) / sections.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="space-y-6">
          {currentSection === 0 && (
            <>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="generalHealth"
                    className={errors.generalHealth ? "text-destructive" : ""}
                  >
                    How would you rate your overall health?
                    <span className="text-destructive"> *</span>
                  </Label>
                  <RadioGroup
                    value={formData.generalHealth}
                    onValueChange={(value) =>
                      handleInputChange("generalHealth", value)
                    }
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Excellent" id="health-excellent" />
                      <Label htmlFor="health-excellent">Excellent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Very Good" id="health-very-good" />
                      <Label htmlFor="health-very-good">Very Good</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Good" id="health-good" />
                      <Label htmlFor="health-good">Good</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Fair" id="health-fair" />
                      <Label htmlFor="health-fair">Fair</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Poor" id="health-poor" />
                      <Label htmlFor="health-poor">Poor</Label>
                    </div>
                  </RadioGroup>
                  {errors.generalHealth && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.generalHealth}
                    </p>
                  )}
                </div>

                <div>
                  <Label className={errors.symptoms ? "text-destructive" : ""}>
                    Have you experienced any of the following symptoms in the
                    past 3 months? (Select all that apply)
                    <span className="text-destructive"> *</span>
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {[
                      "Persistent fatigue",
                      "Unexplained weight loss or gain",
                      "Chronic pain",
                      "Difficulty sleeping",
                      "Digestive issues",
                      "Headaches",
                      "Dizziness",
                      "None of the above",
                    ].map((symptom) => (
                      <div
                        key={symptom}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`symptom-${symptom.toLowerCase().replace(/\s+/g, "-")}`}
                          checked={formData.symptoms.includes(symptom)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleCheckboxChange("symptoms", symptom);
                            } else {
                              handleCheckboxChange("symptoms", symptom);
                            }
                          }}
                        />
                        <Label
                          htmlFor={`symptom-${symptom.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.symptoms && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.symptoms}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="concerns">
                    Please describe any health concerns you'd like to discuss
                    with your doctor:
                  </Label>
                  <Textarea
                    id="concerns"
                    value={formData.concerns}
                    onChange={(e) =>
                      handleInputChange("concerns", e.target.value)
                    }
                    className="mt-2"
                    placeholder="Enter your concerns here..."
                  />
                </div>
              </div>
            </>
          )}

          {currentSection === 1 && (
            <>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="hasMedications"
                    className={errors.hasMedications ? "text-destructive" : ""}
                  >
                    Are you currently taking any medications?
                    <span className="text-destructive"> *</span>
                  </Label>
                  <RadioGroup
                    value={formData.hasMedications}
                    onValueChange={(value) =>
                      handleInputChange("hasMedications", value)
                    }
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="medications-yes" />
                      <Label htmlFor="medications-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="medications-no" />
                      <Label htmlFor="medications-no">No</Label>
                    </div>
                  </RadioGroup>
                  {errors.hasMedications && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.hasMedications}
                    </p>
                  )}
                </div>

                {formData.hasMedications === "Yes" && (
                  <div>
                    <Label
                      htmlFor="medications"
                      className={errors.medications ? "text-destructive" : ""}
                    >
                      Please list all medications, including over-the-counter
                      medications and supplements:
                      <span className="text-destructive"> *</span>
                    </Label>
                    <Textarea
                      id="medications"
                      value={formData.medications}
                      onChange={(e) =>
                        handleInputChange("medications", e.target.value)
                      }
                      className="mt-2"
                      placeholder="Enter your medications here..."
                    />
                    {errors.medications && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.medications}
                      </p>
                    )}
                  </div>
                )}

                <Separator className="my-4" />

                <div>
                  <Label
                    htmlFor="hasAllergies"
                    className={errors.hasAllergies ? "text-destructive" : ""}
                  >
                    Do you have any medication allergies?
                    <span className="text-destructive"> *</span>
                  </Label>
                  <RadioGroup
                    value={formData.hasAllergies}
                    onValueChange={(value) =>
                      handleInputChange("hasAllergies", value)
                    }
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="allergies-yes" />
                      <Label htmlFor="allergies-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="allergies-no" />
                      <Label htmlFor="allergies-no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="Not sure"
                        id="allergies-not-sure"
                      />
                      <Label htmlFor="allergies-not-sure">Not sure</Label>
                    </div>
                  </RadioGroup>
                  {errors.hasAllergies && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.hasAllergies}
                    </p>
                  )}
                </div>

                {formData.hasAllergies === "Yes" && (
                  <div>
                    <Label
                      htmlFor="allergies"
                      className={errors.allergies ? "text-destructive" : ""}
                    >
                      Please list all medication allergies and your reactions:
                      <span className="text-destructive"> *</span>
                    </Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) =>
                        handleInputChange("allergies", e.target.value)
                      }
                      className="mt-2"
                      placeholder="Enter your allergies and reactions here..."
                    />
                    {errors.allergies && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.allergies}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {currentSection === 2 && (
            <>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="smokingStatus"
                    className={errors.smokingStatus ? "text-destructive" : ""}
                  >
                    Do you smoke or use tobacco products?
                    <span className="text-destructive"> *</span>
                  </Label>
                  <RadioGroup
                    value={formData.smokingStatus}
                    onValueChange={(value) =>
                      handleInputChange("smokingStatus", value)
                    }
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="Yes, currently"
                        id="smoking-current"
                      />
                      <Label htmlFor="smoking-current">Yes, currently</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="Previously, but quit"
                        id="smoking-quit"
                      />
                      <Label htmlFor="smoking-quit">Previously, but quit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Never" id="smoking-never" />
                      <Label htmlFor="smoking-never">Never</Label>
                    </div>
                  </RadioGroup>
                  {errors.smokingStatus && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.smokingStatus}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="alcoholConsumption"
                    className={
                      errors.alcoholConsumption ? "text-destructive" : ""
                    }
                  >
                    How often do you consume alcoholic beverages?
                    <span className="text-destructive"> *</span>
                  </Label>
                  <RadioGroup
                    value={formData.alcoholConsumption}
                    onValueChange={(value) =>
                      handleInputChange("alcoholConsumption", value)
                    }
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Daily" id="alcohol-daily" />
                      <Label htmlFor="alcohol-daily">Daily</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="Several times a week"
                        id="alcohol-weekly"
                      />
                      <Label htmlFor="alcohol-weekly">
                        Several times a week
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="Once a week"
                        id="alcohol-once-week"
                      />
                      <Label htmlFor="alcohol-once-week">Once a week</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="Occasionally"
                        id="alcohol-occasionally"
                      />
                      <Label htmlFor="alcohol-occasionally">Occasionally</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Never" id="alcohol-never" />
                      <Label htmlFor="alcohol-never">Never</Label>
                    </div>
                  </RadioGroup>
                  {errors.alcoholConsumption && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.alcoholConsumption}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="exerciseFrequency"
                    className={
                      errors.exerciseFrequency ? "text-destructive" : ""
                    }
                  >
                    How many days per week do you engage in moderate to vigorous
                    physical activity?
                    <span className="text-destructive"> *</span>
                  </Label>
                  <RadioGroup
                    value={formData.exerciseFrequency}
                    onValueChange={(value) =>
                      handleInputChange("exerciseFrequency", value)
                    }
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="exercise-0" />
                      <Label htmlFor="exercise-0">0</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-2" id="exercise-1-2" />
                      <Label htmlFor="exercise-1-2">1-2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3-4" id="exercise-3-4" />
                      <Label htmlFor="exercise-3-4">3-4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5+" id="exercise-5-plus" />
                      <Label htmlFor="exercise-5-plus">5+</Label>
                    </div>
                  </RadioGroup>
                  {errors.exerciseFrequency && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.exerciseFrequency}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="exerciseRoutine">
                    Please describe your typical exercise routine:
                  </Label>
                  <Textarea
                    id="exerciseRoutine"
                    value={formData.exerciseRoutine}
                    onChange={(e) =>
                      handleInputChange("exerciseRoutine", e.target.value)
                    }
                    className="mt-2"
                    placeholder="Enter your exercise routine here..."
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentSection === 0}
        >
          Back
        </Button>
        {currentSection < sections.length - 1 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button onClick={handleSubmit}>Submit</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default HealthQuestionnaire;
