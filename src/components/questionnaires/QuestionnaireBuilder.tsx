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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Temporary mock implementations until react-beautiful-dnd is properly loaded
const DragDropContext = ({ children, onDragEnd }: any) => children;
const Droppable = ({ children, droppableId, type }: any) =>
  children({
    innerRef: () => {},
    droppableProps: {},
    placeholder: null,
  });
const Draggable = ({ children, draggableId, index, isDragDisabled }: any) =>
  children({
    innerRef: () => {},
    draggableProps: {},
    dragHandleProps: {},
  });
type DropResult = any;

import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  Save,
  FileText,
  CheckSquare,
  ListChecks,
  AlignLeft,
  Calendar,
  ToggleLeft,
  Type,
  Eye,
  Download,
  Upload,
  RotateCcw,
} from "lucide-react";

type QuestionType =
  | "text"
  | "textarea"
  | "checkbox"
  | "radio"
  | "select"
  | "date"
  | "number";

interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

interface Question {
  id: string;
  type: QuestionType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: QuestionOption[];
  description?: string;
}

interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

interface QuestionnaireBuilderProps {
  onSave?: (questionnaire: {
    title: string;
    description: string;
    sections: Section[];
  }) => void;
  initialQuestionnaire?: {
    title: string;
    description: string;
    sections: Section[];
  };
}

