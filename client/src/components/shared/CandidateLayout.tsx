"use client";

// Candidate dashboard layout used in the assessment client.
// Displays a warning when the user goes offline and retains session state.
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { WarningBanner } from "./WarningBanner";
import { AppHeader, AppShell } from "./AppShell";

// Wraps candidate pages with shared chrome and offline awareness.
export const CandidateLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const isOnline = useOnlineStatus();

  // Clears the candidate session and returns the user to the entry page.
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <AppShell
      header={
        <AppHeader
          title="Dashboard"
          userName={user?.name}
          userRef={user?.id?.slice(0, 8)}
          onLogout={handleLogout}
        />
      }
    >
      {!isOnline && (
        <div className="pb-4">
          <WarningBanner
            message="You are offline. Your answers are saved locally and will sync when you reconnect."
            variant="offline"
          />
        </div>
      )}
      {children}
    </AppShell>
  );
};




