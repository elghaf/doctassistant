import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarClock,
  ClipboardList,
  FileText,
  MessageSquare,
  User,
  Stethoscope,
} from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Medical Office Portal
          </h1>
          <div className="space-x-2">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/login?tab=register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Streamlined Healthcare Management
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive platform for patients and healthcare providers to
            manage appointments, medical records, and communications.
          </p>
        </section>

        <section className="mb-16">
          <Tabs defaultValue="patients" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="patients" className="text-lg py-3">
                For Patients
              </TabsTrigger>
              <TabsTrigger value="doctors" className="text-lg py-3">
                For Doctors
              </TabsTrigger>
            </TabsList>
            <TabsContent value="patients" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <FeatureCard
                  icon={<CalendarClock className="h-8 w-8 text-blue-500" />}
                  title="Easy Appointment Scheduling"
                  description="Book, reschedule, or cancel appointments with your healthcare providers online."
                />
                <FeatureCard
                  icon={<FileText className="h-8 w-8 text-green-500" />}
                  title="Access Medical Records"
                  description="View your medical reports, lab results, and treatment history securely."
                />
                <FeatureCard
                  icon={<ClipboardList className="h-8 w-8 text-purple-500" />}
                  title="Health Questionnaires"
                  description="Complete health assessments online before your appointments."
                />
                <FeatureCard
                  icon={<MessageSquare className="h-8 w-8 text-yellow-500" />}
                  title="Secure Messaging"
                  description="Communicate directly with your healthcare team through encrypted messaging."
                />
                <FeatureCard
                  icon={<User className="h-8 w-8 text-indigo-500" />}
                  title="Personal Health Dashboard"
                  description="Track your health metrics and upcoming appointments in one place."
                />
                <FeatureCard
                  icon={<Stethoscope className="h-8 w-8 text-red-500" />}
                  title="AI-Powered Health Insights"
                  description="Receive simplified explanations of your medical reports and test results."
                />
              </div>
              <div className="text-center mt-8">
                <Link to="/login?tab=register&role=patient">
                  <Button size="lg" className="text-lg px-8">
                    Register as a Patient
                  </Button>
                </Link>
              </div>
            </TabsContent>
            <TabsContent value="doctors" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <FeatureCard
                  icon={<CalendarClock className="h-8 w-8 text-blue-500" />}
                  title="Efficient Schedule Management"
                  description="Manage your availability and patient appointments with ease."
                />
                <FeatureCard
                  icon={<FileText className="h-8 w-8 text-green-500" />}
                  title="Digital Medical Records"
                  description="Create, update, and access patient medical records securely."
                />
                <FeatureCard
                  icon={<ClipboardList className="h-8 w-8 text-purple-500" />}
                  title="Customizable Questionnaires"
                  description="Design and send health questionnaires to patients before appointments."
                />
                <FeatureCard
                  icon={<MessageSquare className="h-8 w-8 text-yellow-500" />}
                  title="Patient Communication"
                  description="Securely message patients and respond to their inquiries."
                />
                <FeatureCard
                  icon={<User className="h-8 w-8 text-indigo-500" />}
                  title="Patient Management"
                  description="View comprehensive patient profiles and treatment histories."
                />
                <FeatureCard
                  icon={<Stethoscope className="h-8 w-8 text-red-500" />}
                  title="AI Diagnostic Assistance"
                  description="Get AI-powered insights to support your diagnostic process."
                />
              </div>
              <div className="text-center mt-8">
                <Link to="/login?tab=register&role=doctor">
                  <Button size="lg" className="text-lg px-8">
                    Register as a Doctor
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="bg-blue-50 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of patients and healthcare providers who are already
            using our platform to streamline healthcare management.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/login">
              <Button variant="outline" size="lg">
                Login
              </Button>
            </Link>
            <Link to="/login?tab=register">
              <Button size="lg">Create Account</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-gray-500 text-sm">
                &copy; 2024 Medical Office Portal. All rights reserved.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex justify-center md:justify-end space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  Terms
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  Privacy
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default HomePage;
