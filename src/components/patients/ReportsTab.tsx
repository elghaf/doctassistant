import React, { useState } from "react";
import {
  PlusCircle,
  FileText,
  Download,
  Share2,
  Trash2,
  Eye,
  Edit,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Report {
  id: string;
  title: string;
  type: string;
  createdAt: Date;
  status: "draft" | "final";
}

interface ReportsTabProps {
  patientId?: string;
  reports?: Report[];
  onCreateReport?: () => void;
  onViewReport?: (reportId: string) => void;
  onEditReport?: (reportId: string) => void;
  onDeleteReport?: (reportId: string) => void;
  onShareReport?: (reportId: string) => void;
  onDownloadReport?: (reportId: string) => void;
}

const defaultReports: Report[] = [
  {
    id: "1",
    title: "Annual Physical Examination",
    type: "Physical Exam",
    createdAt: new Date(2023, 10, 15),
    status: "final",
  },
  {
    id: "2",
    title: "Blood Work Analysis",
    type: "Lab Results",
    createdAt: new Date(2023, 11, 3),
    status: "final",
  },
  {
    id: "3",
    title: "Treatment Plan",
    type: "Treatment",
    createdAt: new Date(2024, 0, 10),
    status: "draft",
  },
  {
    id: "4",
    title: "Medication Review",
    type: "Medication",
    createdAt: new Date(2024, 1, 22),
    status: "final",
  },
  {
    id: "5",
    title: "Follow-up Consultation",
    type: "Consultation",
    createdAt: new Date(2024, 2, 5),
    status: "draft",
  },
];

const ReportsTab = ({
  patientId = "123",
  reports = defaultReports,
  onCreateReport = () => {},
  onViewReport = () => {},
  onEditReport = () => {},
  onDeleteReport = () => {},
  onShareReport = () => {},
  onDownloadReport = () => {},
}: ReportsTabProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [deleteReportId, setDeleteReportId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredReports =
    activeTab === "all"
      ? reports
      : activeTab === "draft"
        ? reports.filter((report) => report.status === "draft")
        : reports.filter((report) => report.status === "final");

  const handleDeleteClick = (reportId: string) => {
    setDeleteReportId(reportId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteReportId) {
      onDeleteReport(deleteReportId);
      setIsDeleteDialogOpen(false);
      setDeleteReportId(null);
    }
  };

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Patient Reports</h2>
        <Button onClick={onCreateReport} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create New Report
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="final">Finalized</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onView={() => onViewReport(report.id)}
                  onEdit={() => onEditReport(report.id)}
                  onDelete={() => handleDeleteClick(report.id)}
                  onShare={() => onShareReport(report.id)}
                  onDownload={() => onDownloadReport(report.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState onCreateReport={onCreateReport} />
          )}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onView={() => onViewReport(report.id)}
                  onEdit={() => onEditReport(report.id)}
                  onDelete={() => handleDeleteClick(report.id)}
                  onShare={() => onShareReport(report.id)}
                  onDownload={() => onDownloadReport(report.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              onCreateReport={onCreateReport}
              message="No draft reports found"
            />
          )}
        </TabsContent>

        <TabsContent value="final" className="space-y-4">
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onView={() => onViewReport(report.id)}
                  onEdit={() => onEditReport(report.id)}
                  onDelete={() => handleDeleteClick(report.id)}
                  onShare={() => onShareReport(report.id)}
                  onDownload={() => onDownloadReport(report.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              onCreateReport={onCreateReport}
              message="No finalized reports found"
            />
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Report</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this report? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ReportCardProps {
  report: Report;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
  onDownload: () => void;
}

const ReportCard = ({
  report,
  onView,
  onEdit,
  onDelete,
  onShare,
  onDownload,
}: ReportCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{report.title}</CardTitle>
            <CardDescription>{report.type}</CardDescription>
          </div>
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${report.status === "draft" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}
          >
            {report.status === "draft" ? "Draft" : "Final"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-gray-500">
          <FileText className="h-4 w-4 mr-2" />
          <span>Created on {format(report.createdAt, "MMM d, yyyy")}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={onView}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={onShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

interface EmptyStateProps {
  onCreateReport: () => void;
  message?: string;
}

const EmptyState = ({
  onCreateReport,
  message = "No reports found",
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-gray-50">
      <FileText className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      <p className="text-sm text-gray-500 mb-4 text-center">
        Create a new report to document patient's condition, treatment plans, or
        test results.
      </p>
      <Button onClick={onCreateReport} className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        Create New Report
      </Button>
    </div>
  );
};

export default ReportsTab;
