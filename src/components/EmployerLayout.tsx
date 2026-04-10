"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { PortalHeader, PortalPage } from "@/components/PortalChrome";

export function EmployerLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <PortalPage
      header={
        <PortalHeader
          title="Online Test"
          userName={user?.name}
          userRef={user?.id?.slice(0, 8)}
          onLogout={handleLogout}
        />
      }
    >
      {children}
    </PortalPage>
  );
}
