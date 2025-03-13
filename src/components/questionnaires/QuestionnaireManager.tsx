import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  AlertCircle,
  CheckCircle,
  ClipboardList,
  FileText,
  Plus,
} from "lucide-react";
import HealthQuestionnaire from "./HealthQuestionnaire";

interface Questionnaire {
  id: string;
  title: string;
  description: string;
  status: "completed" | "pending" | "overdue";
  dueDate: string;
  type: "health" | "followup" | "specialist";
}

interface QuestionnaireManagerProps {
  patientId?: string;
  onSubmitQuestionnaire?: (questionnaireId: string, data: any) => void;
}

const QuestionnaireManager: React.FC<QuestionnaireManagerProps> = ({
  patientId = "12345",
  onSubmitQuestionnaire = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedQuestionnaire, setSelectedQuestionnaire] =
    useState<Questionnaire | null>(null);

  // Mock questionnaires data
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([
    {
      id: "q1",
      title: "Annual Health Assessment",
      description: "Complete your annual health assessment questionnaire",
      status: "pending",
      dueDate: "2023-06-15",
      type: "health",
    },
    {
      id: "q2",
      title: "Post-Surgery Follow-up",
      description:
        "Please complete this questionnaire after your recent procedure",
      status: "completed",
      dueDate: "2023-05-20",
      type: "followup",
    },
    {
      id: "q3",
      title: "Cardiology Specialist Referral",
      description:
        "Pre-appointment questionnaire for your cardiology consultation",
      status: "overdue",
      dueDate: "2023-05-01",
      type: "specialist",
    },
    {
      id: "q4",
      title: "Medication Review",
      description:
        "Review your current medications and report any side effects",
      status: "pending",
      dueDate: "2023-06-30",
      type: "health",
    },
  ]);

  const filteredQuestionnaires =
    activeTab === "all"
      ? questionnaires
      : questionnaires.filter((q) => q.status === activeTab);

  const handleSubmitQuestionnaire = (data: any) => {
    if (selectedQuestionnaire) {
      // Update the questionnaire status to completed
      setQuestionnaires(
        questionnaires.map((q) =>
          q.id === selectedQuestionnaire.id
            ? { ...q, status: "completed" as const }
            : q,
        ),
      );

      // Call the onSubmitQuestionnaire prop with the questionnaire ID and data
      onSubmitQuestionnaire(selectedQuestionnaire.id, data);

      // Reset the selected questionnaire
      setSelectedQuestionnaire(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "pending":
        return <Badge className="bg-blue-500">Pending</Badge>;
      case "overdue":
        return <Badge className="bg-red-500">Overdue</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <ClipboardList className="h-5 w-5 text-blue-500" />;
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  // If a questionnaire is selected, show the questionnaire form
  if (selectedQuestionnaire) {
    return (
      <div className="w-full bg-background">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => setSelectedQuestionnaire(null)}
            className="mr-2"
          >
            Back to Questionnaires
          </Button>
          <h2 className="text-2xl font-semibold">
            {selectedQuestionnaire.title}
          </h2>
        </div>

        {/* For this example, we'll use the HealthQuestionnaire component for all questionnaire types */}
        <HealthQuestionnaire
          patientId={patientId}
          onSubmit={handleSubmitQuestionnaire}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Health Questionnaires</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Questionnaire
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredQuestionnaires.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  No questionnaires found.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredQuestionnaires.map((questionnaire) => (
              <Card
                key={questionnaire.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {getStatusIcon(questionnaire.status)}
                      <CardTitle className="ml-2 text-xl">
                        {questionnaire.title}
                      </CardTitle>
                    </div>
                    {getStatusBadge(questionnaire.status)}
                  </div>
                  <CardDescription>{questionnaire.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Due:{" "}
                        <span
                          className={
                            questionnaire.status === "overdue"
                              ? "text-red-500 font-medium"
                              : ""
                          }
                        >
                          {new Date(questionnaire.dueDate).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                    <Button
                      onClick={() => setSelectedQuestionnaire(questionnaire)}
                      variant={
                        questionnaire.status === "completed"
                          ? "outline"
                          : "default"
                      }
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      {questionnaire.status === "completed"
                        ? "View"
                        : "Complete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuestionnaireManager;
