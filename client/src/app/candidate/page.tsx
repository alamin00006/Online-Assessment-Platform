"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import CandidateDashboard from "@/components/pages/CandidateDashboard";

export default function CandidatePage() {
  return (
    <ProtectedRoute requiredRole="candidate">
      <CandidateDashboard />
    </ProtectedRoute>
  );
}
