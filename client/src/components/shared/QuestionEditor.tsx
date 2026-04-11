"use client";
// Question editor used in the employer exam creation flow.
// Supports radio, checkbox, and text question types for the assessment client.

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
// Imports reusable UI.
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
import { RichTextEditor } from "./RichTextEditor";
import { questionSchema, type QuestionForm } from "@/schemas/question.schema";

interface QuestionEditorProps {
  onSave: (question: Question) => void;
  onSaveAndAddMore?: (question: Question) => void;
  initialData?: Question;
}

// Builds and validates question data before saving it into an exam.
export const QuestionEditor = ({
  onSave,
  onSaveAndAddMore,
  initialData,
}: QuestionEditorProps) => {
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
  const [textAnswer, setTextAnswer] = useState("");
  const [saveMode, setSaveMode] = useState<"save" | "saveAndAddMore">("save");

  const methods = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: initialData?.title || "",
      type: initialData?.type || "radio",
      points: String(initialData?.points || 1),
    },
  });

  // Hydrates editor state when an existing question is opened for editing.
  useEffect(() => {
    if (initialData) {
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
      setTextAnswer("");
    }
  }, [initialData, methods]);

  // Updates the selected correct answer based on the active question type.
  const toggleCorrectAnswer = (option: string) => {
    if (questionType === "radio") {
      setCorrectAnswers([option]);
    } else {
      setCorrectAnswers((currentCorrectAnswers) =>
        currentCorrectAnswers.includes(option)
          ? currentCorrectAnswers.filter((answer) => answer !== option)
          : [...currentCorrectAnswers, option],
      );
    }
  };

  // Transforms validated form data into the exam question model.
  const buildQuestion = (data: QuestionForm): Question => ({
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
  });

  // Resets editor state so the employer can add another question quickly.
  const resetForNextQuestion = () => {
    methods.reset({
      title: "",
      type: "radio",
      points: "1",
    });
    setQuestionType("radio");
    setOptions(["", ""]);
    setCorrectAnswers([]);
    setTextAnswer("");
    setSaveMode("save");
  };

  // Removes an answer option while keeping at least one editable option available.
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
      currentCorrectAnswers.filter((answer) => answer !== removedOption),
    );
  };

  // Persists the current question and decides whether the editor should reset or close.
  const handleSubmit = methods.handleSubmit((data) => {
    const question: Question = {
      ...buildQuestion(data),
    };

    if (saveMode === "saveAndAddMore" && onSaveAndAddMore && !initialData) {
      onSaveAndAddMore(question);
      resetForNextQuestion();
      return;
    }

    onSave(question);
  });

  return (
    <div className="rounded-[14px] border border-[#e7edf5] bg-white px-5 py-4 shadow-none sm:px-7 sm:py-5">
      <div className="mb-4 flex flex-col gap-3 border-b border-[#edf1f7] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-[12px] font-semibold text-[#334155]">
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#cbd5e1] text-[10px]">
            {initialData ? "E" : "1"}
          </span>
          <span>{initialData ? "Edit Question" : "Question 1"}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-[#475569]">
            <span>Score:</span>
            <Input
              {...methods.register("points")}
              type="number"
              min="1"
              className="h-7 w-[48px] rounded-[6px] border-[#e2e8f0] px-2 text-center text-[11px]"
            />
          </div>
          <Select
            value={questionType}
            onValueChange={(value) => {
              setQuestionType(value as QuestionType);
              methods.setValue("type", value as QuestionType);
              setCorrectAnswers([]);
            }}
          >
            <SelectTrigger className="h-7 w-[86px] rounded-[6px] border-[#e2e8f0] px-2 text-[11px] text-[#334155]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="radio">Radio</SelectItem>
              <SelectItem value="checkbox">Checkbox</SelectItem>
              <SelectItem value="text">Text</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="-mx-1 sm:-mx-2">
              <RichTextEditor
                content={methods.getValues("title")}
                onChange={(value) =>
                  methods.setValue("title", value, { shouldValidate: true })
                }
                placeholder="Enter question..."
                minHeight="96px"
              />
            </div>
            {methods.formState.errors.title && (
              <p className="text-xs text-destructive">
                {methods.formState.errors.title.message}
              </p>
            )}
          </div>

          {methods.formState.errors.points && (
            <p className="text-xs text-destructive">
              {methods.formState.errors.points.message}
            </p>
          )}

          {questionType !== "text" && (
            <div className="space-y-3">
              <Label className="text-[12px] font-medium text-[#475569]">
                Options
              </Label>
              {options.map((option, optionIndex) => (
                <div key={optionIndex} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#cbd5e1] text-[9px] font-medium text-[#64748b]">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <label className="flex items-center gap-2 text-[11px] text-[#64748b]">
                        <input
                          type={questionType === "radio" ? "radio" : "checkbox"}
                          checked={correctAnswers.includes(option) && !!option}
                          onChange={() => option && toggleCorrectAnswer(option)}
                          className="h-3.5 w-3.5 rounded border-[#cbd5e1] text-primary focus:ring-primary"
                        />
                        Set as correct answer
                      </label>
                    </div>
                    <button
                      type="button"
                      className="rounded-[6px] p-1.5 text-[#94a3b8] transition-colors hover:bg-[#f8fafc] hover:text-[#ef4444]"
                      onClick={() => removeOption(optionIndex)}
                      aria-label={`Delete option ${String.fromCharCode(
                        65 + optionIndex,
                      )}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="rounded-[10px] border border-[#edf1f7] bg-white">
                    <RichTextEditor
                      content={option}
                      onChange={(value) => {
                        const previousOption = options[optionIndex];
                        const updated = [...options];
                        updated[optionIndex] = value;
                        setOptions(updated);
                        if (correctAnswers.includes(previousOption)) {
                          setCorrectAnswers((currentCorrectAnswers) =>
                            currentCorrectAnswers.map((answer) =>
                              answer === previousOption ? value : answer,
                            ),
                          );
                        }
                      }}
                      placeholder={`Option ${String.fromCharCode(
                        65 + optionIndex,
                      )}`}
                      minHeight="84px"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setOptions([...options, ""])}
                className="inline-flex items-center gap-1 text-[12px] font-medium  hover:underline"
              >
                <Plus className="h-3 w-3 text-primary" />
                Another options
              </button>
            </div>
          )}

          {questionType === "text" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#cbd5e1] text-[9px] font-medium text-[#64748b]">
                  A
                </span>
                <button
                  type="button"
                  className="rounded-[6px] p-1.5 text-[#94a3b8] transition-colors hover:bg-[#f8fafc] hover:text-[#ef4444]"
                  onClick={() => setTextAnswer("")}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="rounded-[10px] border border-[#edf1f7] bg-white">
                <RichTextEditor
                  content={textAnswer}
                  onChange={(value) => setTextAnswer(value)}
                  placeholder="Enter sample answer..."
                  minHeight="96px"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-[#edf1f7] pt-4">
            <Button
              type="submit"
              onClick={() => setSaveMode("save")}
              className="h-[34px] min-w-[94px] rounded-[8px] border border-primary bg-white px-6 text-[12px] font-medium text-primary shadow-none hover:bg-primary/5"
            >
              Save
            </Button>
            <Button
              type="submit"
              onClick={() => setSaveMode("saveAndAddMore")}
              className="h-[34px] min-w-[126px] rounded-[8px] bg-primary px-5 text-[12px] font-medium text-primary-foreground shadow-none hover:bg-primary/90"
            >
              {initialData ? "Update Question" : "Save & Add More"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
