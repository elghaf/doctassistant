import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserPlus,
  FileText,
  Calendar,
  Database,
  Brain,
  Stethoscope,
  ArrowRight,
} from "lucide-react";

interface QuickAction {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

interface QuickActionsSectionProps {
  actions?: QuickAction[];
  onAddPatient?: () => void;
  onGenerateReport?: () => void;
  onScheduleAppointment?: () => void;
  onManageData?: () => void;
  onAISummary?: () => void;
}

const QuickActionsSection = ({
  actions,
  onAddPatient = () => {},
  onGenerateReport = () => {},
  onScheduleAppointment = () => {},
  onManageData = () => {},
  onAISummary = () => {},
}: QuickActionsSectionProps) => {
  // Default actions if none are provided
  const defaultActions: QuickAction[] = [
    {
      icon: <UserPlus className="h-6 w-6 text-blue-500" />,
      title: "Add New Patient",
      description: "Register a new patient in the system",
      onClick: onAddPatient,
    },
    {
      icon: <FileText className="h-6 w-6 text-green-500" />,
      title: "Generate Report",
      description: "Create customized patient reports",
      onClick: onGenerateReport,
    },
    {
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
      title: "Schedule Appointment",
      description: "Book a new patient appointment",
      onClick: onScheduleAppointment,
    },
    {
      icon: <Database className="h-6 w-6 text-amber-500" />,
      title: "Manage Data",
      description: "Import, export, or backup patient data",
      onClick: onManageData,
    },
    {
      icon: <Brain className="h-6 w-6 text-rose-500" />,
      title: "AI Summary",
      description: "Generate AI-powered patient summaries",
      onClick: onAISummary,
    },
    {
      icon: <Stethoscope className="h-6 w-6 text-cyan-500" />,
      title: "Medical Resources",
      description: "Access clinical guidelines and resources",
      onClick: () => {},
    },
  ];

  const displayActions = actions || defaultActions;

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <Button variant="ghost" className="text-sm flex items-center gap-1">
          View All <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayActions.map((action, index) => (
          <Card
            key={index}
            className="hover:shadow-md transition-shadow cursor-pointer border-l-4"
            style={{ borderLeftColor: getColorForIndex(index) }}
            onClick={action.onClick}
          >
            <CardContent className="p-4 flex items-start gap-4">
              <div className="p-2 rounded-lg bg-gray-50">{action.icon}</div>
              <div>
                <h3 className="font-medium">{action.title}</h3>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Helper function to get a color based on the index
const getColorForIndex = (index: number): string => {
  const colors = [
    "#3b82f6", // blue-500
    "#22c55e", // green-500
    "#a855f7", // purple-500
    "#f59e0b", // amber-500
    "#f43f5e", // rose-500
    "#06b6d4", // cyan-500
  ];
  return colors[index % colors.length];
};

export default QuickActionsSection;
