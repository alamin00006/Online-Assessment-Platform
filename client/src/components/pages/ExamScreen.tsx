"use client";

// Candidate exam screen for the interview task frontend.
// Manages the exam lifecycle, including timer, answer capture, and violation tracking.
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertTriangle, Check, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { useExamSessionStore } from "@/stores/exam-session-store";
import { api } from "@/services/api";
import { useTimer } from "@/hooks/useTimer";
import { useTabSwitchDetection } from "@/hooks/useTabSwitchDetection";
import { useFullscreenDetection } from "@/hooks/useFullscreenDetection";
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
  onLogout,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  userName?: string;
  userRef?: string;
  onBack: () => void;
  onLogout?: () => void;
}) {
  return (
    <PortalPage
      header={
        <PortalHeader
          title="Akij Resource"
          userName={userName}
          userRef={userRef}
          onLogout={onLogout}
        />
      }
    >
      <div className="px-4 py-7 sm:px-6 sm:py-10">
        <Card className="w-full rounded-[16px] border border-[#e5ebf3] bg-white shadow-none">
          <CardContent className="space-y-4 px-6 py-12 text-center sm:px-10 sm:py-16">
            <div className="mx-auto w-fit">{icon}</div>
            <h2 className="font-display text-[20px] font-semibold text-[#334155] sm:text-[26px]">
              {title}
            </h2>
            <p className="mx-auto max-w-[720px] text-[13px] text-[#718096] sm:text-sm">
              {description}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="h-[38px] rounded-[10px] border-[#d7dee7] px-5 text-sm font-medium text-[#475569]"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </PortalPage>
  );
}

