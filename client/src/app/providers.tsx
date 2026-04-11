"use client";

// Provides client-only context providers used by the application shell.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { Toaster } from "sonner";
// Imports reusable UI.
import { TooltipProvider } from "@/components/ui/tooltip";

// Creates stable provider instances for React Query, tooltips, and notifications.
export const AppProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

