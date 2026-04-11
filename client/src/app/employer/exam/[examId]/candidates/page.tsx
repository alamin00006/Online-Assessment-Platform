"use client";
// Wrapper page for employer candidate list per exam.
import { ProtectedRoute } from "@/components/shared";
import ViewCandidates from "@/features/employer/ViewCandidates";

// Protects and renders the employer candidate review route.
const ViewCandidatesPage = () => {
  return (
    <ProtectedRoute requiredRole="employer">
      <ViewCandidates />
    </ProtectedRoute>
  );
};

export default ViewCandidatesPage;




