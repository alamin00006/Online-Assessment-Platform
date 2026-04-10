"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { useExamSessionStore } from "@/stores/exam-session-store";
import { api } from "@/services/api";
import { useTimer } from "@/hooks/useTimer";
import { useTabSwitchDetection } from "@/hooks/useTabSwitchDetection";
import { useFullscreenDetection } from "@/hooks/useFullscreenDetection";
import { CandidateLayout } from "@/components/CandidateLayout";
import { PortalHeader, PortalPage } from "@/components/PortalChrome";
import { WarningBanner } from "@/components/WarningBanner";
import { LoadingState } from "@/components/StateDisplays";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Question } from "@/types";

const MAX_VIOLATIONS = 3;

function ExamStatusScreen({
  title,
  description,
  icon,
  userName,
  userRef,
  onBack,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  userName?: string;
  userRef?: string;
  onBack: () => void;
}) {
  return (
    <PortalPage
      header={
        <PortalHeader title="Akij Resource" userName={userName} userRef={userRef} />
      }
    >
      <div className="py-8 sm:py-12">
        <Card className="w-full rounded-[16px] border border-[#e5ebf3] bg-white shadow-none">
          <CardContent className="space-y-4 px-6 py-10 text-center sm:px-10 sm:py-14">
            <div className="mx-auto w-fit">{icon}</div>
            <h2 className="font-display text-[24px] font-semibold text-[#334155] sm:text-[28px]">
              {title}
            </h2>
            <p className="mx-auto max-w-[720px] text-sm text-[#64748b]">
              {description}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="h-[38px] rounded-[8px] border-[#d7dee7] px-5 text-sm font-medium text-[#475569]"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </PortalPage>
  );
}

