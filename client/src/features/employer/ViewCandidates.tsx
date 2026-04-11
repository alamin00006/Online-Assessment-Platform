"use client";
// Employer candidate review page for the assessment client.
// Displays candidates and attempt status for a selected exam.

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { EmployerLayout } from "@/components/shared";
import { CandidateList } from "@/components/shared";
import { LoadingState, ErrorState } from "@/components/shared";
// Imports reusable UI.
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Loads and displays candidate attempts for the selected employer exam.
const ViewCandidates = () => {
  const { examId } = useParams<{ examId: string }>();
  const router = useRouter();

  // Loads exam metadata used in the candidate review header.
  const { data: exam } = useQuery({
    queryKey: ["exam", examId],
    queryFn: () => api.getExam(examId!),
    enabled: !!examId,
  });

  // Loads candidate attempts for the selected exam.
  const {
    data: candidates,
    isLoading,
    isError,
  // Loads server data required by this screen or component.
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
};

export default ViewCandidates;





