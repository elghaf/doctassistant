import React, { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Image,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  FileText,
  Save,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PatientData {
  name: string;
  age: number;
  gender: string;
  dob: string;
  diagnosis: string[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
  };
}

interface ReportEditorProps {
  content?: string;
  patientData?: PatientData;
  onChange?: (content: string) => void;
  onSave?: () => void;
}

const ReportEditor = ({
  content = "",
  patientData = {
    name: "Jane Doe",
    age: 45,
    gender: "Female",
    dob: "1979-05-15",
    diagnosis: ["Hypertension", "Type 2 Diabetes"],
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
    ],
    vitals: {
      bloodPressure: "130/85",
      heartRate: 72,
      temperature: 98.6,
    },
  },
  onChange = () => {},
  onSave = () => {},
}: ReportEditorProps) => {
  const [editorContent, setEditorContent] = useState(
    content || getDefaultContent(patientData),
  );
  const [activeTab, setActiveTab] = useState("editor");

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorContent(e.target.value);
    onChange(e.target.value);
  };

  const insertPatientData = (field: string) => {
    let insertText = "";

    switch (field) {
      case "fullName":
        insertText = patientData.name;
        break;
      case "age":
        insertText = patientData.age.toString();
        break;
      case "gender":
        insertText = patientData.gender;
        break;
      case "dob":
        insertText = patientData.dob;
        break;
      case "diagnosis":
        insertText = patientData.diagnosis.join(", ");
        break;
      case "medications":
        insertText = patientData.medications
          .map((med) => `${med.name} ${med.dosage} ${med.frequency}`)
          .join("\n");
        break;
      case "vitals":
        insertText = `Blood Pressure: ${patientData.vitals.bloodPressure}\nHeart Rate: ${patientData.vitals.heartRate} bpm\nTemperature: ${patientData.vitals.temperature}°F`;
        break;
      default:
        break;
    }

    const updatedContent = editorContent + insertText;
    setEditorContent(updatedContent);
    onChange(updatedContent);
  };

  const applyFormatting = (format: string) => {
    // In a real implementation, this would apply formatting to selected text
    // For this UI scaffolding, we'll just show the buttons
    console.log(`Applying ${format} formatting`);
  };

  return (
    <div className="w-full h-full bg-white border rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Report Editor</h2>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => console.log("Undo")}
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => console.log("Redo")}
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button onClick={onSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => applyFormatting("bold")}
                >
                  <Bold className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bold</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => applyFormatting("italic")}
                >
                  <Italic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Italic</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => applyFormatting("underline")}
                >
                  <Underline className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Underline</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Separator orientation="vertical" className="h-8" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => applyFormatting("heading1")}
                >
                  <Heading1 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 1</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => applyFormatting("heading2")}
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 2</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => applyFormatting("heading3")}
                >
                  <Heading3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Heading 3</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Separator orientation="vertical" className="h-8" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => applyFormatting("bulletList")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bullet List</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => applyFormatting("numberedList")}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Numbered List</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Separator orientation="vertical" className="h-8" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => applyFormatting("alignLeft")}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Left</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => applyFormatting("alignCenter")}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Center</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => applyFormatting("alignRight")}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Align Right</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Separator orientation="vertical" className="h-8" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => applyFormatting("image")}
                >
                  <Image className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Image</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => applyFormatting("link")}
                >
                  <Link className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Link</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex h-[calc(100%-160px)]">
        <div className="w-3/4 border-r">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full">
              <TabsTrigger value="editor" className="flex-1">
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex-1">
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="p-0 h-full">
              <textarea
                className="w-full h-full p-4 resize-none focus:outline-none"
                value={editorContent}
                onChange={handleContentChange}
                placeholder="Start typing your report content here..."
              />
            </TabsContent>

            <TabsContent value="preview" className="p-0 h-full">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: editorContent.replace(/\n/g, "<br />"),
                    }}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-1/4 p-4 bg-gray-50">
          <h3 className="text-sm font-medium mb-3">Insert Patient Data</h3>
          <div className="space-y-2">
            <Card>
              <CardContent className="p-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => insertPatientData("fullName")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Patient Name
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => insertPatientData("age")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Patient Age
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => insertPatientData("gender")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Patient Gender
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => insertPatientData("dob")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Date of Birth
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => insertPatientData("diagnosis")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Diagnosis
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => insertPatientData("medications")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Medications
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => insertPatientData("vitals")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Vitals
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

function getDefaultContent(patientData: PatientData): string {
  return `# Medical Report

Patient: 
Age: 
Gender: 
Date: ${new Date().toLocaleDateString()}

## Current Diagnosis


## Medications


## Vitals
- Blood Pressure: 
- Heart Rate: 
- Temperature: 

## Assessment


## Plan

`;
}

export default ReportEditor;
