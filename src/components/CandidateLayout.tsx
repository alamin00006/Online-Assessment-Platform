"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { WarningBanner } from "@/components/WarningBanner";
import { PortalHeader, PortalPage } from "@/components/PortalChrome";

export function CandidateLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const isOnline = useOnlineStatus();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <PortalPage
      header={
        <PortalHeader
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
    </PortalPage>
  );
}
