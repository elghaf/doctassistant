import React from "react";
import PatientReportViewer from "../reports/PatientReportViewer";
import { usePatientData } from "@/hooks/usePatientData";

interface PatientReportsProps {
  patientId?: string;
  patientName?: string;
}

const PatientReports = ({
  patientId = "12345",
  patientName = "Sarah Johnson",
}: PatientReportsProps) => {
  const { patientProfile, reports } = usePatientData(patientId);

  // Use profile data if available
  const displayName = patientProfile?.name || patientName;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Medical Reports</h1>
        <p className="text-gray-600">
          View your medical reports and test results
        </p>
      </div>

      <PatientReportViewer
        patientName={displayName}
        reports={reports.map((report) => ({
          id: report.id,
          title: report.title,
          date: report.report_date,
          type: report.type,
          summary: report.summary,
          aiSummary: report.ai_summary,
          status: report.status,
          doctor: report.profiles?.name || "Doctor",
        }))}
      />
    </div>
  );
};

export default PatientReports;
