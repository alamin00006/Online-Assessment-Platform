"use client";

// Keeps employer dashboard orchestration separate from reusable card and pagination UI.
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { EmployerLayout } from "@/components/shared";
import {
  DashboardPagination,
  DashboardToolbar,
  EmployerExamCard,
} from "@/components/dashboard";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared";
import { api } from "@/services/api";
import { useAuthStore } from "@/stores/auth-store";

const ITEMS_PER_PAGE = 8;

// Renders employer exam management with filtering, pagination, and creation actions.
const EmployerDashboard = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Loads exams created by the authenticated employer.
  const {
    data: exams,
    isLoading,
    isError,
  // Loads server data required by this screen or component.
  } = useQuery({
    queryKey: ["employer-exams", user?.id],
    queryFn: () => api.getExams(user?.id, "employer"),
    enabled: !!user,
  });

  // Derives the visible employer exam list from search input and query data.
  const filtered = useMemo(() => {
    if (!exams) return [];
    if (!search.trim()) return exams;

    return exams.filter((exam) =>
      exam.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [exams, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  // Updates the employer search term and resets pagination for fresh results.
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <EmployerLayout>
      <div className="space-y-7">
        <DashboardToolbar
          title="Online Tests"
          search={search}
          onSearchChange={handleSearchChange}
          actionLabel="Create Online Test"
          onAction={() => router.push("/employer/create-exam")}
        />

        {isLoading && <LoadingState message="Loading exams..." />}
        {isError && <ErrorState message="Failed to load exams." />}

        {exams && filtered.length === 0 && (
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
            {paginated.map((exam) => (
              <EmployerExamCard
                key={exam.id}
                exam={exam}
                onViewCandidates={() =>
                  router.push(`/employer/exam/${exam.id}/candidates`)
                }
              />
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <DashboardPagination
            page={page}
            totalPages={totalPages}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setPage}
          />
        )}
      </div>
    </EmployerLayout>
  );
};

export default EmployerDashboard;




