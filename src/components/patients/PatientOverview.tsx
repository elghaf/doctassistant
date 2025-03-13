import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Clock,
  FileText,
  Heart,
  Activity,
  AlertCircle,
  Pill,
  ChevronRight,
} from "lucide-react";

interface PatientVitalProps {
  title: string;
  value: string;
  unit?: string;
  status?: "normal" | "warning" | "critical";
  icon?: React.ReactNode;
}

const PatientVital = ({
  title,
  value,
  unit,
  status = "normal",
  icon,
}: PatientVitalProps) => {
  const statusColors = {
    normal: "bg-green-50 text-green-700",
    warning: "bg-amber-50 text-amber-700",
    critical: "bg-red-50 text-red-700",
  };

  return (
    <div className="flex items-start p-4 rounded-lg border bg-card">
      <div className={`p-2 rounded-full ${statusColors[status]} mr-3`}>
        {icon || <Activity size={18} />}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xl font-semibold">
          {value} {unit && <span className="text-sm font-normal">{unit}</span>}
        </p>
      </div>
    </div>
  );
};

interface RecentVisitProps {
  date: string;
  reason: string;
  doctor: string;
  notes?: string;
}

const RecentVisit = ({ date, reason, doctor, notes }: RecentVisitProps) => {
  return (
    <Card className="mb-3">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{reason}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <CalendarDays size={14} className="mr-1" />
              {date}
            </CardDescription>
          </div>
          <Badge variant="outline">{doctor}</Badge>
        </div>
      </CardHeader>
      {notes && (
        <CardContent className="pt-0 pb-3">
          <p className="text-sm text-muted-foreground">{notes}</p>
        </CardContent>
      )}
    </Card>
  );
};

interface MedicationProps {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
}

const Medication = ({
  name,
  dosage,
  frequency,
  startDate,
  endDate,
}: MedicationProps) => {
  return (
    <div className="p-3 border rounded-lg mb-3 bg-card">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="p-2 rounded-full bg-blue-50 text-blue-700 mr-3">
            <Pill size={16} />
          </div>
          <div>
            <h4 className="font-medium">{name}</h4>
            <p className="text-sm text-muted-foreground">
              {dosage} - {frequency}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {endDate ? "Until " + endDate : "Ongoing"}
        </Badge>
      </div>
      <div className="mt-2 text-xs text-muted-foreground flex items-center">
        <CalendarDays size={12} className="mr-1" />
        Started: {startDate}
      </div>
    </div>
  );
};

interface PatientOverviewProps {
  patientId?: string;
  patient?: {
    name: string;
    age: number;
    gender: string;
    bloodType: string;
    allergies: string[];
    vitals: {
      heartRate: number;
      bloodPressure: string;
      temperature: number;
      oxygenSaturation: number;
    };
    recentVisits: RecentVisitProps[];
    medications: MedicationProps[];
    conditions: string[];
  };
}

const PatientOverview = ({ patientId, patient }: PatientOverviewProps) => {
  // Default data if no patient is provided
  const defaultPatient = {
    name: "Jane Doe",
    age: 42,
    gender: "Female",
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts"],
    vitals: {
      heartRate: 72,
      bloodPressure: "120/80",
      temperature: 98.6,
      oxygenSaturation: 98,
    },
    recentVisits: [
      {
        date: "May 15, 2023",
        reason: "Annual Physical Examination",
        doctor: "Dr. Smith",
        notes:
          "Patient is in good health. Recommended regular exercise and balanced diet.",
      },
      {
        date: "Feb 3, 2023",
        reason: "Flu Symptoms",
        doctor: "Dr. Johnson",
        notes: "Prescribed antivirals and recommended rest for 3-5 days.",
      },
    ],
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        startDate: "Jan 10, 2023",
      },
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        startDate: "Mar 5, 2022",
        endDate: "Jun 30, 2023",
      },
    ],
    conditions: ["Hypertension", "Type 2 Diabetes", "Osteoarthritis"],
  };

  const data = patient || defaultPatient;

  return (
    <div className="bg-white p-6 rounded-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Current Health Status</h2>

          {/* Vitals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <PatientVital
              title="Heart Rate"
              value={data.vitals.heartRate.toString()}
              unit="bpm"
              icon={<Heart size={18} />}
            />
            <PatientVital
              title="Blood Pressure"
              value={data.vitals.bloodPressure}
              status="warning"
              icon={<Activity size={18} />}
            />
            <PatientVital
              title="Temperature"
              value={data.vitals.temperature.toString()}
              unit="°F"
              icon={<AlertCircle size={18} />}
            />
            <PatientVital
              title="Oxygen Saturation"
              value={data.vitals.oxygenSaturation.toString()}
              unit="%"
              icon={<Activity size={18} />}
            />
          </div>

          {/* Medical Conditions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Medical Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.conditions.map((condition, index) => (
                  <Badge key={index} variant="secondary">
                    {condition}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Allergies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Allergies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div>
          <Tabs defaultValue="visits" className="w-full">
            <TabsList className="w-full mb-2">
              <TabsTrigger value="visits" className="flex-1">
                Recent Visits
              </TabsTrigger>
              <TabsTrigger value="medications" className="flex-1">
                Medications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visits" className="space-y-4">
              {data.recentVisits.map((visit, index) => (
                <RecentVisit key={index} {...visit} />
              ))}
              <Button variant="outline" className="w-full mt-2">
                View All Visit History{" "}
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </TabsContent>

            <TabsContent value="medications" className="space-y-4">
              {data.medications.map((medication, index) => (
                <Medication key={index} {...medication} />
              ))}
              <Button variant="outline" className="w-full mt-2">
                View All Medications <ChevronRight size={16} className="ml-1" />
              </Button>
            </TabsContent>
          </Tabs>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start">
                <FileText size={16} className="mr-2" /> Generate Report
              </Button>
              <Button variant="outline" className="justify-start">
                <Clock size={16} className="mr-2" /> Schedule Appointment
              </Button>
              <Button variant="outline" className="justify-start">
                <Activity size={16} className="mr-2" /> Update Vitals
              </Button>
              <Button variant="outline" className="justify-start">
                <Pill size={16} className="mr-2" /> Add Medication
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientOverview;
