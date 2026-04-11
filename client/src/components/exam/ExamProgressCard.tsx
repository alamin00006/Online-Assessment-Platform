// Imports reusable UI.
import { Card, CardContent } from "@/components/ui/card";

interface ExamProgressCardProps {
  currentIndex: number;
  totalQuestions: number;
  timerLabel: string;
}

// Displays exam progress and remaining time during a candidate session.
export const ExamProgressCard = ({
  currentIndex,
  totalQuestions,
  timerLabel,
}: ExamProgressCardProps) => (
  <Card className="rounded-[14px] border border-[#e5ebf3] bg-white shadow-none">
    <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <span className="font-display text-[16px] font-semibold text-[#334155] sm:text-[20px]">
        Question ({currentIndex + 1}/{totalQuestions})
      </span>
      <span className="inline-flex h-[36px] min-w-[112px] items-center justify-center self-start rounded-[8px] bg-[#f3f4f6] px-4 text-sm font-semibold text-[#475569] sm:h-[38px] sm:self-auto">
        {timerLabel} left
      </span>
    </CardContent>
  </Card>
);