export default function ExamScreen() {
  const { examId } = useParams<{ examId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    currentAttemptId,
    answers,
    violations,
    isSubmitted,
    startSession,
    setAnswer,
    addViolation,
    submitSession,
    resetSession,
  } = useExamSessionStore();

  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: exam, isLoading } = useQuery({
    queryKey: ["exam", examId],
    queryFn: () => api.getExam(examId!),
    enabled: !!examId,
  });

  const startMutation = useMutation({
    mutationFn: () => api.startExam(examId!, user!.id, user!.name, user!.email),
    onSuccess: (attempt) => {
      startSession(attempt.id, examId!, exam!.duration);
    },
  });

  useEffect(() => {
    if (exam && !currentAttemptId && !isSubmitted) {
      startMutation.mutate();
    }
  }, [exam, currentAttemptId, isSubmitted]);

  const submitMutation = useMutation({
    mutationFn: () => api.submitExam(currentAttemptId!, answers, violations),
    onSuccess: () => {
      submitSession();
      setShowSuccess(true);
    },
  });

  const handleSubmit = useCallback(() => {
    if (!currentAttemptId || isSubmitted) return;
    submitMutation.mutate();
  }, [currentAttemptId, isSubmitted, submitMutation]);

  const handleTimeout = useCallback(() => {
    if (!currentAttemptId || isSubmitted) return;
    setShowTimeout(true);
    submitMutation.mutate();
  }, [currentAttemptId, isSubmitted, submitMutation]);

  const timer = useTimer(handleTimeout);

  const handleViolation = useCallback(
    (reason: string) => {
      if (isSubmitted) return;
      const count = addViolation();
      setWarningMessage(`${reason} (${count}/${MAX_VIOLATIONS})`);
      toast.warning(`Violation: ${reason}`);
      setTimeout(() => setWarningMessage(null), 5000);

      if (count >= MAX_VIOLATIONS) {
        toast.error("Maximum violations reached. Auto-submitting exam.");
        handleSubmit();
      }
    },
    [isSubmitted, addViolation, handleSubmit],
  );

  useTabSwitchDetection(() => handleViolation("Tab switch detected"));
  useFullscreenDetection(() => handleViolation("Fullscreen exit detected"));

  const allQuestions: Question[] = useMemo(
    () => exam?.questionSets.flatMap((set) => set.questions) || [],
    [exam],
  );

  const currentQuestion = allQuestions[currentIndex];
  const totalQuestions = allQuestions.length;

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswer(questionId, value);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    handleSubmit();
  };

  const handleSkip = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((index) => index + 1);
    }
  };

  const handleBack = () => {
    resetSession();
    router.push("/candidate");
  };

  if (isLoading || startMutation.isPending) {
    return <LoadingState message="Preparing exam..." />;
  }

  if (showTimeout) {
    return (
      <ExamStatusScreen
        title="Timeout!"
        description={`Dear ${user?.name}, your exam time has been finished. Thank you for participating.`}
        icon={
          <div className="relative">
            <Clock className="h-16 w-16 text-[#7c3aed]" />
            <XCircle className="absolute -bottom-1 -right-1 h-6 w-6 text-[#ef4444]" />
          </div>
        }
        userName={user?.name}
        userRef={user?.id?.slice(0, 8)}
        onBack={handleBack}
      />
    );
  }

  if (showSuccess || isSubmitted) {
    return (
      <ExamStatusScreen
        title="Test Completed"
        description={`Congratulations! ${user?.name}, you have completed your ${exam?.title || "exam"}. Thank you for participating.`}
        icon={<CheckCircle2 className="h-14 w-14 text-[#4f46e5]" />}
        userName={user?.name}
        userRef={user?.id?.slice(0, 8)}
        onBack={handleBack}
      />
    );
  }

  return (
    <PortalPage
      header={
        <PortalHeader
          title="Akij Resource"
          userName={user?.name}
          userRef={user?.id?.slice(0, 8)}
        />
      }
    >
      <div className="mx-auto max-w-[820px] space-y-4 py-2 sm:space-y-5 sm:py-4">
        {warningMessage && (
          <WarningBanner
            message={warningMessage}
            variant="danger"
          />
        )}

        {violations > 0 && (
          <div className="flex justify-end">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fef2f2] px-3 py-1 text-xs font-medium text-[#ef4444]">
              <AlertTriangle className="h-3.5 w-3.5" />
              Violations: {violations}
            </span>
          </div>
        )}

        <Card className="rounded-[14px] border border-[#e5ebf3] bg-white shadow-none">
          <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <span className="font-display text-[16px] font-semibold text-[#334155] sm:text-[20px]">
              Question ({currentIndex + 1}/{totalQuestions})
            </span>
            <span className="inline-flex h-[36px] min-w-[112px] items-center justify-center rounded-[8px] bg-[#f3f4f6] px-4 text-sm font-semibold text-[#475569] sm:h-[38px]">
              {timer.formatted} left
            </span>
          </CardContent>
        </Card>

        {currentQuestion && (
          <Card className="rounded-[14px] border border-[#e5ebf3] bg-white shadow-none">
            <CardContent className="space-y-5 p-3 sm:space-y-6 sm:p-5">
              <h2 className="font-display text-[17px] font-semibold leading-[1.45] text-[#334155] sm:text-[22px]">
                Q{currentIndex + 1}. {currentQuestion.title}
              </h2>

              {currentQuestion.type === "radio" && currentQuestion.options && (
                <RadioGroup
                  value={(answers[currentQuestion.id] as string) || ""}
                  onValueChange={(value) =>
                    handleAnswerChange(currentQuestion.id, value)
                  }
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => (
                    <label
                      key={option}
                      htmlFor={`${currentQuestion.id}-${option}`}
                      className="flex cursor-pointer items-center gap-3 rounded-[8px] border border-[#e8edf4] px-3 py-3 text-[12px] text-[#475569] transition-colors hover:bg-[#fafbfc] sm:px-4 sm:text-sm"
                    >
                      <RadioGroupItem
                        value={option}
                        id={`${currentQuestion.id}-${option}`}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === "checkbox" && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const selected = (answers[currentQuestion.id] as string[]) || [];

                    return (
                      <label
                        key={option}
                        htmlFor={`${currentQuestion.id}-${option}`}
                        className="flex cursor-pointer items-center gap-3 rounded-[8px] border border-[#e8edf4] px-3 py-3 text-[12px] text-[#475569] transition-colors hover:bg-[#fafbfc] sm:px-4 sm:text-sm"
                      >
                        <Checkbox
                          id={`${currentQuestion.id}-${option}`}
                          checked={selected.includes(option)}
                          onCheckedChange={(checked) => {
                            const next = checked
                              ? [...selected, option]
                              : selected.filter((item) => item !== option);
                            handleAnswerChange(currentQuestion.id, next);
                          }}
                          className="h-[14px] w-[14px] rounded-[3px] border-[#cbd5e1] data-[state=checked]:border-[#7c3aed] data-[state=checked]:bg-[#7c3aed]"
                        />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === "text" && (
                <RichTextEditor
                  content={(answers[currentQuestion.id] as string) || ""}
                  onChange={(value) =>
                    handleAnswerChange(currentQuestion.id, value)
                  }
                  placeholder="Type questions here..."
                  minHeight="140px"
                />
              )}

              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  disabled={currentIndex >= totalQuestions - 1}
                  className="h-[38px] w-full rounded-[8px] border-[#d7dee7] px-4 text-sm font-medium text-[#475569] sm:w-auto"
                >
                  Skip this Question
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  className="h-[38px] w-full rounded-[8px] bg-[linear-gradient(90deg,#5c2ef5_0%,#7438f7_100%)] px-5 text-sm font-medium text-white shadow-none hover:opacity-95 sm:w-auto"
                >
                  {currentIndex < totalQuestions - 1
                    ? "Save & Continue"
                    : "Submit"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalPage>
  );
}
