"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import CreateExam from "@/components/pages/CreateExam";

export default function CreateExamPage() {
  return (
    <ProtectedRoute requiredRole="employer">
      <CreateExam />
    </ProtectedRoute>
  );
}
