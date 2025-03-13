import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Send,
  Sparkles,
  FileText,
  Copy,
  Check,
  Download,
  User,
  Bot,
  Wand2,
  Clipboard,
  Lightbulb,
  Stethoscope,
  Pill,
} from "lucide-react";
import AISummaryModal from "@/components/ai/AISummaryModal";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Suggestion {
  id: string;
  text: string;
  icon: React.ReactNode;
}

const AIAssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isAISummaryOpen, setIsAISummaryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateMockResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Mock response generator
  const generateMockResponse = (query: string): string => {
    if (query.toLowerCase().includes("diagnosis")) {
      return "Based on the symptoms described (persistent cough, fatigue, and mild fever), the most likely diagnosis is acute bronchitis. I recommend prescribing an antibiotic such as Amoxicillin 500mg three times daily for 7 days, along with a cough suppressant. The patient should rest and increase fluid intake. If symptoms worsen or don't improve within 3-5 days, a follow-up appointment would be advisable to rule out pneumonia.";
    } else if (query.toLowerCase().includes("treatment")) {
      return "For the treatment of Type 2 Diabetes with HbA1c of 7.8%, I would recommend the following approach:\n\n1. Medication: Continue Metformin 500mg twice daily, consider adding an SGLT2 inhibitor like Empagliflozin 10mg daily\n2. Lifestyle modifications: Mediterranean diet, 150 minutes of moderate exercise weekly\n3. Blood glucose monitoring: Before breakfast and 2 hours after dinner\n4. Follow-up: Schedule lab work in 3 months to reassess HbA1c\n5. Referral: Consider nephrology consultation due to early signs of kidney function decline";
    } else if (query.toLowerCase().includes("interpret")) {
      return "The lab results show elevated liver enzymes (ALT: 65 U/L, AST: 72 U/L) which may indicate liver inflammation. The patient's lipid panel shows borderline high LDL (145 mg/dL) and low HDL (38 mg/dL), suggesting dyslipidemia. The slightly elevated fasting glucose (118 mg/dL) indicates prediabetes. I recommend lifestyle modifications including reduced alcohol consumption, regular exercise, and a low-fat diet. Consider starting atorvastatin 10mg for cholesterol management and schedule a follow-up liver function test in 6 weeks.";
    } else {
      return "I'm here to help with medical questions, diagnostic assistance, treatment recommendations, and interpreting test results. Could you provide more specific information about the patient's condition or what medical guidance you're looking for?";
    }
  };

  // Suggested prompts
  const suggestions: Suggestion[] = [];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">AI Assistant</h1>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="chat" className="w-full">
                  <TabsList>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chat">
                    <div className="mt-4">
                      {/* Chat content */}
                      <p>Chat interface goes here</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history">
                    <div className="mt-4">
                      {/* History content */}
                      <p>Chat history goes here</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistantPage;
