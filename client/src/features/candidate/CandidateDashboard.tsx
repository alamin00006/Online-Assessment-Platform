"use client";

// Keeps candidate dashboard orchestration separate from reusable card and pagination UI.
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CandidateLayout } from "@/components/shared";
import {
  CandidateExamCard,
  DashboardPagination,
  DashboardToolbar,
} from "@/components/dashboard";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared";
import { api } from "@/services/api";
import { useAuthStore } from "@/stores/auth-store";

const ITEMS_PER_PAGE = 8;

// Renders candidate exams with filtering, pagination, and start actions.
const CandidateDashboard = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Loads candidate exams together with any existing attempt status.
  const { data, isLoading, isError } = useQuery({
    queryKey: ["candidate-exams", user?.id],
    queryFn: () => api.getExamsForCandidate(user!.id),
    enabled: !!user,
  });

  // Derives the visible candidate exam list from search input and query data.
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

  // Updates the dashboard search term and returns pagination to the first page.
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <CandidateLayout>
      <div className="space-y-7">
        <DashboardToolbar
          title="Online Tests"
          search={search}
          onSearchChange={handleSearchChange}
        />

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
            {paginated.map(({ exam, attempt }) => (
              <CandidateExamCard
                key={exam.id}
                exam={exam}
                attempt={attempt}
                onStart={() => router.push(`/candidate/exam/${exam.id}`)}
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
    </CandidateLayout>
  );
};

export default CandidateDashboard;




