"use client";

import { ReactNode, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  Check,
  CheckCircle2,
  Clock3,
  Loader2,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { EmployerLayout } from "@/components/EmployerLayout";
import { QuestionEditor } from "@/components/QuestionEditor";
import { api } from "@/services/api";
import { useAuthStore } from "@/stores/auth-store";
import { Question, QuestionSet } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const step1Schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  totalCandidates: z.string().min(1, "Required"),
  totalSlots: z.string().min(1, "Required"),
  questionType: z.string().min(1, "Required"),
  duration: z.string().min(1, "Required"),
  startTime: z.string().min(1, "Required"),
  endTime: z.string().min(1, "Required"),
});

type Step1Data = z.infer<typeof step1Schema>;

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-[12px] font-medium text-[#475569]">
        {label}
        {required ? <span className="ml-0.5 text-[#ef4444]">*</span> : null}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function Stepper({
  step,
  onStepClick,
  basicInfoSaved,
}: {
  step: number;
  onStepClick: (step: number) => void;
  basicInfoSaved: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-[12px]">
      <button
        type="button"
        onClick={() => onStepClick(1)}
        className="flex items-center gap-2 text-[#6d28d9]"
      >
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#6d4aff] text-[10px] font-semibold text-white">
          {basicInfoSaved ? <Check className="h-2.5 w-2.5" /> : "1"}
        </span>
        <span className="font-medium">Basic Info</span>
      </button>

      <div className="h-px w-8 bg-[#dbe2ea]" />

      <button
        type="button"
        onClick={() => onStepClick(2)}
        className={`flex items-center gap-2 ${
          step === 2 ? "text-[#6d28d9]" : "text-[#94a3b8]"
        }`}
      >
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold ${
            step === 2
              ? "bg-[#6d4aff] text-white"
              : "bg-[#e2e8f0] text-[#94a3b8]"
          }`}
        >
          {step === 2 ? <Check className="h-2.5 w-2.5" /> : "2"}
        </span>
        <span className="font-medium">Questions Sets</span>
      </button>
    </div>
  );
}

function QuestionDisplay({
  question,
  index,
  onEdit,
  onRemove,
}: {
  question: Question;
  index: number;
  onEdit: (question: Question) => void;
  onRemove: () => void;
}) {
  const correctAnswers = question.correctAnswer
    ? Array.isArray(question.correctAnswer)
      ? question.correctAnswer
      : [question.correctAnswer]
    : [];

  const typeLabel =
    question.type === "radio"
      ? "MCQ"
      : question.type === "checkbox"
        ? "Checkbox"
        : "Text";

  return (
    <div className="space-y-4 rounded-[12px] border border-[#edf1f7] bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#334155]">
          Question {index + 1}
        </span>
        <div className="flex items-center gap-2 text-[10px] text-[#94a3b8]">
          <span className="rounded-full border border-[#e2e8f0] px-2 py-0.5">
            {typeLabel}
          </span>
          <span className="rounded-full border border-[#e2e8f0] px-2 py-0.5">
            {question.points || 1} pt
          </span>
        </div>
      </div>

      <p className="text-[13px] font-semibold text-[#1e293b]">{question.title}</p>

      {question.type !== "text" && question.options && (
        <div className="space-y-2">
          {question.options.map((option, optionIndex) => {
            const isCorrect = correctAnswers.includes(option);

            return (
              <div
                key={optionIndex}
                className={`flex items-center gap-3 rounded-[6px] px-4 py-2.5 text-[12px] ${
                  isCorrect
                    ? "bg-[#f3f4f6]"
                    : "bg-white"
                }`}
              >
                <span className="font-medium text-[#64748b]">
                  {String.fromCharCode(65 + optionIndex)}.
                </span>
                <span className="flex-1 text-[#334155]">{option}</span>
                {isCorrect ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#22c55e]" />
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {question.type === "text" && (
        <div className="rounded-[8px] bg-[#f8fafc] p-4 text-[11px] leading-5 text-[#64748b]">
          Text answer field
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => onEdit(question)}
          className="text-[11px] font-medium text-[#6d28d9] hover:underline"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="text-[11px] font-medium text-[#ef4444] hover:underline"
        >
          Remove From Exam
        </button>
      </div>
    </div>
  );
}

export default function CreateExam() {
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [isViewMode, setIsViewMode] = useState(false);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([
    { id: `qs-${Date.now()}`, name: "Question Set 1", questions: [] },
  ]);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<{
    setId: string;
    question?: Question;
  } | null>(null);

  const methods = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      title: "",
      totalCandidates: "",
      totalSlots: "",
      questionType: "",
      duration: "",
      startTime: "",
      endTime: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const data = methods.getValues();

      return api.createExam(
        {
          title: data.title,
          totalCandidates: Number.parseInt(data.totalCandidates, 10),
          totalSlots: Number.parseInt(data.totalSlots, 10),
          duration: Number.parseInt(data.duration, 10),
          startTime: data.startTime,
          endTime: data.endTime,
          questionSets,
          negativeMarking,
        },
        user!.id,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employer-exams"] });
      toast.success("Exam created successfully!");
      router.push("/employer");
    },
    onError: () => toast.error("Failed to create exam"),
  });

  const addQuestion = useCallback((setId: string, question: Question) => {
    setQuestionSets((prev) =>
      prev.map((set) =>
        set.id === setId
          ? {
              ...set,
              questions: [
                ...set.questions.filter((item) => item.id !== question.id),
                question,
              ],
            }
          : set,
      ),
    );
  }, []);

  const deleteQuestion = useCallback((setId: string, questionId: string) => {
    setQuestionSets((prev) =>
      prev.map((set) =>
        set.id === setId
          ? {
              ...set,
              questions: set.questions.filter(
                (question) => question.id !== questionId,
              ),
            }
          : set,
      ),
    );
  }, []);

  const totalQuestions = questionSets.reduce(
    (sum, set) => sum + set.questions.length,
    0,
  );
  const values = methods.watch();
  const errors = methods.formState.errors;

  const goToStep = (targetStep: number) => {
    if (targetStep === 1) {
      setStep(1);
      return;
    }

    if (targetStep === 2 && isViewMode) {
      setStep(2);
    }
  };

  const handleSaveBasicInfo = async () => {
    const valid = await methods.trigger();
    if (!valid) return;

    setIsViewMode(true);
  };

  const handleContinueToQuestions = () => {
    setStep(2);
  };

  return (
    <EmployerLayout>
      <div className="mx-auto max-w-[1030px] space-y-6">
        <Card className="rounded-[12px] border border-[#e5ebf3] bg-white shadow-none">
          <CardContent className="space-y-6 p-5 sm:p-6">
            <div className="space-y-4">
              <h1 className="font-display text-[24px] font-semibold text-[#334155]">
                Manage Online Test
              </h1>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Stepper
                  step={step}
                  onStepClick={goToStep}
                  basicInfoSaved={isViewMode || step === 2}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/employer")}
                  className="h-[34px] rounded-[8px] border-[#e2e8f0] px-5 text-[12px] font-medium text-[#475569] hover:bg-[#f8fafc]"
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {step === 1 && !isViewMode && (
          <FormProvider {...methods}>
            <div className="mx-auto max-w-[720px] space-y-4 animate-fade-in">
              <Card className="rounded-[14px] border border-[#eef2f7] bg-white shadow-none">
                <CardContent className="space-y-5 p-5 sm:p-6">
                  <h2 className="font-display text-[22px] font-semibold text-[#334155]">
                    Basic Information
                  </h2>

                  <form className="space-y-4">
                    <FormField
                      label="Online Test Title"
                      required
                      error={errors.title?.message}
                    >
                      <Input
                        {...methods.register("title")}
                        placeholder="Enter online test title"
                        className="h-[42px] rounded-[8px] border-[#e2e8f0] text-sm placeholder:text-[#c0c7d4] focus-visible:ring-1 focus-visible:ring-[#6a3df6] focus-visible:ring-offset-0"
                      />
                    </FormField>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        label="Total Candidates"
                        required
                        error={errors.totalCandidates?.message}
                      >
                        <Input
                          {...methods.register("totalCandidates")}
                          type="number"
                          placeholder="Enter total candidates"
                          className="h-[42px] rounded-[8px] border-[#e2e8f0] text-sm placeholder:text-[#c0c7d4] focus-visible:ring-1 focus-visible:ring-[#6a3df6] focus-visible:ring-offset-0"
                        />
                      </FormField>

                      <FormField
                        label="Total Slots"
                        required
                        error={errors.totalSlots?.message}
                      >
                        <Select
                          value={values.totalSlots}
                          onValueChange={(value) =>
                            methods.setValue("totalSlots", value, {
                              shouldValidate: true,
                            })
                          }
                        >
                          <SelectTrigger className="h-[42px] rounded-[8px] border-[#e2e8f0] text-sm text-[#334155]">
                            <SelectValue placeholder="Select total shots" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((count) => (
                              <SelectItem key={count} value={String(count)}>
                                {count}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormField>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField label="Total Question Set" required>
                        <Select
                          value={String(questionSets.length)}
                          onValueChange={(value) => {
                            const count = Number.parseInt(value, 10);

                            setQuestionSets((prev) => {
                              if (count > prev.length) {
                                const next = [...prev];
                                for (let i = prev.length; i < count; i += 1) {
                                  next.push({
                                    id: `qs-${Date.now()}-${i}`,
                                    name: `Question Set ${i + 1}`,
                                    questions: [],
                                  });
                                }
                                return next;
                              }

                              return prev.slice(0, count);
                            });
                          }}
                        >
                          <SelectTrigger className="h-[42px] rounded-[8px] border-[#e2e8f0] text-sm text-[#334155]">
                            <SelectValue placeholder="Select total question set" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((count) => (
                              <SelectItem key={count} value={String(count)}>
                                {count}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormField>

                      <FormField
                        label="Question Type"
                        required
                        error={errors.questionType?.message}
                      >
                        <Select
                          value={values.questionType}
                          onValueChange={(value) =>
                            methods.setValue("questionType", value, {
                              shouldValidate: true,
                            })
                          }
                        >
                          <SelectTrigger className="h-[42px] rounded-[8px] border-[#e2e8f0] text-sm text-[#334155]">
                            <SelectValue placeholder="Select question type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mcq">MCQ</SelectItem>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="mixed">Mixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormField>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1fr_1fr_150px]">
                      <FormField
                        label="Start Time"
                        required
                        error={errors.startTime?.message}
                      >
                        <div className="relative">
                          <Input
                            {...methods.register("startTime")}
                            type="datetime-local"
                            className="h-[42px] rounded-[8px] border-[#e2e8f0] pr-10 text-sm text-[#334155] focus-visible:ring-1 focus-visible:ring-[#6a3df6] focus-visible:ring-offset-0"
                          />
                          <Clock3 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                        </div>
                      </FormField>

                      <FormField
                        label="End Time"
                        required
                        error={errors.endTime?.message}
                      >
                        <div className="relative">
                          <Input
                            {...methods.register("endTime")}
                            type="datetime-local"
                            className="h-[42px] rounded-[8px] border-[#e2e8f0] pr-10 text-sm text-[#334155] focus-visible:ring-1 focus-visible:ring-[#6a3df6] focus-visible:ring-offset-0"
                          />
                          <Clock3 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                        </div>
                      </FormField>

                      <FormField
                        label="Duration"
                        error={errors.duration?.message}
                      >
                        <Input
                          {...methods.register("duration")}
                          type="number"
                          placeholder="Duration Time"
                          className="h-[42px] rounded-[8px] border-[#e2e8f0] text-sm placeholder:text-[#c0c7d4] focus-visible:ring-1 focus-visible:ring-[#6a3df6] focus-visible:ring-offset-0"
                        />
                      </FormField>
                    </div>

                    <div className="flex items-center justify-between rounded-[10px] border border-[#eef2f7] bg-[#fbfcfe] px-4 py-3">
                      <Label className="text-sm font-medium text-[#475569]">
                        Negative Marking
                      </Label>
                      <Switch
                        checked={negativeMarking}
                        onCheckedChange={setNegativeMarking}
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="rounded-[14px] border border-[#eef2f7] bg-white shadow-none">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/employer")}
                    className="h-[40px] min-w-[122px] rounded-[10px] border-[#e2e8f0] text-sm font-medium text-[#475569] hover:bg-[#f8fafc]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveBasicInfo}
                    className="h-[40px] min-w-[122px] rounded-[10px] bg-[linear-gradient(90deg,#5c2ef5_0%,#7438f7_100%)] text-sm font-medium text-white shadow-none hover:opacity-95"
                  >
                    Save & Continue
                  </Button>
                </CardContent>
              </Card>
            </div>
          </FormProvider>
        )}

        {step === 1 && isViewMode && (
          <div className="mx-auto max-w-[720px] space-y-4 animate-fade-in">
            <Card className="rounded-[14px] border border-[#eef2f7] bg-white shadow-none">
              <CardContent className="space-y-6 p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-[20px] font-semibold text-[#334155]">
                    Basic Information
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsViewMode(false)}
                    className="flex items-center gap-1.5 text-[12px] font-medium text-[#6d28d9] hover:underline"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="mb-1 text-[11px] text-[#94a3b8]">
                      Online Test Title
                    </p>
                    <p className="text-[16px] font-medium leading-[1.4] text-[#334155]">
                      {values.title || "-"}
                    </p>
                  </div>

                  <div className="grid gap-x-8 gap-y-4 md:grid-cols-4">
                    <div>
                      <p className="mb-1 text-[11px] text-[#94a3b8]">
                        Total Candidates
                      </p>
                      <p className="text-[15px] font-medium text-[#334155]">
                        {values.totalCandidates || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] text-[#94a3b8]">
                        Total Slots
                      </p>
                      <p className="text-[15px] font-medium text-[#334155]">
                        {values.totalSlots || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] text-[#94a3b8]">
                        Total Question Set
                      </p>
                      <p className="text-[15px] font-medium text-[#334155]">
                        {questionSets.length}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] text-[#94a3b8]">
                        Duration Per Slots (Minutes)
                      </p>
                      <p className="text-[15px] font-medium text-[#334155]">
                        {values.duration || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-x-8 gap-y-4 md:grid-cols-3">
                    <div>
                      <p className="mb-1 text-[11px] text-[#94a3b8]">
                        Question Type
                      </p>
                      <p className="text-[15px] font-medium uppercase text-[#334155]">
                        {values.questionType || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] text-[#94a3b8]">
                        Start Time
                      </p>
                      <p className="text-[15px] font-medium text-[#334155]">
                        {values.startTime || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] text-[#94a3b8]">
                        End Time
                      </p>
                      <p className="text-[15px] font-medium text-[#334155]">
                        {values.endTime || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[14px] border border-[#eef2f7] bg-white shadow-none">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/employer")}
                  className="h-[40px] min-w-[120px] rounded-[10px] border-[#e2e8f0] text-sm font-medium text-[#475569] hover:bg-[#f8fafc]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleContinueToQuestions}
                  className="h-[40px] min-w-[124px] rounded-[10px] bg-[linear-gradient(90deg,#5c2ef5_0%,#7438f7_100%)] text-sm font-medium text-white shadow-none hover:opacity-95"
                >
                  Save & Continue
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="mx-auto max-w-[760px] space-y-5 animate-fade-in">
            {questionSets.map((set) => (
              <div key={set.id} className="space-y-4">
                {set.questions.map((question, index) =>
                  editingQuestion?.setId === set.id &&
                  editingQuestion?.question?.id === question.id ? (
                    <QuestionEditor
                      key={question.id}
                      initialData={question}
                      onSave={(updatedQuestion) => {
                        addQuestion(set.id, updatedQuestion);
                        setEditingQuestion(null);
                      }}
                      onSaveAndAddMore={(updatedQuestion) => {
                        addQuestion(set.id, updatedQuestion);
                      }}
                      onCancel={() => setEditingQuestion(null)}
                    />
                  ) : (
                    <QuestionDisplay
                      key={question.id}
                      question={question}
                      index={index}
                      onEdit={() =>
                        setEditingQuestion({
                          setId: set.id,
                          question,
                        })
                      }
                      onRemove={() => deleteQuestion(set.id, question.id)}
                    />
                  ),
                )}

                {editingQuestion?.setId === set.id &&
                !editingQuestion?.question ? (
                  <QuestionEditor
                    onSave={(question) => {
                      addQuestion(set.id, question);
                      setEditingQuestion(null);
                    }}
                    onSaveAndAddMore={(question) => {
                      addQuestion(set.id, question);
                      setEditingQuestion({ setId: set.id });
                    }}
                    onCancel={() => setEditingQuestion(null)}
                  />
                ) : null}
              </div>
            ))}

            {!editingQuestion && (
              <Card className="rounded-[14px] border border-[#eef2f7] bg-white shadow-none">
                <CardContent className="space-y-3 p-4">
                  {totalQuestions > 0 && (
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isPending}
                        className="h-[36px] rounded-[8px] border-[#e2e8f0] px-4 text-[12px] font-medium text-[#475569] hover:bg-[#f8fafc]"
                      >
                        {mutation.isPending ? (
                          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="mr-2 h-3.5 w-3.5" />
                        )}
                        Save Online Test
                      </Button>
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={() =>
                      setEditingQuestion({ setId: questionSets[0]?.id })
                    }
                    className="h-[38px] w-full rounded-[8px] bg-[linear-gradient(90deg,#5c2ef5_0%,#7438f7_100%)] text-[12px] font-semibold text-white shadow-none hover:opacity-95"
                  >
                    Add Question
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </EmployerLayout>
  );
}
