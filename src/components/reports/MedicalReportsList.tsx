import React, { useState } from "react";
import { format } from "date-fns";
import { Eye, Download, FileText } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MedicalReport {
  id: string;
  title: string;
  date: Date;
  doctor: string;
  category: string;
  status: "available" | "pending" | "archived";
  summary?: string;
}

interface MedicalReportsListProps {
  reports?: MedicalReport[];
  onViewReport?: (reportId: string) => void;
  onDownloadReport?: (reportId: string) => void;
}

const MedicalReportsList = ({
  reports = [
    {
      id: "1",
      title: "Annual Physical Examination",
      date: new Date(2023, 5, 15),
      doctor: "Dr. Sarah Johnson",
      category: "Physical",
      status: "available",
      summary:
        "Overall health is good. Blood pressure is within normal range. Recommended regular exercise and balanced diet.",
    },
    {
      id: "2",
      title: "Blood Test Results",
      date: new Date(2023, 6, 22),
      doctor: "Dr. Michael Chen",
      category: "Laboratory",
      status: "available",
      summary:
        "Cholesterol levels slightly elevated. Vitamin D deficiency detected. Recommended supplements and follow-up in 3 months.",
    },
    {
      id: "3",
      title: "Cardiology Consultation",
      date: new Date(2023, 7, 10),
      doctor: "Dr. Emily Rodriguez",
      category: "Specialist",
      status: "pending",
      summary:
        "AI analysis in progress. Report will be available after doctor review.",
    },
  ],
  onViewReport = (id) => console.log(`View report ${id}`),
  onDownloadReport = (id) => console.log(`Download report ${id}`),
}: MedicalReportsListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(reports.map((report) => report.category))];

  const filteredReports = selectedCategory
    ? reports.filter((report) => report.category === selectedCategory)
    : reports;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "secondary";
      case "pending":
        return "outline";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Medical Reports
        </h2>
        <p className="text-gray-600">View and download your medical reports</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          All Reports
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {filteredReports.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <FileText className="mx-auto h-12 w-12 mb-4 text-gray-400" />
          <p>No medical reports found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <Badge variant={getStatusColor(report.status)}>
                    {report.status.charAt(0).toUpperCase() +
                      report.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription>
                  {format(report.date, "MMMM d, yyyy")}
                </CardDescription>
                <CardDescription>{report.doctor}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {report.summary || "No summary available"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewReport(report.id)}
                  disabled={report.status === "pending"}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onDownloadReport(report.id)}
                  disabled={report.status === "pending"}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalReportsList;
