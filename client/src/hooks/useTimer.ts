import { useEffect, useRef, useCallback } from "react";
import { useExamSessionStore } from "@/stores/exam-session-store";

// Custom timer hook used during candidate exam attempts.
// It tracks remaining seconds and triggers timeout behavior when the exam ends.
export const useTimer = (onTimeout: () => void) => {
  const timeRemaining = useExamSessionStore(
    (examSessionState) => examSessionState.timeRemaining,
  );
  const setTimeRemaining = useExamSessionStore(
    (examSessionState) => examSessionState.setTimeRemaining,
  );
  const isSubmitted = useExamSessionStore(
    (examSessionState) => examSessionState.isSubmitted,
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stops the active timer interval and clears the stored reference.
  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Runs the countdown interval and triggers timeout behavior when needed.
  useEffect(() => {
    if (isSubmitted || timeRemaining <= 0) {
      stop();
      if (timeRemaining <= 0 && !isSubmitted) onTimeout();
      return;
    }

    intervalRef.current = setInterval(() => {
      const current = useExamSessionStore.getState().timeRemaining;
      if (current <= 1) {
        setTimeRemaining(0);
        stop();
        onTimeout();
      } else {
        setTimeRemaining(current - 1);
      }
    }, 1000);

    return stop;
  }, [isSubmitted, stop, onTimeout, setTimeRemaining, timeRemaining]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return {
    timeRemaining,
    minutes,
    seconds,
    formatted: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    stop,
  };
};

