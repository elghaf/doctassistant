import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  FileText,
  RefreshCw,
  Stethoscope,
  Activity,
  Pill,
  Clipboard,
  Save,
  Download,
  Share2,
  PlusCircle,
  CheckCircle,
  XCircle,
  HelpCircle,
} from "lucide-react";

interface Symptom {
  id: string;
  name: string;
  severity: "mild" | "moderate" | "severe";
  duration: string;
  notes?: string;
}

interface Diagnosis {
  id: string;
  name: string;
  probability: number; // 0-100
  description: string;
  symptoms: string[];
  treatments: string[];
  icdCode?: string;
}

interface MedicalDiagnosticsProps {
  patientId?: string;
  patientName?: string;
  onSaveDiagnosis?: (diagnosis: Diagnosis) => void;
}

const MedicalDiagnostics: React.FC<MedicalDiagnosticsProps> = ({
  patientId = "P12345",
  patientName = "John Doe",
  onSaveDiagnosis = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("symptoms");
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [newSymptom, setNewSymptom] = useState({
    name: "",
    severity: "moderate" as const,
    duration: "",
    notes: "",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(
    null,
  );

  const handleAddSymptom = () => {
    if (!newSymptom.name.trim() || !newSymptom.duration.trim()) return;

    const symptom: Symptom = {
      id: Date.now().toString(),
      ...newSymptom,
    };

    setSymptoms([...symptoms, symptom]);
    setNewSymptom({
      name: "",
      severity: "moderate",
      duration: "",
      notes: "",
    });
  };

  const handleRemoveSymptom = (id: string) => {
    setSymptoms(symptoms.filter((s) => s.id !== id));
  };

  const handleAnalyzeSymptoms = () => {
    if (symptoms.length === 0) return;

    setIsAnalyzing(true);
    setActiveTab("analysis");

    // Simulate API call to AI diagnostic service
    setTimeout(() => {
      const mockDiagnoses: Diagnosis[] = [
        {
          id: "d1",
          name: "Upper Respiratory Infection",
          probability: 85,
          description:
            "An infection of the upper respiratory tract, including the nose, throat, sinuses, and larynx. Most commonly caused by viruses.",
          symptoms: ["Sore throat", "Nasal congestion", "Cough", "Mild fever"],
          treatments: [
            "Rest and hydration",
            "Over-the-counter pain relievers",
            "Saline nasal spray",
            "Throat lozenges",
          ],
          icdCode: "J06.9",
        },
        {
          id: "d2",
          name: "Seasonal Allergies",
          probability: 65,
          description:
            "An allergic reaction to seasonal environmental triggers like pollen, causing inflammation of the nasal passages.",
          symptoms: [
            "Nasal congestion",
            "Sneezing",
            "Itchy eyes",
            "Runny nose",
          ],
          treatments: [
            "Antihistamines",
            "Nasal corticosteroids",
            "Avoiding allergens",
            "Saline nasal irrigation",
          ],
          icdCode: "J30.1",
        },
        {
          id: "d3",
          name: "Acute Bronchitis",
          probability: 45,
          description:
            "Inflammation of the bronchial tubes, usually following a respiratory infection. Often viral in origin.",
          symptoms: [
            "Persistent cough",
            "Chest discomfort",
            "Fatigue",
            "Low-grade fever",
          ],
          treatments: [
            "Rest",
            "Increased fluid intake",
            "Humidifier use",
            "Bronchodilators if needed",
          ],
          icdCode: "J20.9",
        },
      ];

      setDiagnoses(mockDiagnoses);
      setSelectedDiagnosis(mockDiagnoses[0]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleSaveDiagnosis = () => {
    if (selectedDiagnosis) {
      onSaveDiagnosis(selectedDiagnosis);
      // In a real app, you would save to database here
      alert("Diagnosis saved to patient record");
    }
  };

  const getSeverityColor = (severity: Symptom["severity"]) => {
    switch (severity) {
      case "mild":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "severe":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return "text-green-600";
    if (probability >= 60) return "text-yellow-600";
    return "text-gray-600";
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Stethoscope className="h-6 w-6 mr-2 text-primary" />
              AI Medical Diagnostics
            </h1>
            <p className="text-gray-500">
              Patient: {patientName} (ID: {patientId})
            </p>
          </div>
          <Badge variant="outline" className="text-primary">
            AI-Powered
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="symptoms">
              <Clipboard className="h-4 w-4 mr-2" />
              Symptoms Entry
            </TabsTrigger>
            <TabsTrigger value="analysis" disabled={symptoms.length === 0}>
              <Activity className="h-4 w-4 mr-2" />
              Diagnostic Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="symptoms" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Enter Patient Symptoms</CardTitle>
                  <CardDescription>
                    Add all symptoms the patient is experiencing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="symptom-name">Symptom</Label>
                        <Input
                          id="symptom-name"
                          placeholder="e.g. Headache, Fever, Cough"
                          value={newSymptom.name}
                          onChange={(e) =>
                            setNewSymptom({
                              ...newSymptom,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="symptom-duration">Duration</Label>
                        <Input
                          id="symptom-duration"
                          placeholder="e.g. 3 days, 1 week"
                          value={newSymptom.duration}
                          onChange={(e) =>
                            setNewSymptom({
                              ...newSymptom,
                              duration: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Severity</Label>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant={
                            newSymptom.severity === "mild"
                              ? "default"
                              : "outline"
                          }
                          className="flex-1"
                          onClick={() =>
                            setNewSymptom({ ...newSymptom, severity: "mild" })
                          }
                        >
                          Mild
                        </Button>
                        <Button
                          type="button"
                          variant={
                            newSymptom.severity === "moderate"
                              ? "default"
                              : "outline"
                          }
                          className="flex-1"
                          onClick={() =>
                            setNewSymptom({
                              ...newSymptom,
                              severity: "moderate",
                            })
                          }
                        >
                          Moderate
                        </Button>
                        <Button
                          type="button"
                          variant={
                            newSymptom.severity === "severe"
                              ? "default"
                              : "outline"
                          }
                          className="flex-1"
                          onClick={() =>
                            setNewSymptom({ ...newSymptom, severity: "severe" })
                          }
                        >
                          Severe
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="symptom-notes">Additional Notes</Label>
                      <Textarea
                        id="symptom-notes"
                        placeholder="Any additional details about this symptom"
                        value={newSymptom.notes}
                        onChange={(e) =>
                          setNewSymptom({
                            ...newSymptom,
                            notes: e.target.value,
                          })
                        }
                      />
                    </div>

                    <Button
                      onClick={handleAddSymptom}
                      disabled={
                        !newSymptom.name.trim() || !newSymptom.duration.trim()
                      }
                      className="w-full"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Symptom
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Symptom List</CardTitle>
                  <CardDescription>
                    {symptoms.length === 0
                      ? "No symptoms added yet"
                      : `${symptoms.length} symptom(s) recorded`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {symptoms.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clipboard className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>Add symptoms using the form</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-2">
                        {symptoms.map((symptom) => (
                          <div
                            key={symptom.id}
                            className="p-3 border rounded-md relative pr-8"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{symptom.name}</h4>
                                <p className="text-sm text-gray-500">
                                  Duration: {symptom.duration}
                                </p>
                              </div>
                              <Badge
                                className={getSeverityColor(symptom.severity)}
                              >
                                {symptom.severity}
                              </Badge>
                            </div>
                            {symptom.notes && (
                              <p className="text-sm mt-2">{symptom.notes}</p>
                            )}
                            <button
                              className="absolute top-3 right-2 text-gray-400 hover:text-red-500"
                              onClick={() => handleRemoveSymptom(symptom.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleAnalyzeSymptoms}
                    disabled={symptoms.length === 0}
                    className="w-full"
                  >
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Analyze Symptoms
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="pt-6">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  Analyzing Patient Symptoms
                </h3>
                <p className="text-gray-500 max-w-md text-center">
                  Our AI is analyzing the symptoms and comparing them with
                  millions of medical cases to provide the most accurate
                  diagnostic suggestions.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Diagnostic Results</CardTitle>
                    <CardDescription>
                      Possible diagnoses based on symptoms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-2">
                        {diagnoses.map((diagnosis) => (
                          <div
                            key={diagnosis.id}
                            className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedDiagnosis?.id === diagnosis.id ? "bg-primary/10 border-primary" : "hover:bg-gray-50"}`}
                            onClick={() => setSelectedDiagnosis(diagnosis)}
                          >
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">{diagnosis.name}</h4>
                              <span
                                className={`font-medium ${getProbabilityColor(diagnosis.probability)}`}
                              >
                                {diagnosis.probability}%
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              ICD-10: {diagnosis.icdCode}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  {selectedDiagnosis ? (
                    <>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{selectedDiagnosis.name}</CardTitle>
                            <CardDescription>
                              ICD-10: {selectedDiagnosis.icdCode} | Probability:{" "}
                              <span
                                className={getProbabilityColor(
                                  selectedDiagnosis.probability,
                                )}
                              >
                                {selectedDiagnosis.probability}%
                              </span>
                            </CardDescription>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${selectedDiagnosis.probability >= 80 ? "bg-green-100 text-green-800" : selectedDiagnosis.probability >= 60 ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {selectedDiagnosis.probability >= 80
                              ? "High Confidence"
                              : selectedDiagnosis.probability >= 60
                                ? "Moderate Confidence"
                                : "Low Confidence"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-2 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-primary" />
                            Description
                          </h3>
                          <p className="text-gray-700">
                            {selectedDiagnosis.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium mb-2 flex items-center">
                              <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                              Associated Symptoms
                            </h3>
                            <ul className="list-disc pl-5 space-y-1">
                              {selectedDiagnosis.symptoms.map(
                                (symptom, index) => (
                                  <li key={index} className="text-gray-700">
                                    {symptom}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium mb-2 flex items-center">
                              <Pill className="h-5 w-5 mr-2 text-blue-500" />
                              Recommended Treatments
                            </h3>
                            <ul className="list-disc pl-5 space-y-1">
                              {selectedDiagnosis.treatments.map(
                                (treatment, index) => (
                                  <li key={index} className="text-gray-700">
                                    {treatment}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-md">
                          <div className="flex items-start">
                            <HelpCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-amber-800">
                                Important Note
                              </h4>
                              <p className="text-amber-700 text-sm">
                                This is an AI-generated diagnostic suggestion
                                and should not replace professional medical
                                judgment. Always consult with healthcare
                                providers for definitive diagnosis and treatment
                                plans.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                        <Button onClick={handleSaveDiagnosis}>
                          <Save className="h-4 w-4 mr-2" />
                          Save to Patient Record
                        </Button>
                      </CardFooter>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <FileText className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-xl font-medium mb-2">
                        No Diagnosis Selected
                      </h3>
                      <p className="text-gray-500 max-w-md text-center">
                        Select a diagnosis from the list to view detailed
                        information and treatment recommendations.
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MedicalDiagnostics;
