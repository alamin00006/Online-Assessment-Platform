import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { asyncHandler } from "../../utils/async-handler";
import {
  getSubmissionsByExam,
  getCandidateSubmissions,
  startSubmission,
  submitSubmission,
} from "./exam-submission.controller";

const router = Router();

// Protected submission endpoints for candidates and exam reporting.
router.get("/", requireAuth, asyncHandler(getCandidateSubmissions));
router.get("/exam/:examId", requireAuth, asyncHandler(getSubmissionsByExam));
router.post("/start", requireAuth, asyncHandler(startSubmission));
router.post(
  "/:submissionId/submit",
  requireAuth,
  asyncHandler(submitSubmission),
);

export default router;
