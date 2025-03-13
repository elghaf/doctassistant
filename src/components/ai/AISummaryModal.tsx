import React, { useState } from "react";
import {
  Brain,
  Sparkles,
  Wand2,
  FileText,
  Check,
  X,
  Copy,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AISummaryModalProps {
  patientId?: string;
  patientName?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onGenerateSummary?: (prompt: string, options: any) => void;
  onSaveSummary?: (summary: string) => void;
  onClose?: () => void;
}

const AISummaryModal = ({
  patientId = "123",
  patientName = "Jane Doe",
  isOpen = true,
  onOpenChange = () => {},
  onGenerateSummary = () => {},
  onSaveSummary = () => {},
  onClose = () => {},
}: AISummaryModalProps) => {
  const [activeTab, setActiveTab] = useState("generate");
  const [prompt, setPrompt] = useState("");
  const [modelType, setModelType] = useState("gpt-4");
  const [summaryType, setSummaryType] = useState("comprehensive");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [generatedTreatment, setGeneratedTreatment] = useState("");
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedTreatment, setCopiedTreatment] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);

    // Simulate AI generation with a timeout
    setTimeout(() => {
      const summary = generateMockSummary(patientName, summaryType);
      const treatment = generateMockTreatment(patientName, summaryType);

      setGeneratedSummary(summary);
      setGeneratedTreatment(treatment);
      setIsGenerating(false);
      setActiveTab("review");

      onGenerateSummary(prompt, { modelType, summaryType });
    }, 2000);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generatedSummary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopyTreatment = () => {
    navigator.clipboard.writeText(generatedTreatment);
    setCopiedTreatment(true);
    setTimeout(() => setCopiedTreatment(false), 2000);
  };

  const handleSave = async () => {
    try {
      // Save the summary to Supabase using the edge function
      const { supabase } = await import("@/lib/supabase");

      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-save-patient-summary",
        {
          body: {
            patientId: patientId,
            summary: generatedSummary,
            status: "active",
          },
        },
      );

      if (error) throw error;

      // Call the onSaveSummary callback with the generated summary
      onSaveSummary(generatedSummary);
      onClose();
    } catch (error) {
      console.error("Error saving summary:", error);
      // You could add error handling UI here
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Summary Generator
          </DialogTitle>
          <DialogDescription>
            Generate comprehensive patient summaries and treatment
            recommendations using AI
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate" disabled={isGenerating}>
              <Wand2 className="h-4 w-4 mr-2" /> Generate
            </TabsTrigger>
            <TabsTrigger value="review" disabled={!generatedSummary}>
              <FileText className="h-4 w-4 mr-2" /> Review & Edit
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="generate" className="p-4 h-full">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      AI Model
                    </label>
                    <Select value={modelType} onValueChange={setModelType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select AI model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">
                          GPT-4 (Recommended)
                        </SelectItem>
                        <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude">Claude 2</SelectItem>
                        <SelectItem value="med-llama">MedLLaMA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Summary Type
                    </label>
                    <Select value={summaryType} onValueChange={setSummaryType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select summary type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprehensive">
                          Comprehensive
                        </SelectItem>
                        <SelectItem value="concise">Concise</SelectItem>
                        <SelectItem value="specialist">
                          Specialist Referral
                        </SelectItem>
                        <SelectItem value="patient-friendly">
                          Patient-Friendly
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Customize Prompt
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt for the AI..."
                    className="min-h-[150px]"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Customize the prompt to focus on specific aspects of the
                    patient's condition or history.
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">
                    Available Patient Data
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <Badge variant="outline" className="justify-start">
                      <Check className="h-3 w-3 mr-1 text-green-500" /> Medical
                      History
                    </Badge>
                    <Badge variant="outline" className="justify-start">
                      <Check className="h-3 w-3 mr-1 text-green-500" /> Recent
                      Visits
                    </Badge>
                    <Badge variant="outline" className="justify-start">
                      <Check className="h-3 w-3 mr-1 text-green-500" /> Current
                      Medications
                    </Badge>
                    <Badge variant="outline" className="justify-start">
                      <Check className="h-3 w-3 mr-1 text-green-500" /> Lab
                      Results
                    </Badge>
                    <Badge variant="outline" className="justify-start">
                      <Check className="h-3 w-3 mr-1 text-green-500" /> Vital
                      Signs
                    </Badge>
                    <Badge variant="outline" className="justify-start">
                      <X className="h-3 w-3 mr-1 text-red-500" /> Imaging
                      Reports
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Generate Summary
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="review" className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 h-full">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Patient Summary</CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleCopySummary}
                            >
                              {copiedSummary ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {copiedSummary ? "Copied!" : "Copy to clipboard"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <CardDescription>
                      AI-generated summary of patient's condition and history
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto">
                    <Textarea
                      value={generatedSummary}
                      onChange={(e) => setGeneratedSummary(e.target.value)}
                      className="min-h-[300px] h-full resize-none"
                    />
                  </CardContent>
                </Card>

                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        Treatment Recommendations
                      </CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleCopyTreatment}
                            >
                              {copiedTreatment ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {copiedTreatment ? "Copied!" : "Copy to clipboard"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <CardDescription>
                      AI-suggested treatment plan based on patient data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto">
                    <Textarea
                      value={generatedTreatment}
                      onChange={(e) => setGeneratedTreatment(e.target.value)}
                      className="min-h-[300px] h-full resize-none"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="flex justify-between items-center border-t p-4">
          <div className="flex items-center">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20"
            >
              <Brain className="h-3 w-3 mr-1" /> AI-Generated
            </Badge>
            <span className="text-xs text-muted-foreground ml-2">
              Review and edit before saving to patient record
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!generatedSummary || activeTab !== "review"}
            >
              <Download className="h-4 w-4 mr-2" />
              Save to Patient Record
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper functions to generate mock data
const generateMockSummary = (patientName: string, type: string) => {
  if (type === "comprehensive") {
    return `Patient ${patientName} is a 42-year-old female with a history of hypertension and Type 2 diabetes. Recent lab work shows elevated HbA1c levels (7.8%) and borderline high cholesterol (LDL 145 mg/dL). Blood pressure during the most recent visit was 142/88 mmHg, indicating suboptimal control. Patient reports increased fatigue and occasional blurred vision over the past month. Current medications include Lisinopril 10mg daily and Metformin 500mg twice daily. Patient has been compliant with medication but admits to inconsistent dietary adherence and minimal exercise. Family history is significant for cardiovascular disease and diabetes.`;
  } else if (type === "concise") {
    return `42F with HTN and T2DM. Recent labs: HbA1c 7.8%, LDL 145 mg/dL. BP 142/88 mmHg. Reports fatigue and blurred vision. Medications: Lisinopril 10mg QD, Metformin 500mg BID. Medication adherence good, diet/exercise poor. FH: CVD, DM.`;
  } else if (type === "specialist") {
    return `I am referring ${patientName}, a 42-year-old female with poorly controlled hypertension (142/88 mmHg) and Type 2 diabetes (HbA1c 7.8%) despite current management with Lisinopril 10mg daily and Metformin 500mg BID. Patient reports worsening fatigue and intermittent blurred vision. Lipid panel shows elevated LDL (145 mg/dL). Family history significant for premature cardiovascular disease. Requesting endocrinology consultation for optimization of diabetes management and cardiovascular risk assessment.`;
  } else {
    return `${patientName}, we've reviewed your recent health information and noticed a few things we should discuss. Your blood sugar levels are running a bit higher than our target, and your blood pressure is also slightly elevated. The symptoms you mentioned - feeling tired and sometimes having blurry vision - might be related to these readings. Your current medications are helping, but we may need to adjust them or discuss some lifestyle changes to help you feel better and prevent complications. Let's talk about some simple steps that might make a big difference in how you feel day-to-day.`;
  }
};

const generateMockTreatment = (patientName: string, type: string) => {
  if (type === "comprehensive" || type === "specialist") {
    return `1. Medication Adjustments:
   - Increase Lisinopril to 20mg daily to improve blood pressure control
   - Continue Metformin 500mg BID
   - Add Empagliflozin 10mg daily to improve glycemic control and provide cardiovascular benefit
   - Consider starting Atorvastatin 20mg daily for hyperlipidemia

2. Monitoring:
   - Home blood pressure monitoring daily, target <130/80 mmHg
   - Blood glucose monitoring BID, fasting and 2 hours post-dinner
   - Follow-up labs in 3 months: HbA1c, comprehensive metabolic panel, lipid panel
   - Ophthalmology referral for diabetic retinopathy screening

3. Lifestyle Modifications:
   - Detailed nutrition plan with focus on low-sodium DASH diet
   - Structured exercise program: 30 minutes of moderate activity 5 days/week
   - Weight loss goal of 5-7% of body weight over 6 months

4. Follow-up:
   - Schedule endocrinology consultation within 1 month
   - Return for primary care follow-up in 6 weeks`;
  } else if (type === "concise") {
    return `1. Meds: ↑ Lisinopril to 20mg QD, continue Metformin, add Empagliflozin 10mg QD, start Atorvastatin 20mg QD
2. Monitor: Daily BP, BID glucose, labs in 3mo, eye exam
3. Lifestyle: DASH diet, exercise 30min x5/wk, 5-7% weight loss
4. F/U: Endo 1mo, PCP 6wks`;
  } else {
    return `Here's our plan to help you feel better, ${patientName}:

1. We're going to slightly increase your blood pressure medication and add a new diabetes medication that can help your heart too.

2. Let's track your blood pressure at home and check your blood sugar levels twice a day to see how these changes are working.

3. Small changes to your diet can make a big difference - I'll connect you with our nutritionist to create a simple meal plan that works for your lifestyle.

4. Adding just a short 30-minute walk most days can improve your energy levels and help both your blood pressure and blood sugar.

5. We'll check in again in about 6 weeks to see how you're feeling and if we need to make any adjustments.

Does this plan sound manageable for you?`;
  }
};

export default AISummaryModal;
