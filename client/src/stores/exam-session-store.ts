import { create } from "zustand";
import { persist } from "zustand/middleware";

// Exam session store keeps the candidate's current attempt state during the assessment platform.
// It persists answers, timer, violations, and current exam context.
interface ExamSessionState {
  currentAttemptId: string | null;
  currentExamId: string | null;
  answers: Record<string, string | string[]>;
  timeRemaining: number; // seconds
  violations: number;
  isSubmitted: boolean;

  startSession: (attemptId: string, examId: string, duration: number) => void;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  setTimeRemaining: (time: number) => void;
  addViolation: () => number;
  submitSession: () => void;
  resetSession: () => void;
}

export const useExamSessionStore = create<ExamSessionState>()(
  persist(
    (set, get) => ({
      currentAttemptId: null,
      currentExamId: null,
      answers: {},
      timeRemaining: 0,
      violations: 0,
      isSubmitted: false,

      startSession: (attemptId, examId, duration) =>
        set({
          currentAttemptId: attemptId,
          currentExamId: examId,
          answers: {},
          timeRemaining: duration * 60,
          violations: 0,
          isSubmitted: false,
        }),

      setAnswer: (questionId, answer) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: answer },
        })),

      setTimeRemaining: (time) => set({ timeRemaining: time }),

      addViolation: () => {
        const newCount = get().violations + 1;
        set({ violations: newCount });
        return newCount;
      },

      submitSession: () => set({ isSubmitted: true }),

      resetSession: () =>
        set({
          currentAttemptId: null,
          currentExamId: null,
          answers: {},
          timeRemaining: 0,
          violations: 0,
          isSubmitted: false,
        }),
    }),
    { name: "exam-session-storage" },
  ),
);

