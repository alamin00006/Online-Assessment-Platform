import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { asyncHandler } from "../../utils/async-handler";
import { createExam, getExamById, getExams } from "./exam.controller";

const router = Router();

// Protected exam routes require authentication.
router.get("/", requireAuth, asyncHandler(getExams));
router.get("/:examId", requireAuth, asyncHandler(getExamById));
router.post("/", requireAuth, asyncHandler(createExam));

export default router;
