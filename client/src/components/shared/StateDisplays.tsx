"use client";
// Reusable status components for loading, error, and empty states.
// These helpers are used across the assessment client pages.

import { ReactNode } from "react";
import { AlertTriangle, FileX2, Loader2 } from "lucide-react";

// Displays a consistent loading state for async page sections.
export const LoadingState = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="flex animate-fade-in flex-col items-center justify-center py-16">
      <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
      <p className="font-body text-muted-foreground">{message}</p>
    </div>
  );
};

// Displays a consistent error state for failed async page sections.
export const ErrorState = ({
  message = "Something went wrong.",
}: {
  message?: string;
}) => {
  return (
    <div className="flex animate-fade-in flex-col items-center justify-center py-16">
      <div className="mb-4 rounded-full bg-destructive/10 p-4">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>
      <p className="font-body text-destructive">{message}</p>
    </div>
  );
};

// Displays a consistent empty state when no records are available.
export const EmptyState = ({
  message = "Nothing here yet.",
  description,
  icon,
  className = "",
}: {
  message?: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`flex animate-fade-in flex-col items-center justify-center py-20 ${className}`}
    >
      <div className="mb-5 flex items-center justify-center">
        <div className="relative">
          <div className="flex h-20 w-24 items-center justify-center rounded-[14px] bg-[#edf4ff]">
            {icon ?? <FileX2 className="h-10 w-10 text-[#4da3ff]" />}
          </div>
          <div className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#3ba7ff] text-white shadow-sm">
            <span className="text-lg font-bold leading-none">x</span>
          </div>
          <div className="absolute -right-1 top-1 h-3.5 w-3.5 rounded-full bg-[#9ccc3c]" />
          <div className="absolute right-4 top-0 h-2 w-2 rounded-full bg-[#ffd75e]" />
          <div className="absolute left-1 top-7 h-1.5 w-1.5 rounded-full bg-[#67c5ff]" />
          <div className="absolute right-2 top-5 h-1.5 w-1.5 rounded-full bg-[#67c5ff]" />
          <div className="absolute bottom-2 left-0 h-1.5 w-1.5 rounded-full bg-[#67c5ff]" />
        </div>
      </div>
      <h3 className="mb-2 font-display text-[24px] font-semibold text-[#334155]">
        {message}
      </h3>
      {description && (
        <p className="max-w-md text-center text-[13px] text-[#7b8798]">
          {description}
        </p>
      )}
    </div>
  );
};


