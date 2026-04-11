import { AlertTriangle, Clock, FileText } from "lucide-react";
// Imports reusable UI.
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CandidateExamAttempt, Exam } from "@/types";

interface CandidateExamCardProps {
  exam: Exam;
  attempt?: CandidateExamAttempt;
  onStart: () => void;
}

// Displays a candidate-facing exam summary and the primary start action.
export const CandidateExamCard = ({
  exam,
  attempt,
  onStart,
}: CandidateExamCardProps) => {
  const isCompleted =
    attempt?.status === "completed" || attempt?.status === "violated";
  const totalQuestions = exam.questionSets.reduce(
    (sum, set) => sum + set.questions.length,
    0,
  );

  return (
    <Card className="animate-fade-in rounded-[12px] border border-[#e6ebf2] bg-white shadow-none transition-shadow hover:shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <CardContent className="space-y-5 p-5">
        <h3 className="font-display text-[16px] font-semibold leading-[1.35] text-[#334155]">
          {exam.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#64748b]">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#94a3b8]" />
            Duration: <strong className="font-medium text-[#475569]">{exam.duration} min</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-[#94a3b8]" />
            Question: <strong className="font-medium text-[#475569]">{totalQuestions}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-[#94a3b8]" />
            Negative Marking:{" "}
            <strong className="font-medium text-[#475569]">
              {exam.negativeMarking ? "-0.25/wrong" : "None"}
            </strong>
          </span>
        </div>

        {isCompleted ? (
          <Button
            variant="outline"
            disabled
            className="h-[31px] rounded-[8px] border-[#cbd5e1] px-8 text-[12px] font-medium text-[#94a3b8]"
          >
            Completed
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={onStart}
            className="h-[31px] rounded-[8px] border-primary px-8 text-[12px] font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {attempt?.status === "in-progress" ? "Resume" : "Start"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};


