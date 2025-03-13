import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  Users,
  Activity,
  TrendingUp,
  Calendar,
} from "lucide-react";

import AppointmentsSection from "./AppointmentsSection";
import QuickActionsSection from "./QuickActionsSection";
import PatientSummarySection from "./PatientSummarySection";
import WorkflowStatusCard from "./WorkflowStatusCard";

interface DashboardContentProps {
  onAddPatient?: () => void;
  onGenerateReport?: () => void;
  onScheduleAppointment?: () => void;
  onManageData?: () => void;
  onAISummary?: () => void;
  onViewAllPatients?: () => void;
  onViewAllAppointments?: () => void;
  onViewPatient?: (id: string) => void;
  onViewAppointment?: (id: string) => void;
  onViewAllWorkflows?: () => void;
}

const DashboardContent = ({
  onAddPatient = () => {},
  onGenerateReport = () => {},
  onScheduleAppointment = () => {},
  onManageData = () => {},
  onAISummary = () => {},
  onViewAllPatients = () => {},
  onViewAllAppointments = () => {},
  onViewPatient = () => {},
  onViewAppointment = () => {},
  onViewAllWorkflows = () => {},
}: DashboardContentProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for statistics
  const statistics = [
    {
      title: "Total Patients",
      value: "0",
      change: "0%",
      trend: "up",
      period: "from last month",
      icon: <Users className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Appointments",
      value: "0",
      change: "0%",
      trend: "up",
      period: "this week",
      icon: <Calendar className="h-5 w-5 text-purple-500" />,
    },
    {
      title: "Reports Generated",
      value: "0",
      change: "0%",
      trend: "up",
      period: "this month",
      icon: <Activity className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Patient Satisfaction",
      value: "0%",
      change: "0%",
      trend: "up",
      period: "from last quarter",
      icon: <TrendingUp className="h-5 w-5 text-amber-500" />,
    },
  ];

  return (
    <div className="w-full h-full bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statistics.map((stat, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    <div className="flex items-center mt-1">
                      <span
                        className={`text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        {stat.period}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-gray-50">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Patient Summary */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <PatientSummarySection
              onViewAll={onViewAllPatients}
              onViewPatient={onViewPatient}
              onAddPatient={onAddPatient}
            />

            <WorkflowStatusCard onViewAll={onViewAllWorkflows} />
          </div>

          {/* Right Column - Appointments */}
          <div>
            <AppointmentsSection
              onViewAll={onViewAllAppointments}
              onViewAppointment={onViewAppointment}
              onScheduleAppointment={onScheduleAppointment}
            />
          </div>
        </div>

        {/* Quick Actions Section */}
        <QuickActionsSection
          onAddPatient={onAddPatient}
          onGenerateReport={onGenerateReport}
          onScheduleAppointment={onScheduleAppointment}
          onManageData={onManageData}
          onAISummary={onAISummary}
        />
      </div>
    </div>
  );
};

export default DashboardContent;
