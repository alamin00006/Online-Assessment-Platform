import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DashboardToolbarProps {
  title: string;
  search: string;
  onSearchChange: (value: string) => void;
  actionLabel?: string;
  onAction?: () => void;
}

// Renders dashboard title, search, and optional primary action controls.
export const DashboardToolbar = ({
  title,
  search,
  onSearchChange,
  actionLabel,
  onAction,
}: DashboardToolbarProps) => (
  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
    <h1 className="font-display text-[30px] font-bold text-[#334155]">
      {title}
    </h1>

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-[312px]">
        <Input
          placeholder="Search by exam title"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
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

      {actionLabel && onAction ? (
        <Button
          onClick={onAction}
          className="h-[42px] whitespace-nowrap rounded-[8px] bg-[linear-gradient(90deg,#5c2ef5_0%,#7438f7_100%)] px-5 text-sm font-medium text-white shadow-none hover:opacity-95"
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  </div>
);


