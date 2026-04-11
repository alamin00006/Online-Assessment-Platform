"use client";

// Orchestrates the two-step employer exam creation workflow.
// Field rendering and question-set UI live in focused child components.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EmployerLayout } from "@/components/shared";
import {
  BasicInfoForm,
  BasicInfoPreview,
  CreateExamStepper,
  EditingQuestionState,
  QuestionSetsStep,
} from "@/components/create-exam";
// Imports reusable UI.
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/services/api";
import {
  basicExamInfoSchema,
  type BasicExamInfoForm as BasicExamInfoFormValues,
} from "@/schemas/exam.schema";
import { useAuthStore } from "@/stores/auth-store";
import { Question, QuestionSet } from "@/types";

// Coordinates the multi-step exam creation workflow and persistence.
const CreateExam = () => {
  // get user info for exam creation and post-creation.
  const { user } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [isViewMode, setIsViewMode] = useState(false);
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([
    { id: `qs-${Date.now()}`, name: "Question Set 1", questions: [] },
  ]);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<EditingQuestionState | null>(null);

  const methods = useForm<BasicExamInfoFormValues>({
    resolver: zodResolver(basicExamInfoSchema),
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

  // Creates the exam record and refreshes employer dashboard data after success.
  const mutation = useMutation({
    mutationFn: async () => {
      const data = methods.getValues();

      return api.createExam(
        {
          title: data.title,
          totalCandidates: Number.parseInt(data.totalCandidates, 10),
          totalSlots: Number.parseInt(data.totalSlots, 10),
          duration: Number.parseInt(data.duration ?? "0", 10),
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

  // Adds a new question or replaces the existing question with the same id.
  const addQuestion = (setId: string, question: Question) => {
    setQuestionSets((currentQuestionSets) =>
      currentQuestionSets.map((questionSet) =>
        questionSet.id === setId
          ? {
              ...questionSet,
              questions: [
                ...questionSet.questions.filter(
                  (existingQuestion) => existingQuestion.id !== question.id,
                ),
                question,
              ],
            }
          : questionSet,
      ),
    );
  };

  // Removes a question from the selected question set without changing other sets.
  const deleteQuestion = (setId: string, questionId: string) => {
    setQuestionSets((currentQuestionSets) =>
      currentQuestionSets.map((questionSet) =>
        questionSet.id === setId
          ? {
              ...questionSet,
              questions: questionSet.questions.filter(
                (question) => question.id !== questionId,
              ),
            }
          : questionSet,
      ),
    );
  };

  // Controls step navigation while preventing access before basic information is saved.
  const goToStep = (targetStep: number) => {
    if (targetStep === 1) {
      setStep(1);
      return;
    }

    if (targetStep === 2 && isViewMode) {
      setStep(2);
    }
  };

  // Validates basic information before switching to preview mode.
  const handleSaveBasicInfo = async () => {
    const valid = await methods.trigger();
    if (!valid) return;

    setIsViewMode(true);
  };

  const totalQuestions = questionSets.reduce(
    (questionTotal, questionSet) =>
      questionTotal + questionSet.questions.length,
    0,
  );

  return (
    <EmployerLayout>
      <div className=" space-y-6">
        <Card className="rounded-[12px] border border-[#e5ebf3] bg-white shadow-none">
          <CardContent className="space-y-6 p-5 sm:p-6">
            <div className="space-y-4">
              <h1 className="font-display text-[24px] font-semibold text-[#334155]">
                Manage Online Test
              </h1>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CreateExamStepper
                  step={step}
                  onStepClick={goToStep}
                  basicInfoSaved={isViewMode || step === 2}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/employer")}
                  className="h-[34px] rounded-[8px] border-[#e2e8f0] px-5 text-[12px] font-medium text-[#475569] hover:bg-[#f8fafc] hover:text-[#334155]"
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {step === 1 && !isViewMode && (
          <BasicInfoForm
            methods={methods}
            questionSets={questionSets}
            setQuestionSets={setQuestionSets}
            negativeMarking={negativeMarking}
            setNegativeMarking={setNegativeMarking}
            onCancel={() => router.push("/employer")}
            onSave={handleSaveBasicInfo}
          />
        )}

        {step === 1 && isViewMode && (
          <BasicInfoPreview
            methods={methods}
            questionSetCount={questionSets.length}
            onCancel={() => router.push("/employer")}
            onEdit={() => setIsViewMode(false)}
            onContinue={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <QuestionSetsStep
            questionSets={questionSets}
            editingQuestion={editingQuestion}
            setEditingQuestion={setEditingQuestion}
            totalQuestions={totalQuestions}
            isSaving={mutation.isPending}
            onAddQuestion={addQuestion}
            onDeleteQuestion={deleteQuestion}
            onSaveExam={() => mutation.mutate()}
          />
        )}
      </div>
    </EmployerLayout>
  );
};

export default CreateExam;
