"use client";

// Employer dashboard layout used in the assessment client.
// Wraps pages with shared portal styling and logout behavior.
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { AppHeader, AppShell } from "./AppShell";

// Wraps employer pages with shared chrome and account controls.
export const EmployerLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  // Clears the employer session and returns the user to the entry page.
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <AppShell
      header={
        <AppHeader
          title="Online Test"
          userName={user?.name}
          userRef={user?.id?.slice(0, 8)}
          onLogout={handleLogout}
        />
      }
    >
      {children}
    </AppShell>
  );
};




