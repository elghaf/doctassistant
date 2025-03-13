import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  FileText,
  Calendar,
  Activity,
  Clipboard,
  Download,
  Edit,
} from "lucide-react";

interface PatientDetailsProps {
  patient?: {
    id: string;
    name: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    address: string;
    medicalHistory: string[];
    allergies: string[];
    medications: string[];
    lastVisit: string;
    upcomingAppointment?: string;
  };
}

const PatientDetails: React.FC<PatientDetailsProps> = ({
  patient = {
    id: "P12345",
    name: "Jane Smith",
    age: 42,
    gender: "Female",
    email: "jane.smith@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
    medicalHistory: ["Hypertension", "Type 2 Diabetes", "Asthma"],
    allergies: ["Penicillin", "Peanuts"],
    medications: ["Lisinopril 10mg", "Metformin 500mg", "Albuterol inhaler"],
    lastVisit: "2023-10-15",
    upcomingAppointment: "2023-11-20 10:30 AM",
  },
}) => {
  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
          <p className="text-gray-500">Patient ID: {patient.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Age</dt>
                <dd>{patient.age} years</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                <dd>{patient.gender}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd>{patient.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd>{patient.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd>{patient.address}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Medical Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Allergies</dt>
                <dd>
                  <ul className="list-disc pl-5">
                    {patient.allergies.map((allergy, index) => (
                      <li key={index}>{allergy}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Medications
                </dt>
                <dd>
                  <ul className="list-disc pl-5">
                    {patient.medications.map((medication, index) => (
                      <li key={index}>{medication}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Appointment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Last Visit
                </dt>
                <dd>{new Date(patient.lastVisit).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Upcoming Appointment
                </dt>
                <dd>{patient.upcomingAppointment || "None scheduled"}</dd>
              </div>
            </dl>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="history">
            <FileText className="mr-2 h-4 w-4" />
            Medical History
          </TabsTrigger>
          <TabsTrigger value="questionnaires">
            <Clipboard className="mr-2 h-4 w-4" />
            Questionnaires
          </TabsTrigger>
          <TabsTrigger value="reports">
            <Activity className="mr-2 h-4 w-4" />
            Lab Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {patient.medicalHistory.map((condition, index) => (
                  <li key={index} className="p-3 bg-gray-50 rounded-md">
                    <div className="font-medium">{condition}</div>
                    <div className="text-sm text-gray-500">
                      Diagnosed: January 2022
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questionnaires" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Questionnaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Pre-Visit Questionnaire</h3>
                      <p className="text-sm text-gray-500">
                        Completed on October 10, 2023
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Health Assessment</h3>
                      <p className="text-sm text-gray-500">
                        Completed on September 5, 2023
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lab Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Blood Work Results</h3>
                      <p className="text-sm text-gray-500">October 15, 2023</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Report
                      </Button>
                      <Button variant="outline" size="sm">
                        Generate AI Summary
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Chest X-Ray</h3>
                      <p className="text-sm text-gray-500">August 22, 2023</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Report
                      </Button>
                      <Button variant="outline" size="sm">
                        Generate AI Summary
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetails;
