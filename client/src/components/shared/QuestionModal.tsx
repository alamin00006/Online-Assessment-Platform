"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
// Imports reusable UI.
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Question, QuestionType } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { questionSchema } from "@/schemas/question.schema";

interface QuestionModalProps {
  onSave: (question: Question) => void;
  initialData?: Question;
  trigger?: React.ReactNode;
}

// Displays the modal shell for creating and editing exam questions.
export const QuestionModal = ({
  onSave,
  initialData,
  trigger,
}: QuestionModalProps) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<string[]>(
    initialData?.options || ["", ""],
  );
  const [correctAnswers, setCorrectAnswers] = useState<string[]>(
    initialData?.correctAnswer
      ? Array.isArray(initialData.correctAnswer)
        ? initialData.correctAnswer
        : [initialData.correctAnswer]
      : [],
  );
  const [questionType, setQuestionType] = useState<QuestionType>(
    initialData?.type || "radio",
  );

  const methods = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: initialData?.title || "",
      type: initialData?.type || "radio",
      points: String(initialData?.points || 1),
    },
  });

  // Hydrates modal form state when editing an existing question.
  useEffect(() => {
    if (open && initialData) {
      methods.reset({
        title: initialData.title,
        type: initialData.type,
        points: String(initialData.points || 1),
      });
      setOptions(initialData.options || ["", ""]);
      setQuestionType(initialData.type);
      setCorrectAnswers(
        initialData.correctAnswer
          ? Array.isArray(initialData.correctAnswer)
            ? initialData.correctAnswer
            : [initialData.correctAnswer]
          : [],
      );
    }
  }, [open, initialData, methods]);

  // Updates the modal correct-answer state for radio and checkbox questions.
  const toggleCorrectAnswer = (option: string) => {
    if (questionType === "radio") {
      setCorrectAnswers([option]);
    } else {
      setCorrectAnswers((currentCorrectAnswers) =>
        currentCorrectAnswers.includes(option)
          ? currentCorrectAnswers.filter((answerId) => answerId !== option)
          : [...currentCorrectAnswers, option],
      );
    }
  };

  // Builds a question from modal form data and passes it back to the parent flow.
  const handleSubmit = methods.handleSubmit((data) => {
    const question: Question = {
      id: initialData?.id || `q-${Date.now()}`,
      title: data.title,
      type: data.type as QuestionType,
      points: parseInt(data.points, 10),
      ...(data.type !== "text"
        ? {
            options: options.filter(Boolean),
            correctAnswer:
              questionType === "radio" ? correctAnswers[0] : correctAnswers,
          }
        : {}),
    };
    onSave(question);
    setOpen(false);
    methods.reset({ title: "", type: "radio", points: "1" });
    setOptions(["", ""]);
    setCorrectAnswers([]);
    setQuestionType("radio");
  });

  // Removes an option while preventing the editor from becoming empty.
  const removeOption = (optionIndex: number) => {
    if (options.length <= 1) {
      toast.warning("At least one option is required.");
      return;
    }

    const removedOption = options[optionIndex];
    setOptions(
      options.filter(
        (_, currentOptionIndex) => currentOptionIndex !== optionIndex,
      ),
    );
    setCorrectAnswers((currentCorrectAnswers) =>
      currentCorrectAnswers.filter((answerId) => answerId !== removedOption),
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-semibold">
            Add Question
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        hideCloseButton
        className="max-w-2xl max-h-[90vh] flex flex-col p-0"
      >
        <DialogHeader className="border-b border-[#eef2f7] px-6 py-4 flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#f3f4f6] font-semibold text-[#334155] text-sm">
              {initialData ? "●" : "+"}
            </span>
            <DialogTitle className="text-lg font-semibold text-[#334155]">
              {initialData ? `Question ${initialData.id}` : "Add Question"}
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto scrollbar-custom">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-medium text-[#334155]">
                    Question
                  </Label>
                  <div className="border border-[#e2e8f0] rounded-lg overflow-hidden">
                    <Input
                      {...methods.register("title")}
                      placeholder="Enter your question here..."
                      className="border-0 focus-visible:ring-0 px-3 py-2.5 text-sm"
                    />
                  </div>
                  {methods.formState.errors.title && (
                    <p className="text-xs text-red-500">
                      {methods.formState.errors.title.message}
                    </p>
                  )}
                </div>
                <div className="w-20 space-y-2">
                  <Label className="text-sm font-medium text-[#334155]">
                    Score
                  </Label>
                  <Input
                    {...methods.register("points")}
                    type="number"
                    min="1"
                    placeholder="1"
                    className="border-[#e2e8f0] text-center font-semibold text-sm"
                  />
                  {methods.formState.errors.points && (
                    <p className="text-xs text-red-500">
                      {methods.formState.errors.points.message}
                    </p>
                  )}
                </div>
                <div className="w-32 space-y-2">
                  <Label className="text-sm font-medium text-[#334155]">
                    Type
                  </Label>
                  <Select
                    value={questionType}
                    onValueChange={(v) => {
                      setQuestionType(v as QuestionType);
                      methods.setValue("type", v as QuestionType);
                      setCorrectAnswers([]);
                    }}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="radio">MCQ</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {questionType !== "text" && (
                <div className="space-y-3 border-t pt-5">
                  <Label className="text-sm font-medium text-[#334155]">
                    Answer Options
                  </Label>
                  {options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="border border-[#edf1f7] rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#f3f4f6] font-semibold text-[#334155] text-sm flex-shrink-0">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <div className="flex-1">
                          <input
                            type="checkbox"
                            id={`correct-${optionIndex}`}
                            checked={
                              correctAnswers.includes(option) && !!option
                            }
                            onChange={() =>
                              option && toggleCorrectAnswer(option)
                            }
                            className="mr-2"
                          />
                          <label
                            htmlFor={`correct-${optionIndex}`}
                            className="text-xs font-medium text-[#64748b] cursor-pointer"
                          >
                            Set as correct answer
                          </label>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(optionIndex)}
                          className="h-8 w-8 text-[#ef4444]"
                          aria-label={`Delete option ${String.fromCharCode(
                            65 + optionIndex,
                          )}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="border border-[#e2e8f0] rounded-lg overflow-hidden">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const previousOption = options[optionIndex];
                            const updated = [...options];
                            updated[optionIndex] = e.target.value;
                            setOptions(updated);
                            if (correctAnswers.includes(previousOption)) {
                              setCorrectAnswers((currentCorrectAnswers) =>
                                currentCorrectAnswers.map((answerId) =>
                                  answerId === previousOption
                                    ? e.target.value
                                    : answerId,
                                ),
                              );
                            }
                          }}
                          placeholder={`Enter option text`}
                          className="border-0 focus-visible:ring-0 px-3 py-2.5 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setOptions([...options, ""])}
                    className="border-[#e2e8f0] text-primary hover:bg-[#f8fafc]"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Another options
                  </Button>
                </div>
              )}
              <div className="flex gap-3 pt-5 border-t border-[#eef2f7]">
                <Button
                  type="submit"
                  variant="outline"
                  className="flex-1 h-10 border-[#e2e8f0] text-[#475569] font-medium hover:bg-[#f8fafc]"
                >
                  Save
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-10 bg-primary text-primary-foreground font-medium hover:bg-primary/90"
                >
                  Save & Add More
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};
