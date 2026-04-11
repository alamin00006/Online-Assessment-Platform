"use client";

import { ProtectedRoute } from "@/components/shared";
import CandidateDashboard from "@/features/candidate/CandidateDashboard";

// Protects and renders the candidate dashboard route.
const CandidatePage = () => {
  return (
    <ProtectedRoute requiredRole="candidate">
      <CandidateDashboard />
    </ProtectedRoute>
  );
};

export default CandidatePage;




