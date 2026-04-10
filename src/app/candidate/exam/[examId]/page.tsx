"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import ExamScreen from "@/components/pages/ExamScreen";

export default function ExamPage() {
  return (
    <ProtectedRoute requiredRole="candidate">
      <ExamScreen />
    </ProtectedRoute>
  );
}
