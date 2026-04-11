import { Clock, FileText, Users } from "lucide-react";
// Imports reusable UI.
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Exam } from "@/types";

interface EmployerExamCardProps {
  exam: Exam;
  onViewCandidates: () => void;
}

// Displays an employer-facing exam summary and candidate review action.
export const EmployerExamCard = ({
  exam,
  onViewCandidates,
}: EmployerExamCardProps) => (
  <Card className="animate-fade-in rounded-[12px] border border-[#e6ebf2] bg-white shadow-none transition-shadow hover:shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
    <CardContent className="space-y-5 p-5">
      <h3 className="font-display text-[16px] font-semibold leading-[1.35] text-[#334155]">
        {exam.title}
      </h3>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#64748b]">
        <span className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-[#94a3b8]" />
          Candidates:{" "}
          <strong className="font-medium text-[#475569]">
            {exam.totalCandidates?.toLocaleString() || "Not Set"}
          </strong>
        </span>
        <span className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-[#94a3b8]" />
          Question Set:{" "}
          <strong className="font-medium text-[#475569]">
            {exam.questionSets.length || "Not Set"}
          </strong>
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-[#94a3b8]" />
          Exam Slots:{" "}
          <strong className="font-medium text-[#475569]">
            {exam.totalSlots || "Not Set"}
          </strong>
        </span>
      </div>

      <Button
        variant="outline"
        onClick={onViewCandidates}
        className="h-[31px] rounded-[8px] border-primary px-4 text-[12px] font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        View Candidates
      </Button>
    </CardContent>
  </Card>
);


