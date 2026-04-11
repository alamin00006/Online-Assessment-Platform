// Page for employer exam creation.
import { ProtectedRoute } from "@/components/shared";
import CreateExam from "@/features/employer/CreateExam";

// Protects and renders the employer exam creation route.
const CreateExamPage = () => {
  return (
    <ProtectedRoute requiredRole="employer">
      <CreateExam />
    </ProtectedRoute>
  );
};

export default CreateExamPage;




