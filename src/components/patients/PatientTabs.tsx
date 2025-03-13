import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  ClipboardList,
  Calendar,
  Activity,
  GitBranch,
} from "lucide-react";

import PatientOverview from "./PatientOverview";
import MedicalHistoryTab from "./MedicalHistoryTab";
import VisitsTab from "./VisitsTab";
import ReportsTab from "./ReportsTab";
import WorkflowTab from "./WorkflowTab";

interface PatientTabsProps {
  patientId?: string;
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
}

const PatientTabs: React.FC<PatientTabsProps> = ({
  patientId = "123",
  defaultTab = "overview",
  onTabChange = () => {},
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange(value);
  };

  return (
    <div className="w-full h-full bg-white">
      <Tabs
        defaultValue={defaultTab}
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger
            value="overview"
            className="flex items-center justify-center gap-2 py-3"
          >
            <FileText className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="medical-history"
            className="flex items-center justify-center gap-2 py-3"
          >
            <ClipboardList className="h-4 w-4" />
            <span>Medical History</span>
          </TabsTrigger>
          <TabsTrigger
            value="visits"
            className="flex items-center justify-center gap-2 py-3"
          >
            <Calendar className="h-4 w-4" />
            <span>Visits</span>
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="flex items-center justify-center gap-2 py-3"
          >
            <Activity className="h-4 w-4" />
            <span>Reports</span>
          </TabsTrigger>
          <TabsTrigger
            value="workflow"
            className="flex items-center justify-center gap-2 py-3"
          >
            <GitBranch className="h-4 w-4" />
            <span>Workflow</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <PatientOverview patientId={patientId} />
        </TabsContent>

        <TabsContent value="medical-history" className="mt-0">
          <MedicalHistoryTab patientId={patientId} />
        </TabsContent>

        <TabsContent value="visits" className="mt-0">
          <VisitsTab patientId={patientId} />
        </TabsContent>

        <TabsContent value="reports" className="mt-0">
          <ReportsTab patientId={patientId} />
        </TabsContent>

        <TabsContent value="workflow" className="mt-0">
          <WorkflowTab patientId={patientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientTabs;
