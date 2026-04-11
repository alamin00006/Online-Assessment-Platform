"use client";
// Timer display component for candidate exam sessions.
// Highlights remaining time and urgency during the assessment platform exam flow.

import { Clock } from "lucide-react";

interface TimerDisplayProps {
  formatted: string;
  timeRemaining: number;
}

// Displays formatted time with urgency styling for exam sessions.
export const TimerDisplay = ({ formatted, timeRemaining }: TimerDisplayProps) => {
  const isUrgent = timeRemaining < 120;
  const isCritical = timeRemaining < 30;

  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-4 py-2 font-display text-lg font-bold transition-colors ${
        isCritical
          ? "bg-destructive/10 text-destructive animate-pulse-glow"
          : isUrgent
            ? "bg-warning/10 text-warning"
            : "bg-muted text-foreground"
      }`}
    >
      <Clock className="h-5 w-5" />
      <span>{formatted}</span>
    </div>
  );
};


