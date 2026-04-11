"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import EmployerDashboard from "@/components/pages/EmployerDashboard";

export default function EmployerPage() {
  return (
    <ProtectedRoute requiredRole="employer">
      <EmployerDashboard />
    </ProtectedRoute>
  );
}
