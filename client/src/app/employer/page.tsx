"use client";

import { ProtectedRoute } from "@/components/shared";
import EmployerDashboard from "@/features/employer/EmployerDashboard";

// Protects and renders the employer dashboard route.
const EmployerPage = () => {
  return (
    <ProtectedRoute requiredRole="employer">
      <EmployerDashboard />
    </ProtectedRoute>
  );
};

export default EmployerPage;




