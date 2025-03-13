import React, { useState } from "react";
import { PlusCircle, X, AlertCircle, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Symptom {
  id: string;
  name: string;
  severity: number;
  duration: string;
  notes?: string;
}

interface SymptomsFormProps {
  patientId?: string;
  onSave?: (symptoms: Symptom[]) => void;
  onBack?: () => void;
  onNext?: () => void;
  initialSymptoms?: Symptom[];
}

const SymptomsForm: React.FC<SymptomsFormProps> = ({
  patientId = "",
  onSave = () => {},
  onBack = () => {},
  onNext = () => {},
  initialSymptoms = [],
}) => {
  const [symptoms, setSymptoms] = useState<Symptom[]>(
    initialSymptoms.length > 0 ? initialSymptoms : [],
  );
  const [newSymptom, setNewSymptom] = useState("");
  const [currentSymptom, setCurrentSymptom] = useState<Symptom | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddSymptom = () => {
    if (newSymptom.trim() === "") return;

    const symptom: Symptom = {
      id: Date.now().toString(),
      name: newSymptom,
      severity: 5,
      duration: "",
      notes: "",
    };

    setSymptoms([...symptoms, symptom]);
    setNewSymptom("");
    setCurrentSymptom(symptom);
    setIsEditing(true);
  };

  const handleRemoveSymptom = (id: string) => {
    setSymptoms(symptoms.filter((s) => s.id !== id));
    if (currentSymptom?.id === id) {
      setCurrentSymptom(null);
      setIsEditing(false);
    }
  };

  const handleEditSymptom = (symptom: Symptom) => {
    setCurrentSymptom(symptom);
    setIsEditing(true);
  };

  const handleUpdateSymptom = (updatedSymptom: Partial<Symptom>) => {
    if (!currentSymptom) return;

    const updated = {
      ...currentSymptom,
      ...updatedSymptom,
    };

    setSymptoms(
      symptoms.map((s) => (s.id === currentSymptom.id ? updated : s)),
    );
    setCurrentSymptom(updated);
  };

  const handleSave = async () => {
    try {
      // If patientId is provided, save symptoms to the database
      if (patientId) {
        const { supabase } = await import("@/lib/supabase");

        // Save symptoms using the edge function
        const { data, error } = await supabase.functions.invoke(
          "supabase-functions-save-symptoms",
          {
            body: {
              patientId,
              symptoms,
            },
          },
        );

        if (error) throw error;
      }

      // Call the onSave callback with the symptoms data
      onSave(symptoms);
      if (onNext) onNext();
    } catch (error) {
      console.error("Error saving symptoms:", error);
      // You could add error handling UI here
    }
  };

  const getSeverityLabel = (severity: number) => {
    if (severity <= 3) return "Mild";
    if (severity <= 6) return "Moderate";
    return "Severe";
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return "bg-green-100 text-green-800";
    if (severity <= 6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Current Symptoms</h2>
        <p className="text-gray-500">
          Record the patient's current symptoms, their severity, and duration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Symptom List */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Symptoms List</CardTitle>
              <CardDescription>Add and manage patient symptoms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Input
                  placeholder="Enter symptom"
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddSymptom();
                  }}
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={handleAddSymptom}
                  disabled={newSymptom.trim() === ""}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {symptoms.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No symptoms added yet</p>
                    <p className="text-sm">
                      Add symptoms using the field above
                    </p>
                  </div>
                ) : (
                  symptoms.map((symptom) => (
                    <div
                      key={symptom.id}
                      className={`p-3 border rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors ${currentSymptom?.id === symptom.id ? "border-primary bg-primary/5" : ""}`}
                      onClick={() => handleEditSymptom(symptom)}
                    >
                      <div>
                        <p className="font-medium">{symptom.name}</p>
                        {symptom.duration && (
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{symptom.duration}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className={getSeverityColor(symptom.severity)}
                        >
                          {getSeverityLabel(symptom.severity)}
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSymptom(symptom.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Symptom Details */}
        <div className="md:col-span-2">
          {isEditing && currentSymptom ? (
            <Card>
              <CardHeader>
                <CardTitle>Symptom Details</CardTitle>
                <CardDescription>
                  Provide more information about {currentSymptom.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity (1-10)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                      id="severity"
                      min={1}
                      max={10}
                      step={1}
                      value={[currentSymptom.severity]}
                      onValueChange={(value) =>
                        handleUpdateSymptom({ severity: value[0] })
                      }
                      className="flex-1"
                    />
                    <Badge
                      variant="outline"
                      className={getSeverityColor(currentSymptom.severity)}
                    >
                      {currentSymptom.severity} -{" "}
                      {getSeverityLabel(currentSymptom.severity)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Select
                        value={currentSymptom.duration}
                        onValueChange={(value) =>
                          handleUpdateSymptom({ duration: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Less than a day">
                            Less than a day
                          </SelectItem>
                          <SelectItem value="1 day">1 day</SelectItem>
                          <SelectItem value="2-3 days">2-3 days</SelectItem>
                          <SelectItem value="4-7 days">4-7 days</SelectItem>
                          <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                          <SelectItem value="More than 2 weeks">
                            More than 2 weeks
                          </SelectItem>
                          <SelectItem value="Chronic (months/years)">
                            Chronic (months/years)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Input
                        placeholder="Or specify exact duration"
                        value={
                          ![
                            "Less than a day",
                            "1 day",
                            "2-3 days",
                            "4-7 days",
                            "1-2 weeks",
                            "More than 2 weeks",
                            "Chronic (months/years)",
                          ].includes(currentSymptom.duration)
                            ? currentSymptom.duration
                            : ""
                        }
                        onChange={(e) =>
                          handleUpdateSymptom({ duration: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <RadioGroup
                    defaultValue="intermittent"
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="constant" id="constant" />
                      <Label htmlFor="constant">Constant</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intermittent" id="intermittent" />
                      <Label htmlFor="intermittent">Intermittent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="worsening" id="worsening" />
                      <Label htmlFor="worsening">Worsening</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="improving" id="improving" />
                      <Label htmlFor="improving">Improving</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any additional details about this symptom"
                    value={currentSymptom.notes || ""}
                    onChange={(e) =>
                      handleUpdateSymptom({ notes: e.target.value })
                    }
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed rounded-lg p-6">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">
                  No symptom selected
                </h3>
                <p className="text-gray-500 mb-4">
                  Select a symptom from the list or add a new one to provide
                  detailed information
                </p>
                <div className="flex items-center space-x-2 justify-center">
                  <Input
                    placeholder="Enter symptom"
                    value={newSymptom}
                    onChange={(e) => setNewSymptom(e.target.value)}
                    className="max-w-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddSymptom();
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddSymptom}
                    disabled={newSymptom.trim() === ""}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleSave}>
          Save and Continue
        </Button>
      </div>
    </div>
  );
};

export default SymptomsForm;
