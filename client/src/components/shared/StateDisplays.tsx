"use client";
// Reusable status components for loading, error, and empty states.
// These helpers are used across the assessment client pages.

import { ReactNode } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

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

// Renders the empty online-test illustration used by dashboard empty states.
export const EmptyOnlineTestIcon = () => (
  <div className="relative h-[82px] w-[96px]">
    <div className="absolute bottom-0 left-1/2 h-[40px] w-[76px] -translate-x-1/2 rounded-[6px] bg-[#6b7a8f]" />
    <div className="absolute bottom-[9px] left-1/2 h-[24px] w-[54px] -translate-x-1/2 rounded-[3px] bg-[#9dd5ff]" />
    <div className="absolute bottom-[2px] left-1/2 h-[7px] w-[40px] -translate-x-1/2 rounded-t-[5px] bg-[#516174]" />
    <div className="absolute left-[5px] top-[4px] flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#3ba7ff] text-[22px] font-bold leading-none text-white shadow-sm">
      x
    </div>
    <div className="absolute right-[22px] top-[10px] h-[8px] w-[8px] rounded-full bg-[#9ccc3c]" />
    <div className="absolute right-[9px] top-[2px] h-[5px] w-[5px] rounded-full bg-[#67c5ff]" />
    <div className="absolute left-[1px] top-[48px] h-[5px] w-[5px] rounded-full bg-[#67c5ff]" />
  </div>
);

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
        {icon ?? <EmptyOnlineTestIcon />}
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

