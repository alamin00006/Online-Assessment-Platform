"use client";
// Wrapper page for employer exam creation in the interview task frontend.
import { ProtectedRoute } from "@/components/ProtectedRoute";
import CreateExam from "@/components/pages/CreateExam";

export default function CreateExamPage() {
  return (
    <ProtectedRoute requiredRole="employer">
      <CreateExam />
    </ProtectedRoute>
  );
}
