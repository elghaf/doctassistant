import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import MedicalReportsList from "../reports/MedicalReportsList";
import AIReportGenerator from "../reports/AIReportGenerator";

const DoctorReports = () => {
  const [isCreatingReport, setIsCreatingReport] = useState(false);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Reports</h1>
          <p className="text-gray-600">Manage patient medical reports</p>
        </div>
        <Button onClick={() => setIsCreatingReport(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Report
        </Button>
      </div>

      {isCreatingReport ? (
        <div>
          <Button
            variant="outline"
            onClick={() => setIsCreatingReport(false)}
            className="mb-4"
          >
            Back to Reports
          </Button>
          <AIReportGenerator onComplete={() => setIsCreatingReport(false)} />
        </div>
      ) : (
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="mb-6 bg-white">
            <TabsTrigger value="recent">Recent Reports</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="all">All Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="recent">
            <Card>
              <CardContent className="p-0">
                <MedicalReportsList filter="recent" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardContent className="p-0">
                <MedicalReportsList filter="pending" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardContent className="p-0">
                <MedicalReportsList filter="all" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default DoctorReports;
