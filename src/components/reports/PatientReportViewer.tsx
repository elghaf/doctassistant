import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  BarChart,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
  summary: string;
  aiSummary?: string;
  status: "normal" | "abnormal" | "critical";
  doctor: string;
}

interface PatientReportViewerProps {
  reports?: Report[];
  patientName?: string;
  onDownload?: (reportId: string) => void;
}

const PatientReportViewer = ({
  reports = [
    {
      id: "rep-001",
      title: "Complete Blood Count",
      date: "2023-06-15",
      type: "Lab Results",
      summary:
        "All blood cell counts within normal ranges. Hemoglobin at 14.2 g/dL, WBC at 7.5 x10^9/L, Platelets at 250 x10^9/L.",
      aiSummary:
        "Your blood test results are all within normal ranges, indicating good overall health. Your immune system appears to be functioning properly with normal white blood cell counts.",
      status: "normal",
      doctor: "Dr. Sarah Johnson",
    },
    {
      id: "rep-002",
      title: "Lipid Panel",
      date: "2023-05-22",
      type: "Lab Results",
      summary:
        "Total Cholesterol: 210 mg/dL (borderline high), LDL: 140 mg/dL (borderline high), HDL: 45 mg/dL (normal), Triglycerides: 150 mg/dL (normal).",
      aiSummary:
        "Your cholesterol levels are slightly elevated. Consider dietary changes to reduce saturated fat intake and increase exercise. Follow-up recommended in 3 months.",
      status: "abnormal",
      doctor: "Dr. Michael Chen",
    },
    {
      id: "rep-003",
      title: "Chest X-Ray",
      date: "2023-04-10",
      type: "Imaging",
      summary:
        "No acute cardiopulmonary process. Heart size normal. Lungs clear. No effusions or pneumothorax.",
      aiSummary:
        "Your chest X-ray shows normal heart and lung appearance with no signs of infection, fluid, or other abnormalities.",
      status: "normal",
      doctor: "Dr. Emily Rodriguez",
    },
  ],
  patientName = "John Doe",
  onDownload = (reportId) => console.log(`Downloading report ${reportId}`),
}: PatientReportViewerProps) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(
    reports.length > 0 ? reports[0] : null,
  );
  const [activeTab, setActiveTab] = useState("all");

  const filteredReports =
    activeTab === "all"
      ? reports
      : reports.filter((report) => report.type.toLowerCase() === activeTab);

  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "normal":
        return "text-green-600 bg-green-100";
      case "abnormal":
        return "text-amber-600 bg-amber-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Medical Reports & Lab Results</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Filter by Date
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Filter by Type
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="lab results">Lab Results</TabsTrigger>
            <TabsTrigger value="imaging">Imaging</TabsTrigger>
            <TabsTrigger value="consultation">Consultations</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredReports.map((report) => (
                <Card
                  key={report.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${selectedReport?.id === report.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedReport(report)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}
                      >
                        {report.status.charAt(0).toUpperCase() +
                          report.status.slice(1)}
                      </span>
                    </div>
                    <CardDescription>
                      {new Date(report.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">{report.summary}</p>
                  </CardContent>
                  <CardFooter className="pt-2 text-xs text-gray-500">
                    {report.doctor} • {report.type}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lab results" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredReports.map((report) => (
                <Card
                  key={report.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${selectedReport?.id === report.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedReport(report)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}
                      >
                        {report.status.charAt(0).toUpperCase() +
                          report.status.slice(1)}
                      </span>
                    </div>
                    <CardDescription>
                      {new Date(report.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">{report.summary}</p>
                  </CardContent>
                  <CardFooter className="pt-2 text-xs text-gray-500">
                    {report.doctor} • {report.type}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="imaging" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredReports.map((report) => (
                <Card
                  key={report.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${selectedReport?.id === report.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedReport(report)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}
                      >
                        {report.status.charAt(0).toUpperCase() +
                          report.status.slice(1)}
                      </span>
                    </div>
                    <CardDescription>
                      {new Date(report.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">{report.summary}</p>
                  </CardContent>
                  <CardFooter className="pt-2 text-xs text-gray-500">
                    {report.doctor} • {report.type}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="consultation" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredReports.map((report) => (
                <Card
                  key={report.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${selectedReport?.id === report.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedReport(report)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}
                      >
                        {report.status.charAt(0).toUpperCase() +
                          report.status.slice(1)}
                      </span>
                    </div>
                    <CardDescription>
                      {new Date(report.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">{report.summary}</p>
                  </CardContent>
                  <CardFooter className="pt-2 text-xs text-gray-500">
                    {report.doctor} • {report.type}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {selectedReport && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">
                    {selectedReport.title}
                  </CardTitle>
                  <CardDescription>
                    {new Date(selectedReport.date).toLocaleDateString()} •{" "}
                    {selectedReport.doctor} • {selectedReport.type}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => onDownload(selectedReport.id)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Report Summary</h3>
                <p className="text-gray-700">{selectedReport.summary}</p>
              </div>

              {selectedReport.aiSummary && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <BarChart className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-medium text-blue-800">
                      AI-Generated Explanation
                    </h3>
                  </div>
                  <p className="text-gray-700">{selectedReport.aiSummary}</p>
                </div>
              )}

              {selectedReport.status !== "normal" && (
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                    <h3 className="text-lg font-medium text-amber-800">
                      Recommendations
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    Based on these results, we recommend scheduling a follow-up
                    appointment to discuss treatment options. Please maintain
                    your current medications and consider the lifestyle changes
                    mentioned in your care plan.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PatientReportViewer;
