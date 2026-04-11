import { ChevronLeft, ChevronRight } from "lucide-react";
// Imports reusable UI.
import { Button } from "@/components/ui/button";

interface DashboardPaginationProps {
  page: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

// Renders pagination controls and page-size context for dashboards.
export const DashboardPagination = ({
  page,
  totalPages,
  itemsPerPage,
  onPageChange,
}: DashboardPaginationProps) => (
  <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="h-7 w-7 rounded-[6px] border-[#e6ebf2] text-[#94a3b8]"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </Button>

      {Array.from({ length: totalPages }, (_, i) => (
        <Button
          key={i + 1}
          variant={page === i + 1 ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(i + 1)}
          className={
            page === i + 1
              ? "h-7 min-w-7 rounded-[6px] bg-primary px-2 text-xs text-primary-foreground"
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
        onClick={() => onPageChange(page + 1)}
        className="h-7 w-7 rounded-[6px] border-[#e6ebf2] text-[#334155]"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>

    <span className="text-[11px] text-[#64748b]">
      Online Test Per Page{" "}
      <span className="font-medium text-[#334155]">{itemsPerPage}</span>
    </span>
  </div>
);


