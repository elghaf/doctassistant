import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, PencilIcon, Shield, Bell, Clock, FileText } from "lucide-react";
import { database } from '@/lib/database';
import { useAuth } from '@clerk/clerk-react';
import { Patient } from '@/lib/database';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  emergencyContact: z
    .string()
    .min(2, { message: "Emergency contact name is required." }),
  emergencyPhone: z
    .string()
    .min(10, { message: "Please enter a valid emergency contact number." }),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const PatientProfile = () => {
  const { userId } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<Patient>();

  useEffect(() => {
    if (userId) {
      loadPatientData();
    }
  }, [userId]);

  const loadPatientData = async () => {
    try {
      const data = await database.patients.getPatient(userId!);
      setPatient(data);
      form.reset(data);
    } catch (error) {
      console.error('Error loading patient data:', error);
    }
  };

  const onSubmit = async (data: Patient) => {
    try {
      await database.patients.updatePatient(patient!.id, data);
      setIsEditing(false);
      loadPatientData();
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Summary Card */}
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={patient.avatar} alt={patient.name} />
                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-2xl">{patient.name}</CardTitle>
                  <CardDescription className="text-center mt-1">
                    Patient ID: {patient.id}
                    <br />
                    DOB: {patient.dateOfBirth}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                  className="mt-2"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm">Insurance</h3>
                  <p className="text-sm text-muted-foreground">
                    {patient.insuranceProvider}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Policy #: {patient.insuranceNumber}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Allergies</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {patient.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-sm">Current Medications</h3>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    {patient.medications.map((med, index) => (
                      <li key={index}>
                        {med.name} ({med.dosage}) - {med.frequency}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="md:w-2/3">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>
                  Update your personal information and emergency contacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="jane.smith@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 Main St, Anytown, CA 94321"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="emergencyContact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="emergencyPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emergency Contact Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 987-6543" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description of your medical history, lifestyle, etc."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">
                  <User className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="appointments">
                  <Clock className="h-4 w-4 mr-2" />
                  Appointments
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Shield className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium">Email</h3>
                        <p className="text-sm text-muted-foreground">
                          {patient.email}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Phone</h3>
                        <p className="text-sm text-muted-foreground">
                          {patient.phone}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Address</h3>
                        <p className="text-sm text-muted-foreground">
                          {patient.address}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">
                          Emergency Contact
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {patient.emergencyContact} ({patient.emergencyPhone})
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Medical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">Notes</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {patient.bio}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium">Conditions</h3>
                        <div className="mt-2">
                          {patient.medicalHistory.map((item, index) => (
                            <div
                              key={index}
                              className="mb-3 border-b pb-3 last:border-0"
                            >
                              <div className="flex justify-between">
                                <span className="font-medium">
                                  {item.condition}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  Diagnosed: {item.diagnosedDate}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.notes}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appointments" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.upcomingAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {patient.upcomingAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex justify-between items-center p-4 border rounded-lg"
                          >
                            <div>
                              <h3 className="font-medium">
                                {appointment.purpose}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {appointment.doctor}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{appointment.date}</p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No upcoming appointments scheduled.
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Schedule New Appointment</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Past Appointments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patient.pastAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {patient.pastAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="p-4 border rounded-lg"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">
                                  {appointment.purpose}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.doctor}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  {appointment.date}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.time}
                                </p>
                              </div>
                            </div>
                            {appointment.notes && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-sm">
                                  <span className="font-medium">Notes: </span>
                                  {appointment.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No past appointments found.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Documents</CardTitle>
                    <CardDescription>
                      Access your medical records, lab results, and other
                      documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {patient.documents.map((document) => (
                        <div
                          key={document.id}
                          className="flex justify-between items-center p-4 border rounded-lg"
                        >
                          <div>
                            <h3 className="font-medium">{document.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {document.type}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              {document.date}
                            </span>
                            <Button variant="outline" size="sm" asChild>
                              <a href={document.url}>View</a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Upload New Document
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Manage how you receive appointment reminders and updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          <span>Email Notifications</span>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            id="email-notifications"
                            aria-describedby="email-notifications-description"
                            name="email-notifications"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          <span>SMS Notifications</span>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            id="sms-notifications"
                            aria-describedby="sms-notifications-description"
                            name="sms-notifications"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          <span>Appointment Reminders</span>
                        </div>
                        <div className="flex items-center h-5">
                          <input
                            id="appointment-reminders"
                            aria-describedby="appointment-reminders-description"
                            name="appointment-reminders"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            defaultChecked
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Save Preferences</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>
                      Manage your password and account security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full">
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full">
                        Enable Two-Factor Authentication
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
