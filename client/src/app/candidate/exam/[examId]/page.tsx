"use client";
// Wrapper page for candidate exam taking flow in the assessment client.
import { ProtectedRoute } from "@/components/shared";
import ExamScreen from "@/features/candidate/ExamScreen";

// Protects and renders the candidate exam-taking route.
const ExamPage = () => {
  return (
    <ProtectedRoute requiredRole="candidate">
      <ExamScreen />
    </ProtectedRoute>
  );
};

export default ExamPage;




