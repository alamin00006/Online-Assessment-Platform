"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import ViewCandidates from "@/components/pages/ViewCandidates";

export default function ViewCandidatesPage() {
  return (
    <ProtectedRoute requiredRole="employer">
      <ViewCandidates />
    </ProtectedRoute>
  );
}
