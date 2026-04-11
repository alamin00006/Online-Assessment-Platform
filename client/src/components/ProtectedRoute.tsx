"use client";

// Protects pages by ensuring only authenticated users with the correct role can access them.
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace("/");
      return;
    }
    if (requiredRole && user.role !== requiredRole) {
      router.replace(user.role === "employer" ? "/employer" : "/candidate");
    }
  }, [isAuthenticated, user, requiredRole, router]);

  if (!isAuthenticated || !user) return null;
  if (requiredRole && user.role !== requiredRole) return null;

  return <>{children}</>;
}
