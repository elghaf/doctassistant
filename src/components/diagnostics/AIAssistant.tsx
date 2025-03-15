import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Bot,
  Send,
  FileText,
  RefreshCw,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  History,
  Stethoscope,
  PlusCircle,
} from "lucide-react";

interface AIAssistantProps {
  patientId?: string;
  patientName?: string;
  patientHistory?: {
    diagnoses: string[];
    medications: string[];
    allergies: string[];
    recentVisits: Array<{ date: string; reason: string; doctor: string }>;
  };
  onSaveNote?: (note: string) => void;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  patientId = "P12345",
  patientName = "John Doe",
  patientHistory = {
    diagnoses: ["Hypertension", "Type 2 Diabetes", "Hyperlipidemia"],
    medications: ["Lisinopril 10mg", "Metformin 500mg", "Atorvastatin 20mg"],
    allergies: ["Penicillin", "Sulfa drugs"],
    recentVisits: [
      {
        date: "2023-05-15",
        reason: "Routine checkup",
        doctor: "Dr. Sarah Johnson",
      },
      {
        date: "2023-03-02",
        reason: "Flu symptoms",
        doctor: "Dr. Michael Chen",
      },
    ],
  },
  onSaveNote = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("chat");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `Hello! I'm your AI medical assistant. I can help you with patient information, suggest diagnoses, or answer medical questions about ${patientName}. How can I assist you today?`,
      sender: "ai",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
    if (!query.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: query,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setQuery("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(query);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  // Simple AI response generator (in a real app, this would call an API)
  const generateAIResponse = (userQuery: string) => {
    const query = userQuery.toLowerCase();

    if (query.includes("diagnos") || query.includes("condition")) {
      return `Based on ${patientName}'s symptoms and history of ${patientHistory.diagnoses.join(", ")}, the most likely diagnoses to consider are:

1. Exacerbation of existing hypertension
2. Diabetic neuropathy
3. Medication side effects

I recommend checking recent blood pressure readings and HbA1c levels. Consider adjusting current medications if necessary.`;
    }

    if (query.includes("medication") || query.includes("drug")) {
      return `${patientName} is currently taking:

- Lisinopril 10mg daily (for hypertension)
- Metformin 500mg twice daily (for diabetes)
- Atorvastatin 20mg at bedtime (for cholesterol)

Based on recent lab results, consider increasing Metformin to 1000mg twice daily if HbA1c remains above target.`;
    }

    if (query.includes("history") || query.includes("record")) {
      return `${patientName}'s relevant medical history includes:

- Diagnosed with Type 2 Diabetes (2018)
- Hypertension (2016)
- Hyperlipidemia (2019)
- Family history of cardiovascular disease
- No surgical history
- Last hospitalization: None in past 5 years`;
    }

    if (query.includes("test") || query.includes("lab")) {
      return `Recent lab results for ${patientName}:

- HbA1c: 7.2% (target <7.0%)
- Blood Pressure: 138/85 mmHg
- Total Cholesterol: 185 mg/dL
- LDL: 110 mg/dL
- HDL: 42 mg/dL
- eGFR: 75 mL/min/1.73m²

Recommend follow-up labs in 3 months to monitor diabetes control.`;
    }

    return `I've analyzed ${patientName}'s medical records and current symptoms. Based on the information provided, I would suggest considering the following approach:

1. Review current medication efficacy and potential interactions
2. Order comprehensive metabolic panel and lipid profile
3. Consider referral to endocrinology for diabetes management optimization

Would you like me to provide more specific information about any of these recommendations?`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQueries = [
    "What are possible diagnoses based on current symptoms?",
    "Summarize patient medication history",
    "Analyze recent lab results",
    "Suggest treatment options for hypertension",
    "Check for potential drug interactions",
  ];

  return (
    <Card className="w-full h-[700px] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2 bg-primary/20">
              <Bot className="h-4 w-4 text-primary" />
            </Avatar>
            <div>
              <CardTitle>AI Medical Assistant</CardTitle>
              <CardDescription>
                Powered by medical knowledge base
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/10">
            Beta
          </Badge>
        </div>
      </CardHeader>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid grid-cols-2 mx-4">
          <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
          <TabsTrigger value="history">Patient History</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "ai" && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <Bot className="h-4 w-4" />
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    <div className="whitespace-pre-line">{message.content}</div>
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 ml-2 mt-1 bg-primary">
                      <Stethoscope className="h-4 w-4 text-white" />
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <Avatar className="h-8 w-8 mr-2">
                    <Bot className="h-4 w-4" />
                  </Avatar>
                  <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Analyzing medical data...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {messages.length === 1 && (
            <div className="px-4 pb-4">
              <p className="text-sm text-muted-foreground mb-2">
                Suggested queries:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((q, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setQuery(q);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                  >
                    <Lightbulb className="h-3 w-3 mr-1" />
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t mt-auto">
            <div className="flex space-x-2">
              <Textarea
                placeholder="Ask about diagnoses, treatments, or patient history..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[60px]"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!query.trim() || isLoading}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                AI suggestions are for reference only. Always use clinical
                judgment.
              </p>
              <Button variant="ghost" size="sm" className="text-xs">
                <FileText className="h-3 w-3 mr-1" /> Save to notes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="flex-1 p-4 m-0 overflow-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Patient Information
              </h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="font-medium">Patient ID:</span>
                  <span>{patientId}</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="font-medium">Name:</span>
                  <span>{patientName}</span>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span className="font-medium">Date of Birth:</span>
                  <span>05/12/1975</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                Diagnoses
              </h3>
              <div className="mt-2 space-y-1">
                {patientHistory.diagnoses.map((diagnosis, index) => (
                  <div
                    key={index}
                    className="p-2 bg-muted rounded flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>{diagnosis}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                Current Medications
              </h3>
              <div className="mt-2 space-y-1">
                {patientHistory.medications.map((medication, index) => (
                  <div key={index} className="p-2 bg-muted rounded">
                    {medication}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                Allergies
              </h3>
              <div className="mt-2 space-y-1">
                {patientHistory.allergies.map((allergy, index) => (
                  <div
                    key={index}
                    className="p-2 bg-red-50 text-red-700 rounded"
                  >
                    {allergy}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium flex items-center">
                <History className="h-5 w-5 mr-2 text-primary" />
                Recent Visits
              </h3>
              <div className="mt-2 space-y-2">
                {patientHistory.recentVisits.map((visit, index) => (
                  <div key={index} className="p-3 border rounded">
                    <div className="flex justify-between">
                      <span className="font-medium">{visit.date}</span>
                      <span className="text-sm text-gray-500">
                        {visit.doctor}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{visit.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Note to Patient Record
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AIAssistant;
