"use client";
// Employer candidate review page for the interview task frontend.
// Displays candidates and attempt status for a selected exam.

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { EmployerLayout } from "@/components/EmployerLayout";
import { CandidateList } from "@/components/CandidateList";
import { LoadingState, ErrorState } from "@/components/StateDisplays";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ViewCandidates() {
  const { examId } = useParams<{ examId: string }>();
  const router = useRouter();

  const { data: exam } = useQuery({
    queryKey: ["exam", examId],
    queryFn: () => api.getExam(examId!),
    enabled: !!examId,
  });

  const {
    data: candidates,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["candidates", examId],
    queryFn: () => api.getCandidatesForExam(examId!),
    enabled: !!examId,
  });

  return (
    <EmployerLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/employer")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold">
              {exam?.title || "Candidates"}
            </h1>
            <p className="text-muted-foreground text-sm">
              Candidate performance overview
            </p>
          </div>
        </div>

        {isLoading && <LoadingState message="Loading candidates..." />}
        {isError && <ErrorState />}
        {candidates && <CandidateList attempts={candidates} />}
      </div>
    </EmployerLayout>
  );
}
