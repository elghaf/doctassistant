import React, { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import HealthQuestionnaire from "./HealthQuestionnaire";
import { questionnairesApi } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

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
  questionnaires?: any[];
  onSubmitQuestionnaire?: (questionnaireId: string, data: any) => void;
}

const QuestionnaireManager: React.FC<QuestionnaireManagerProps> = ({
  patientId = "12345",
  questionnaires: initialQuestionnaires = [],
  onSubmitQuestionnaire = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedQuestionnaire, setSelectedQuestionnaire] =
    useState<Questionnaire | null>(null);
  const [loading, setLoading] = useState(initialQuestionnaires.length === 0);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Questionnaires data
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>(
    initialQuestionnaires.map((q) => ({
      id: q.id,
      title: q.questionnaires?.title || "Health Questionnaire",
      description:
        q.questionnaires?.description ||
        "Please complete this health questionnaire",
      status: q.status || "pending",
      dueDate: q.due_date || new Date().toISOString(),
      type: q.questionnaires?.type || "health",
    })),
  );

  // Fetch questionnaires if none provided
  useEffect(() => {
    if (initialQuestionnaires.length === 0 && patientId) {
      const fetchQuestionnaires = async () => {
        try {
          setLoading(true);
          const data =
            await questionnairesApi.getPatientQuestionnaires(patientId);

          const formattedQuestionnaires = data.map((q) => ({
            id: q.id,
            title: q.questionnaires?.title || "Health Questionnaire",
            description:
              q.questionnaires?.description ||
              "Please complete this health questionnaire",
            status: q.status || "pending",
            dueDate: q.due_date || new Date().toISOString(),
            type: q.questionnaires?.type || "health",
          }));

          setQuestionnaires(formattedQuestionnaires);
          setError(null);
        } catch (err) {
          console.error("Error fetching questionnaires:", err);
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to load questionnaires"),
          );
          toast({
            title: "Error",
            description: "Failed to load questionnaires. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchQuestionnaires();
    }
  }, [patientId, initialQuestionnaires.length, toast]);

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

      toast({
        title: "Questionnaire Submitted",
        description: "Your questionnaire has been successfully submitted.",
      });
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

  if (loading) {
    return (
      <div className="w-full bg-background p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Loading questionnaires...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-background p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-500 font-medium">
              Error loading questionnaires
            </p>
            <p className="text-muted-foreground mt-2">{error.message}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
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
