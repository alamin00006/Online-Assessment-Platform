"use client";

// Owns the candidate exam lifecycle: session start, timer, violations, and submit state.
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertTriangle, Check, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  ExamProgressCard,
  ExamQuestionCard,
  ExamStatusScreen,
  TimeoutOverlay,
} from "@/components/exam";
import { AppHeader, AppShell } from "@/components/shared";
import { LoadingState } from "@/components/shared";
import { WarningBanner } from "@/components/shared";
import { useFullscreenDetection } from "@/hooks/useFullscreenDetection";
import { useTabSwitchDetection } from "@/hooks/useTabSwitchDetection";
import { useTimer } from "@/hooks/useTimer";
import { api } from "@/services/api";
import { useAuthStore } from "@/stores/auth-store";
import { useExamSessionStore } from "@/stores/exam-session-store";
import { Question } from "@/types";

const MAX_VIOLATIONS = 3;

// Controls the candidate exam session, timer, answers, and violation tracking.
const ExamScreen = () => {
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

  // Loads the exam definition required to render and start the attempt.
  const { data: exam, isLoading } = useQuery({
    queryKey: ["exam", examId],
    queryFn: () => api.getExam(examId!),
    enabled: !!examId && !!user,
  });

  // Starts the candidate attempt once exam and user data are available.
  const startMutation = useMutation({
    mutationFn: () => api.startExam(examId!, user!.id, user!.name, user!.email),
    onSuccess: (attempt) => {
      if (!exam) return;
      startSession(attempt.id, examId!, exam.duration);
    },
  });

  // Automatically starts an exam session when the screen has the required data.
  useEffect(() => {
    if (exam && user && !currentAttemptId && !isSubmitted) {
      startMutation.mutate();
    }
  }, [exam, user, currentAttemptId, isSubmitted, startMutation]);

  // Submits the active attempt and finalizes the local session state.
  const submitMutation = useMutation({
    mutationFn: () => api.submitExam(currentAttemptId!, answers, violations),
    onSuccess: () => {
      submitSession();
      setShowSuccess(true);
    },
  });

  // Submits the current attempt with answers and recorded violations.
  const handleSubmit = useCallback(() => {
    if (!currentAttemptId || isSubmitted) return;
    submitMutation.mutate();
  }, [currentAttemptId, isSubmitted, submitMutation]);

  // Locks the exam flow and auto-submits when the timer expires.
  const handleTimeout = useCallback(() => {
    if (!currentAttemptId || isSubmitted) return;
    setShowTimeout(true);
    submitMutation.mutate();
  }, [currentAttemptId, isSubmitted, submitMutation]);

  const timer = useTimer(handleTimeout);

  // Records behavioral violations and auto-submits after the allowed limit is reached.
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

  // Flattens question sets into the ordered question list used by the exam screen.
  const allQuestions: Question[] = useMemo(
    () => exam?.questionSets.flatMap((questionSet) => questionSet.questions) || [],
    [exam],
  );

  const currentQuestion = allQuestions[currentIndex];
  const totalQuestions = allQuestions.length;

  // Stores the candidate answer for the active question.
  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswer(questionId, value);
  };

  // Moves forward through the exam or submits on the final question.
  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((currentQuestionIndex) => currentQuestionIndex + 1);
      return;
    }

    handleSubmit();
  };

  // Skips the current question and advances when another question exists.
  const handleSkip = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((currentQuestionIndex) => currentQuestionIndex + 1);
    }
  };

  // Returns the candidate to the dashboard and clears the active exam session.
  const handleBack = () => {
    resetSession();
    router.push("/candidate");
  };

  // Clears the candidate session and leaves the exam shell.
  const handleLogout = () => {
    resetSession();
    logout();
    router.push("/");
  };

  // Redirects away from the exam screen if the authenticated user is missing.
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
      <AppShell
        header={
          <AppHeader
            title="Akij Resource"
            userName={user?.name}
            userRef={user?.id?.slice(0, 8)}
            onLogout={handleLogout}
          />
        }
      >
        <div className="relative mx-auto max-w-[820px] space-y-4 py-2 sm:space-y-5 sm:py-4">
          <ExamProgressCard
            currentIndex={currentIndex}
            totalQuestions={totalQuestions}
            timerLabel={timer.formatted}
          />
          <div className="h-[314px] rounded-[14px] border border-[#e5ebf3] bg-white" />
          <TimeoutOverlay
            description={`Dear ${user?.name}, your exam time has been finished. Thank you for participating.`}
            onBack={handleBack}
          />
        </div>
      </AppShell>
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
    <AppShell
      header={
        <AppHeader
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

        <ExamProgressCard
          currentIndex={currentIndex}
          totalQuestions={totalQuestions}
          timerLabel={timer.formatted}
        />

        {currentQuestion && (
          <ExamQuestionCard
            question={currentQuestion}
            questionNumber={currentIndex}
            totalQuestions={totalQuestions}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onSkip={handleSkip}
            onNext={handleNext}
          />
        )}
      </div>
    </AppShell>
  );
};

export default ExamScreen;



