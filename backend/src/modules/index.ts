import { Router } from "express";
import authRoutes from "./auth/auth.route";
import examRoutes from "./exam/exam.route";
import attemptRoutes from "./exam-submission/exam-submission.route";

const router = Router();

// Health check endpoint for readiness and liveness checks.
router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});

// Mount module routers under the API namespace.
router.use("/auth", authRoutes);
router.use("/exams", examRoutes);
router.use("/exam-submissions", attemptRoutes);

export default router;