const QuestionnaireBuilder: React.FC<QuestionnaireBuilderProps> = ({
  onSave = () => {},
  initialQuestionnaire = {
    title: "New Questionnaire",
    description: "Please fill out this questionnaire",
    sections: [
      {
        id: "section-1",
        title: "General Information",
        description: "Basic patient information",
        questions: [],
      },
    ],
  },
}) => {
  const [questionnaire, setQuestionnaire] = useState(initialQuestionnaire);
  const [activeSection, setActiveSection] = useState(
    questionnaire.sections[0].id,
  );
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleAddSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: `New Section ${questionnaire.sections.length + 1}`,
      description: "",
      questions: [],
    };

    setQuestionnaire({
      ...questionnaire,
      sections: [...questionnaire.sections, newSection],
    });

    setActiveSection(newSection.id);
  };

  const handleUpdateSection = (
    sectionId: string,
    updates: Partial<Section>,
  ) => {
    setQuestionnaire({
      ...questionnaire,
      sections: questionnaire.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section,
      ),
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    const newSections = questionnaire.sections.filter(
      (section) => section.id !== sectionId,
    );

    setQuestionnaire({
      ...questionnaire,
      sections: newSections,
    });

    if (newSections.length > 0 && activeSection === sectionId) {
      setActiveSection(newSections[0].id);
    } else if (newSections.length === 0) {
      const newSection: Section = {
        id: `section-${Date.now()}`,
        title: "General Information",
        description: "",
        questions: [],
      };
      setQuestionnaire({
        ...questionnaire,
        sections: [newSection],
      });
      setActiveSection(newSection.id);
    }
  };

  const handleAddQuestion = (type: QuestionType) => {
    const section = questionnaire.sections.find((s) => s.id === activeSection);
    if (!section) return;

    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Question`,
      required: false,
      placeholder: "",
    };

    if (type === "checkbox" || type === "radio" || type === "select") {
      newQuestion.options = [
        { id: `option-${Date.now()}-1`, label: "Option 1", value: "option1" },
        { id: `option-${Date.now()}-2`, label: "Option 2", value: "option2" },
      ];
    }

    setQuestionnaire({
      ...questionnaire,
      sections: questionnaire.sections.map((s) =>
        s.id === activeSection
          ? { ...s, questions: [...s.questions, newQuestion] }
          : s,
      ),
    });

    setEditingQuestion(newQuestion);
  };

  const handleUpdateQuestion = (
    questionId: string,
    updates: Partial<Question>,
  ) => {
    setQuestionnaire({
      ...questionnaire,
      sections: questionnaire.sections.map((section) => {
        if (section.id === activeSection) {
          return {
            ...section,
            questions: section.questions.map((question) =>
              question.id === questionId
                ? { ...question, ...updates }
                : question,
            ),
          };
        }
        return section;
      }),
    });

    if (editingQuestion && editingQuestion.id === questionId) {
      setEditingQuestion({ ...editingQuestion, ...updates });
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestionnaire({
      ...questionnaire,
      sections: questionnaire.sections.map((section) => {
        if (section.id === activeSection) {
          return {
            ...section,
            questions: section.questions.filter((q) => q.id !== questionId),
          };
        }
        return section;
      }),
    });

    if (editingQuestion && editingQuestion.id === questionId) {
      setEditingQuestion(null);
    }
  };

  const handleDuplicateQuestion = (questionId: string) => {
    const section = questionnaire.sections.find((s) => s.id === activeSection);
    if (!section) return;

    const questionToDuplicate = section.questions.find(
      (q) => q.id === questionId,
    );
    if (!questionToDuplicate) return;

    const duplicatedQuestion: Question = {
      ...questionToDuplicate,
      id: `question-${Date.now()}`,
      label: `${questionToDuplicate.label} (Copy)`,
      options: questionToDuplicate.options
        ? questionToDuplicate.options.map((opt) => ({
            ...opt,
            id: `option-${Date.now()}-${opt.value}`,
          }))
        : undefined,
    };

    setQuestionnaire({
      ...questionnaire,
      sections: questionnaire.sections.map((s) =>
        s.id === activeSection
          ? { ...s, questions: [...s.questions, duplicatedQuestion] }
          : s,
      ),
    });
  };

  const handleAddOption = (questionId: string) => {
    const section = questionnaire.sections.find((s) => s.id === activeSection);
    if (!section) return;

    const question = section.questions.find((q) => q.id === questionId);
    if (!question || !question.options) return;

    const newOption: QuestionOption = {
      id: `option-${Date.now()}`,
      label: `Option ${question.options.length + 1}`,
      value: `option${question.options.length + 1}`,
    };

    handleUpdateQuestion(questionId, {
      options: [...question.options, newOption],
    });
  };

  const handleUpdateOption = (
    questionId: string,
    optionId: string,
    updates: Partial<QuestionOption>,
  ) => {
    const section = questionnaire.sections.find((s) => s.id === activeSection);
    if (!section) return;

    const question = section.questions.find((q) => q.id === questionId);
    if (!question || !question.options) return;

    handleUpdateQuestion(questionId, {
      options: question.options.map((option) =>
        option.id === optionId ? { ...option, ...updates } : option,
      ),
    });
  };

  const handleDeleteOption = (questionId: string, optionId: string) => {
    const section = questionnaire.sections.find((s) => s.id === activeSection);
    if (!section) return;

    const question = section.questions.find((q) => q.id === questionId);
    if (!question || !question.options) return;

    if (question.options.length <= 2) {
      alert("You must have at least two options");
      return;
    }

    handleUpdateQuestion(questionId, {
      options: question.options.filter((option) => option.id !== optionId),
    });
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "sections") {
      const newSections = Array.from(questionnaire.sections);
      const [removed] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, removed);

      setQuestionnaire({
        ...questionnaire,
        sections: newSections,
      });
      return;
    }

    if (type === "questions") {
      const section = questionnaire.sections.find(
        (s) => s.id === activeSection,
      );
      if (!section) return;

      const newQuestions = Array.from(section.questions);
      const [removed] = newQuestions.splice(source.index, 1);
      newQuestions.splice(destination.index, 0, removed);

      setQuestionnaire({
        ...questionnaire,
        sections: questionnaire.sections.map((s) =>
          s.id === activeSection ? { ...s, questions: newQuestions } : s,
        ),
      });
    }
  };

  const handleSaveQuestionnaire = () => {
    onSave(questionnaire);
  };

  const currentSection = questionnaire.sections.find(
    (s) => s.id === activeSection,
  );

  const renderQuestionPreview = (question: Question) => {
    switch (question.type) {
      case "text":
        return (
          <Input
            placeholder={question.placeholder || "Enter text"}
            disabled={previewMode}
          />
        );
      case "textarea":
        return (
          <Textarea
            placeholder={question.placeholder || "Enter longer text"}
            disabled={previewMode}
          />
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox id={option.id} disabled={previewMode} />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </div>
        );
      case "radio":
        return (
          <RadioGroup disabled={previewMode}>
            {question.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.id} />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "select":
        return (
          <Select disabled={previewMode}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "date":
        return <Input type="date" disabled={previewMode} />;
      case "number":
        return (
          <Input
            type="number"
            placeholder={question.placeholder || "Enter a number"}
            disabled={previewMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Questionnaire Builder</h1>
          <p className="text-gray-500">
            Create and customize questionnaires for your patients
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? "Edit Mode" : "Preview Mode"}
          </Button>
          <Button onClick={handleSaveQuestionnaire}>
            <Save className="h-4 w-4 mr-2" />
            Save Questionnaire
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Questionnaire Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={questionnaire.title}
                  onChange={(e) =>
                    setQuestionnaire({
                      ...questionnaire,
                      title: e.target.value,
                    })
                  }
                  disabled={previewMode}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={questionnaire.description}
                  onChange={(e) =>
                    setQuestionnaire({
                      ...questionnaire,
                      description: e.target.value,
                    })
                  }
                  disabled={previewMode}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Sections</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections" type="sections">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-1 p-4"
                    >
                      {questionnaire.sections.map((section, index) => (
                        <Draggable
                          key={section.id}
                          draggableId={section.id}
                          index={index}
                          isDragDisabled={previewMode}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center p-2 rounded-md ${activeSection === section.id ? "bg-primary/10" : "hover:bg-gray-100"} cursor-pointer`}
                              onClick={() => setActiveSection(section.id)}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="mr-2 text-gray-400"
                              >
                                <GripVertical className="h-4 w-4" />
                              </div>
                              <div className="flex-1 truncate">
                                {section.title}
                              </div>
                              {!previewMode &&
                                questionnaire.sections.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-gray-400 hover:text-red-500"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteSection(section.id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              {!previewMode && (
                <div className="p-4 pt-0">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleAddSection}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {!previewMode && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Question Types</CardTitle>
                <CardDescription>
                  Drag and drop or click to add questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAddQuestion("text")}
                  >
                    <Type className="h-4 w-4 mr-2" />
                    Text
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAddQuestion("textarea")}
                  >
                    <AlignLeft className="h-4 w-4 mr-2" />
                    Textarea
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAddQuestion("checkbox")}
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Checkbox
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAddQuestion("radio")}
                  >
                    <ListChecks className="h-4 w-4 mr-2" />
                    Radio
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAddQuestion("select")}
                  >
                    <ListChecks className="h-4 w-4 mr-2" />
                    Select
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAddQuestion("date")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Date
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start col-span-2"
                    onClick={() => handleAddQuestion("number")}
                  >
                    <Type className="h-4 w-4 mr-2" />
                    Number
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Questionnaire
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Questionnaire
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{currentSection?.title || "Section"}</CardTitle>
                  <CardDescription>
                    {currentSection?.description || "Section description"}
                  </CardDescription>
                </div>
                {!previewMode && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const title = prompt(
                          "Enter section title",
                          currentSection?.title,
                        );
                        if (title) {
                          handleUpdateSection(activeSection, { title });
                        }
                      }}
                    >
                      Edit Title
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const description = prompt(
                          "Enter section description",
                          currentSection?.description,
                        );
                        handleUpdateSection(activeSection, { description });
                      }}
                    >
                      Edit Description
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {currentSection && (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="questions" type="questions">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-6"
                      >
                        {currentSection.questions.length === 0 ? (
                          <div className="text-center py-8 border-2 border-dashed rounded-md">
                            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                            <h3 className="text-lg font-medium">
                              No questions in this section
                            </h3>
                            <p className="text-gray-500 mb-4">
                              Add questions from the sidebar to get started
                            </p>
                            {!previewMode && (
                              <Button
                                variant="outline"
                                onClick={() => handleAddQuestion("text")}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Question
                              </Button>
                            )}
                          </div>
                        ) : (
                          currentSection.questions.map((question, index) => (
                            <Draggable
                              key={question.id}
                              draggableId={question.id}
                              index={index}
                              isDragDisabled={previewMode}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="border rounded-md p-4 bg-white"
                                >
                                  <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                      {!previewMode && (
                                        <div
                                          {...provided.dragHandleProps}
                                          className="mr-2 text-gray-400"
                                        >
                                          <GripVertical className="h-5 w-5" />
                                        </div>
                                      )}
                                      <div>
                                        <h3 className="text-lg font-medium flex items-center">
                                          {question.label}
                                          {question.required && (
                                            <span className="text-red-500 ml-1">
                                              *
                                            </span>
                                          )}
                                        </h3>
                                        {question.description && (
                                          <p className="text-gray-500 text-sm">
                                            {question.description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    {!previewMode && (
                                      <div className="flex space-x-1">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() =>
                                            setEditingQuestion(question)
                                          }
                                        >
                                          <FileText className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() =>
                                            handleDuplicateQuestion(question.id)
                                          }
                                        >
                                          <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-red-500"
                                          onClick={() =>
                                            handleDeleteQuestion(question.id)
                                          }
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-7">
                                    {renderQuestionPreview(question)}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Question editing dialog */}
      <Dialog
        open={!!editingQuestion}
        onOpenChange={(open) => {
          if (!open) setEditingQuestion(null);
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
              Customize your question properties and options
            </DialogDescription>
          </DialogHeader>

          {editingQuestion && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="question-label" className="text-right">
                  Label
                </Label>
                <Input
                  id="question-label"
                  className="col-span-3"
                  value={editingQuestion.label}
                  onChange={(e) =>
                    handleUpdateQuestion(editingQuestion.id, {
                      label: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="question-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="question-description"
                  className="col-span-3"
                  value={editingQuestion.description || ""}
                  onChange={(e) =>
                    handleUpdateQuestion(editingQuestion.id, {
                      description: e.target.value,
                    })
                  }
                  placeholder="Optional description"
                />
              </div>

              {(editingQuestion.type === "text" ||
                editingQuestion.type === "textarea" ||
                editingQuestion.type === "number") && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="question-placeholder" className="text-right">
                    Placeholder
                  </Label>
                  <Input
                    id="question-placeholder"
                    className="col-span-3"
                    value={editingQuestion.placeholder || ""}
                    onChange={(e) =>
                      handleUpdateQuestion(editingQuestion.id, {
                        placeholder: e.target.value,
                      })
                    }
                    placeholder="Optional placeholder text"
                  />
                </div>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">Required</div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="question-required"
                    checked={editingQuestion.required}
                    onCheckedChange={(checked) =>
                      handleUpdateQuestion(editingQuestion.id, {
                        required: !!checked,
                      })
                    }
                  />
                  <Label htmlFor="question-required">
                    Make this question required
                  </Label>
                </div>
              </div>

              {(editingQuestion.type === "checkbox" ||
                editingQuestion.type === "radio" ||
                editingQuestion.type === "select") && (
                <div className="grid grid-cols-4 gap-4">
                  <Label className="text-right pt-2">Options</Label>
                  <div className="col-span-3 space-y-2">
                    {editingQuestion.options?.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <Input
                          value={option.label}
                          onChange={(e) =>
                            handleUpdateOption(editingQuestion.id, option.id, {
                              label: e.target.value,
                              value: e.target.value
                                .toLowerCase()
                                .replace(/\s+/g, "-"),
                            })
                          }
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() =>
                            handleDeleteOption(editingQuestion.id, option.id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddOption(editingQuestion.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingQuestion(null)}>
              Cancel
            </Button>
            <Button onClick={() => setEditingQuestion(null)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionnaireBuilder;
