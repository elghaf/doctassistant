import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Activity,
  AlertCircle,
  Calendar,
  FileText,
  Pill,
  Plus,
  Stethoscope,
  Syringe,
} from "lucide-react";

interface MedicalCondition {
  id: string;
  name: string;
  diagnosedDate: string;
  status: "active" | "resolved" | "managed";
  notes: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  notes?: string;
}

interface Allergy {
  id: string;
  allergen: string;
  severity: "mild" | "moderate" | "severe";
  reaction: string;
  diagnosedDate: string;
}

interface Immunization {
  id: string;
  name: string;
  date: string;
  administeredBy: string;
  notes?: string;
}

interface SurgicalHistory {
  id: string;
  procedure: string;
  date: string;
  hospital: string;
  surgeon: string;
  notes?: string;
}

interface MedicalHistoryTabProps {
  patientId?: string;
  conditions?: MedicalCondition[];
  medications?: Medication[];
  allergies?: Allergy[];
  immunizations?: Immunization[];
  surgicalHistory?: SurgicalHistory[];
}

const MedicalHistoryTab: React.FC<MedicalHistoryTabProps> = ({
  patientId = "123",
  conditions = [
    {
      id: "1",
      name: "Hypertension",
      diagnosedDate: "2020-03-15",
      status: "managed" as const,
      notes:
        "Patient maintains blood pressure with medication and lifestyle changes.",
    },
    {
      id: "2",
      name: "Type 2 Diabetes",
      diagnosedDate: "2018-07-22",
      status: "active" as const,
      notes: "Regular monitoring required. A1C levels fluctuating.",
    },
    {
      id: "3",
      name: "Seasonal Allergies",
      diagnosedDate: "2015-05-10",
      status: "managed" as const,
      notes: "Worse during spring months. Responds well to antihistamines.",
    },
  ],
  medications = [
    {
      id: "1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      startDate: "2020-03-20",
      prescribedBy: "Dr. Sarah Johnson",
      notes: "For hypertension management",
    },
    {
      id: "2",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily with meals",
      startDate: "2018-08-05",
      prescribedBy: "Dr. Michael Chen",
      notes: "For diabetes management",
    },
    {
      id: "3",
      name: "Cetirizine",
      dosage: "10mg",
      frequency: "Once daily as needed",
      startDate: "2015-05-15",
      endDate: "",
      prescribedBy: "Dr. Sarah Johnson",
      notes: "For seasonal allergies",
    },
  ],
  allergies = [
    {
      id: "1",
      allergen: "Penicillin",
      severity: "severe" as const,
      reaction: "Hives, difficulty breathing",
      diagnosedDate: "2010-11-03",
    },
    {
      id: "2",
      allergen: "Shellfish",
      severity: "moderate" as const,
      reaction: "Skin rash, nausea",
      diagnosedDate: "2015-06-22",
    },
    {
      id: "3",
      allergen: "Pollen",
      severity: "mild" as const,
      reaction: "Sneezing, watery eyes",
      diagnosedDate: "2008-04-15",
    },
  ],
  immunizations = [
    {
      id: "1",
      name: "Influenza Vaccine",
      date: "2023-10-15",
      administeredBy: "Dr. Lisa Wong",
      notes: "Annual flu shot",
    },
    {
      id: "2",
      name: "COVID-19 Vaccine",
      date: "2021-04-10",
      administeredBy: "Community Vaccination Center",
      notes: "Pfizer-BioNTech, second dose",
    },
    {
      id: "3",
      name: "Tetanus Booster",
      date: "2019-08-22",
      administeredBy: "Dr. Sarah Johnson",
      notes: "10-year booster",
    },
  ],
  surgicalHistory = [
    {
      id: "1",
      procedure: "Appendectomy",
      date: "2012-06-18",
      hospital: "Memorial Hospital",
      surgeon: "Dr. Robert Garcia",
      notes: "Emergency procedure, no complications",
    },
    {
      id: "2",
      procedure: "Knee Arthroscopy",
      date: "2017-03-05",
      hospital: "Orthopedic Surgical Center",
      surgeon: "Dr. Jennifer Lee",
      notes: "Meniscus repair, right knee",
    },
  ],
}) => {
  return (
    <div className="w-full h-full bg-white p-6 rounded-lg">
      <Tabs defaultValue="conditions" className="w-full">
        <TabsList className="grid grid-cols-5 gap-2 mb-6">
          <TabsTrigger value="conditions" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span>Conditions</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span>Medications</span>
          </TabsTrigger>
          <TabsTrigger value="allergies" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Allergies</span>
          </TabsTrigger>
          <TabsTrigger
            value="immunizations"
            className="flex items-center gap-2"
          >
            <Syringe className="h-4 w-4" />
            <span>Immunizations</span>
          </TabsTrigger>
          <TabsTrigger value="surgical" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Surgical History</span>
          </TabsTrigger>
        </TabsList>

        {/* Conditions Tab */}
        <TabsContent value="conditions" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Medical Conditions</h3>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Condition</span>
            </Button>
          </div>

          <div className="space-y-4">
            {conditions.map((condition) => (
              <Card key={condition.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{condition.name}</CardTitle>
                      <CardDescription>
                        Diagnosed:{" "}
                        {new Date(condition.diagnosedDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        condition.status === "active"
                          ? "destructive"
                          : condition.status === "managed"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {condition.status.charAt(0).toUpperCase() +
                        condition.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{condition.notes}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Current Medications</h3>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Medication</span>
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {medications.map((medication) => (
              <AccordionItem key={medication.id} value={medication.id}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full pr-4">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-blue-500" />
                      <span>
                        {medication.name} - {medication.dosage}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {medication.frequency}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Started</p>
                      <p className="text-sm">
                        {new Date(medication.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    {medication.endDate && (
                      <div>
                        <p className="text-sm font-medium">Ended</p>
                        <p className="text-sm">
                          {new Date(medication.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">Prescribed By</p>
                      <p className="text-sm">{medication.prescribedBy}</p>
                    </div>
                    {medication.notes && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium">Notes</p>
                        <p className="text-sm">{medication.notes}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        {/* Allergies Tab */}
        <TabsContent value="allergies" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Allergies</h3>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Allergy</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allergies.map((allergy) => (
              <Card key={allergy.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{allergy.allergen}</CardTitle>
                    <Badge
                      variant={
                        allergy.severity === "severe"
                          ? "destructive"
                          : allergy.severity === "moderate"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {allergy.severity.charAt(0).toUpperCase() +
                        allergy.severity.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    <span className="font-medium">Reaction:</span>{" "}
                    {allergy.reaction}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Diagnosed:</span>{" "}
                    {new Date(allergy.diagnosedDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Immunizations Tab */}
        <TabsContent value="immunizations" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Immunization Records</h3>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Immunization</span>
            </Button>
          </div>

          <div className="space-y-4">
            {immunizations.map((immunization) => (
              <Card key={immunization.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{immunization.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <CardDescription>
                          {new Date(immunization.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    <span className="font-medium">Administered By:</span>{" "}
                    {immunization.administeredBy}
                  </p>
                  {immunization.notes && (
                    <p className="text-sm mt-2">{immunization.notes}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Surgical History Tab */}
        <TabsContent value="surgical" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Surgical History</h3>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Procedure</span>
            </Button>
          </div>

          <div className="space-y-4">
            {surgicalHistory.map((surgery) => (
              <Card key={surgery.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{surgery.procedure}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <CardDescription>
                          {new Date(surgery.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm">
                      <span className="font-medium">Hospital:</span>{" "}
                      {surgery.hospital}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Surgeon:</span>{" "}
                      {surgery.surgeon}
                    </p>
                    {surgery.notes && (
                      <p className="text-sm col-span-2 mt-2">{surgery.notes}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalHistoryTab;