function TimeoutOverlay({
  description,
  onBack,
}: {
  description: string;
  onBack: () => void;
}) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 px-4">
      <Card className="w-full max-w-[560px] rounded-[18px] border border-[#e5ebf3] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <CardContent className="space-y-4 px-6 py-10 text-center sm:px-10">
          <div className="relative mx-auto h-12 w-12">
            <Clock className="h-12 w-12 text-[#3b82f6]" />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ef476f] text-[12px] font-bold text-white">
              x
            </span>
          </div>
          <h2 className="font-display text-[22px] font-semibold text-[#334155]">
            Timeout!
          </h2>
          <p className="text-[13px] text-[#718096] sm:text-sm">{description}</p>
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-[38px] rounded-[10px] border-[#d7dee7] px-5 text-sm font-medium text-[#475569]"
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ExamScreen() {
  const { examId } = useParams<{ examId: string }>();
  const router = useRouter();
  const { user, logout } = useAuthStore();
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
    enabled: !!examId && !!user,
  });

  const startMutation = useMutation({
    mutationFn: () => api.startExam(examId!, user!.id, user!.name, user!.email),
    onSuccess: (attempt) => {
      if (!exam) return;
      startSession(attempt.id, examId!, exam.duration);
    },
  });

  useEffect(() => {
    if (exam && user && !currentAttemptId && !isSubmitted) {
      startMutation.mutate();
    }
  }, [exam, user, currentAttemptId, isSubmitted, startMutation]);

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

  // Track potential exam violations and auto-submit after the allowed threshold.
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

  const handleLogout = () => {
    resetSession();
    logout();
    router.push("/");
  };

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [router, user]);

  if (isLoading || startMutation.isPending) {
    return <LoadingState message="Preparing exam..." />;
  }

  if (!user) {
    return <LoadingState message="Redirecting..." />;
  }

  if (showTimeout) {
    return (
      <PortalPage
        header={
          <PortalHeader
            title="Akij Resource"
            userName={user?.name}
            userRef={user?.id?.slice(0, 8)}
            onLogout={handleLogout}
          />
        }
      >
        <div className="relative mx-auto max-w-[820px] space-y-4 py-2 sm:space-y-5 sm:py-4">
          <Card className="rounded-[14px] border border-[#e5ebf3] bg-white shadow-none">
            <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <span className="font-display text-[16px] font-semibold text-[#334155] sm:text-[20px]">
                Question ({currentIndex + 1}/{totalQuestions})
              </span>
              <span className="inline-flex h-[36px] min-w-[112px] items-center justify-center self-start rounded-[8px] bg-[#f3f4f6] px-4 text-sm font-semibold text-[#475569] sm:h-[38px] sm:self-auto">
                {timer.formatted} left
              </span>
            </CardContent>
          </Card>

          <Card className="rounded-[14px] border border-[#e5ebf3] bg-white shadow-none">
            <CardContent className="space-y-5 p-3 sm:space-y-6 sm:p-5">
              <div className="h-[220px] rounded-[10px] bg-[#f8fafc]" />
              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="h-[42px] w-full rounded-[10px] border-[#d7dee7] px-4 text-sm font-medium text-[#475569] sm:h-[38px] sm:w-auto sm:rounded-[8px]"
                >
                  Skip this Question
                </Button>
                <Button
                  type="button"
                  className="h-[42px] w-full rounded-[10px] bg-[linear-gradient(90deg,#5c2ef5_0%,#7438f7_100%)] px-5 text-sm font-medium text-white shadow-none sm:h-[38px] sm:w-auto sm:rounded-[8px]"
                >
                  Save & Continue
                </Button>
              </div>
            </CardContent>
          </Card>

          <TimeoutOverlay
            description={`Dear ${user?.name}, your exam time has been finished. Thank you for participating.`}
            onBack={handleBack}
          />
        </div>
      </PortalPage>
    );
  }

  if (showSuccess || isSubmitted) {
    return (
      <ExamStatusScreen
        title="Test Completed"
        description={`Congratulations! ${user?.name}, you have completed your ${exam?.title || "exam"}. Thank you for participating.`}
        icon={
          <div className="relative mx-auto h-12 w-12">
            <CheckCircle2 className="h-12 w-12 text-[#3b82f6]" />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#22c55e] text-white">
              <Check className="h-3 w-3" />
            </span>
          </div>
        }
        userName={user?.name}
        userRef={user?.id?.slice(0, 8)}
        onBack={handleBack}
        onLogout={handleLogout}
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
          onLogout={handleLogout}
        />
      }
    >
      <div className="mx-auto max-w-[820px] space-y-4 py-2 sm:space-y-5 sm:py-4">
        {warningMessage && (
          <WarningBanner message={warningMessage} variant="danger" />
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
            <span className="inline-flex h-[36px] min-w-[112px] items-center justify-center self-start rounded-[8px] bg-[#f3f4f6] px-4 text-sm font-semibold text-[#475569] sm:h-[38px] sm:self-auto">
              {timer.formatted} left
            </span>
          </CardContent>
        </Card>

        {currentQuestion && (
          <Card className="rounded-[14px] border border-[#e5ebf3] bg-white shadow-none">
            <CardContent className="space-y-5 p-3 sm:space-y-6 sm:p-5">
              <h2
                className="font-display text-[17px] font-semibold leading-[1.45] text-[#334155] sm:text-[22px]"
                dangerouslySetInnerHTML={{
                  __html: `Q${currentIndex + 1}. ${currentQuestion.title}`,
                }}
              />

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

              {currentQuestion.type === "checkbox" &&
                currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                      const selected =
                        (answers[currentQuestion.id] as string[]) || [];

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
                  className="h-[42px] w-full rounded-[10px] border-[#d7dee7] px-4 text-sm font-medium text-[#475569] sm:h-[38px] sm:w-auto sm:rounded-[8px]"
                >
                  Skip this Question
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  className="h-[42px] w-full rounded-[10px] bg-[linear-gradient(90deg,#5c2ef5_0%,#7438f7_100%)] px-5 text-sm font-medium text-white shadow-none hover:opacity-95 sm:h-[38px] sm:w-auto sm:rounded-[8px]"
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
