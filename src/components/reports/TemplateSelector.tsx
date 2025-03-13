import React, { useState } from "react";
import { Check, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: "general" | "specialist" | "lab" | "treatment";
}

interface TemplateSelectorProps {
  onSelectTemplate?: (templateId: string) => void;
  templates?: Template[];
  selectedTemplateId?: string;
}

const TemplateSelector = ({
  onSelectTemplate = () => {},
  templates: providedTemplates,
  selectedTemplateId = "",
}: TemplateSelectorProps) => {
  // Default templates if none are provided
  const defaultTemplates: Template[] = [
    {
      id: "template-1",
      name: "General Medical Report",
      description: "Standard medical report template for general consultations",
      thumbnail:
        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=300&q=80",
      category: "general",
    },
    {
      id: "template-2",
      name: "Specialist Consultation",
      description:
        "Detailed template for specialist consultations and findings",
      thumbnail:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&q=80",
      category: "specialist",
    },
    {
      id: "template-3",
      name: "Lab Results Summary",
      description: "Template for summarizing laboratory test results",
      thumbnail:
        "https://images.unsplash.com/photo-1579165466741-7f35e4755183?w=300&q=80",
      category: "lab",
    },
    {
      id: "template-4",
      name: "Treatment Plan",
      description: "Comprehensive template for outlining treatment plans",
      thumbnail:
        "https://images.unsplash.com/photo-1576671081837-49000212a370?w=300&q=80",
      category: "treatment",
    },
    {
      id: "template-5",
      name: "Follow-up Report",
      description: "Template for documenting follow-up appointments",
      thumbnail:
        "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=300&q=80",
      category: "general",
    },
  ];

  const templates = providedTemplates || defaultTemplates;
  const [selected, setSelected] = useState<string>(selectedTemplateId);
  const [filter, setFilter] = useState<string>("all");

  const filteredTemplates =
    filter === "all"
      ? templates
      : templates.filter((template) => template.category === filter);

  const handleSelectTemplate = (templateId: string) => {
    setSelected(templateId);
    onSelectTemplate(templateId);
  };

  return (
    <div className="w-full bg-white p-4 rounded-md">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Select a Report Template</h3>
        <p className="text-sm text-gray-500">
          Choose a template as a starting point for your report. You can
          customize it further in the next step.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All Templates
        </Button>
        <Button
          variant={filter === "general" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("general")}
        >
          General
        </Button>
        <Button
          variant={filter === "specialist" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("specialist")}
        >
          Specialist
        </Button>
        <Button
          variant={filter === "lab" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("lab")}
        >
          Lab Results
        </Button>
        <Button
          variant={filter === "treatment" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("treatment")}
        >
          Treatment Plans
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${selected === template.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => handleSelectTemplate(template.id)}
          >
            <div className="relative">
              <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {selected === template.id && (
                <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {template.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 border border-dashed rounded-md">
          <FileText className="h-10 w-10 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No templates found for this category</p>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
