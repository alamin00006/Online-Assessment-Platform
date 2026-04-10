"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Search,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/services/api";
import { CandidateLayout } from "@/components/CandidateLayout";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/StateDisplays";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const ITEMS_PER_PAGE = 8;

export default function CandidateDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["candidate-exams", user?.id],
    queryFn: () => api.getExamsForCandidate(user!.id),
    enabled: !!user,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;

    return data.filter(({ exam }) =>
      exam.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <CandidateLayout>
      <div className="space-y-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="font-display text-[30px] font-bold text-[#334155]">
            Online Tests
          </h1>

          <div className="relative w-full sm:w-[312px]">
            <Input
              placeholder="Search by exam title"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-[42px] rounded-[8px] border-[#d9dff0] bg-white pr-11 text-sm text-[#334155] placeholder:text-[#c0c7d4] focus-visible:ring-1 focus-visible:ring-[#6a3df6] focus-visible:ring-offset-0"
            />
            <button
              type="button"
              aria-label="Search exams"
              className="absolute right-[7px] top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-[6px] border border-[#e7defe] bg-[#faf7ff] text-[#7c3aed]"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {isLoading && <LoadingState message="Loading exams..." />}
        {isError && <ErrorState message="Failed to load exams." />}

        {data && filtered.length === 0 && (
          <div className="rounded-[10px] border border-[#edf1f7] bg-white px-6 py-8">
            <EmptyState
              message="No Online Test Available"
              description="Currently, there are no online tests available. Please check back later for updates."
              className="min-h-[330px] py-0"
            />
          </div>
        )}

        {paginated.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {paginated.map(({ exam, attempt }) => {
              const isCompleted =
                attempt?.status === "completed" ||
                attempt?.status === "violated";
              const totalQuestions = exam.questionSets.reduce(
                (sum, set) => sum + set.questions.length,
                0,
              );

              return (
                <Card
                  key={exam.id}
                  className="animate-fade-in rounded-[12px] border border-[#e6ebf2] bg-white shadow-none transition-shadow hover:shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
                >
                  <CardContent className="space-y-5 p-5">
                    <h3 className="font-display text-[16px] font-semibold leading-[1.35] text-[#334155]">
                      {exam.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#64748b]">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#94a3b8]" />
                        Duration:{" "}
                        <strong className="font-medium text-[#475569]">
                          {exam.duration} min
                        </strong>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-[#94a3b8]" />
                        Question:{" "}
                        <strong className="font-medium text-[#475569]">
                          {totalQuestions}
                        </strong>
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
                        onClick={() => router.push(`/candidate/exam/${exam.id}`)}
                        className="h-[31px] rounded-[8px] border-[#8b5cf6] px-8 text-[12px] font-medium text-[#7c3aed] transition-colors hover:bg-[#7c3aed] hover:text-white"
                      >
                        {attempt?.status === "in-progress" ? "Resume" : "Start"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                className="h-7 w-7 rounded-[6px] border-[#e6ebf2] text-[#94a3b8]"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={page === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(i + 1)}
                  className={
                    page === i + 1
                      ? "h-7 min-w-7 rounded-[6px] bg-[#5c2ef5] px-2 text-xs text-white"
                      : "h-7 min-w-7 rounded-[6px] border-[#e6ebf2] px-2 text-xs text-[#64748b]"
                  }
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="h-7 w-7 rounded-[6px] border-[#e6ebf2] text-[#334155]"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            <span className="text-[11px] text-[#64748b]">
              Online Test Per Page{" "}
              <span className="font-medium text-[#334155]">{ITEMS_PER_PAGE}</span>
            </span>
          </div>
        )}
      </div>
    </CandidateLayout>
  );
}
