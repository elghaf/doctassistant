import React, { useState } from "react";
import { Upload, FileText, Check, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface AIReportGeneratorProps {
  patientId?: string;
  patientName?: string;
  labResults?: {
    id: string;
    name: string;
    date: string;
    type: string;
    file?: string;
  }[];
  onReportGenerated?: (report: any) => void;
}

const AIReportGenerator = ({
  patientId = "P12345",
  patientName = "John Doe",
  labResults = [
    {
      id: "lab1",
      name: "Complete Blood Count",
      date: "2023-05-15",
      type: "Blood Test",
    },
    {
      id: "lab2",
      name: "Lipid Panel",
      date: "2023-05-15",
      type: "Blood Test",
    },
    {
      id: "lab3",
      name: "Metabolic Panel",
      date: "2023-04-30",
      type: "Blood Test",
    },
    {
      id: "lab4",
      name: "Thyroid Function",
      date: "2023-04-30",
      type: "Blood Test",
    },
  ],
  onReportGenerated = () => {},
}: AIReportGeneratorProps) => {
  const [activeTab, setActiveTab] = useState("upload");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReportReady, setIsReportReady] = useState(false);
  const [reportSummary, setReportSummary] = useState("");
  const [selectedLabResults, setSelectedLabResults] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleLabResultSelection = (labId: string) => {
    setSelectedLabResults((prev) => {
      if (prev.includes(labId)) {
        return prev.filter((id) => id !== labId);
      } else {
        return [...prev, labId];
      }
    });
  };

  const generateReport = () => {
    setIsGenerating(true);

    // Simulate API call to OpenAI
    setTimeout(() => {
      setReportSummary(
        "Based on the lab results analysis, the patient shows normal blood count values with slight elevation in cholesterol levels (LDL: 130 mg/dL). Liver and kidney function tests are within normal ranges. Thyroid function appears normal with TSH at 2.4 mIU/L. Recommend lifestyle modifications including dietary changes to address cholesterol levels. No immediate medical intervention required, but suggest follow-up lipid panel in 3 months.",
      );
      setIsGenerating(false);
      setIsReportReady(true);
    }, 2000);
  };

  const finalizeReport = () => {
    // In a real implementation, this would save the report to the database
    onReportGenerated({
      patientId,
      patientName,
      summary: reportSummary,
      date: new Date().toISOString(),
      labResults:
        selectedLabResults.length > 0
          ? labResults.filter((lab) => selectedLabResults.includes(lab.id))
          : uploadedFiles.map((file) => ({
              name: file.name,
              type: "Uploaded File",
              date: new Date().toISOString(),
            })),
    });

    // Reset the form
    setActiveTab("upload");
    setIsReportReady(false);
    setReportSummary("");
    setSelectedLabResults([]);
    setUploadedFiles([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">AI Medical Report Generator</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
          <CardDescription>
            Review patient details before generating report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Patient ID</label>
              <Input value={patientId} readOnly className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Patient Name</label>
              <Input value={patientName} readOnly className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Lab Results</TabsTrigger>
          <TabsTrigger value="select">Select Existing Results</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="p-4 border rounded-md mt-2">
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop files here or click to browse
            </p>
            <Input
              type="file"
              multiple
              className="max-w-xs"
              onChange={handleFileUpload}
            />
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Uploaded Files:</h3>
              <ul className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center p-2 bg-gray-50 rounded"
                  >
                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm">{file.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>

        <TabsContent value="select" className="p-4 border rounded-md mt-2">
          <div className="mb-4">
            <label className="text-sm font-medium">Filter by Type</label>
            <Select defaultValue="all">
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="blood">Blood Tests</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {labResults.map((lab) => (
              <div
                key={lab.id}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedLabResults.includes(lab.id) ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"}`}
                onClick={() => handleLabResultSelection(lab.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{lab.name}</h3>
                    <p className="text-sm text-gray-500">
                      {lab.type} • {lab.date}
                    </p>
                  </div>
                  {selectedLabResults.includes(lab.id) && (
                    <Check className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {!isReportReady ? (
        <Button
          onClick={generateReport}
          disabled={
            isGenerating ||
            (activeTab === "upload" && uploadedFiles.length === 0) ||
            (activeTab === "select" && selectedLabResults.length === 0)
          }
          className="w-full mb-6"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Results...
            </>
          ) : (
            "Generate AI Report"
          )}
        </Button>
      ) : (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                AI Report Generated
              </CardTitle>
              <CardDescription>
                Review and edit the report before finalizing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Report Summary
                </label>
                <Textarea
                  value={reportSummary}
                  onChange={(e) => setReportSummary(e.target.value)}
                  rows={8}
                  className="w-full"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <p className="text-sm text-amber-800">
                  This is an AI-generated report. Please review carefully before
                  finalizing. Edit any inaccuracies in the summary above.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsReportReady(false)}>
                Cancel
              </Button>
              <Button onClick={finalizeReport}>Finalize Report</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIReportGenerator;
