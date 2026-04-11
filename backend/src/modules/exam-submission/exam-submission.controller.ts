import { Request, Response } from "express";
import { ApiError } from "../../utils/api-error";
import { apiResponse } from "../../utils/api-response";
import {
  findSubmissionsByExam,
  findSubmissionsByCandidate,
  startExamSubmission,
  submitExamSubmission,
} from "./exam-submission.service";
import {
  startSubmissionSchema,
  submitSubmissionSchema,
} from "./exam-submission.validation";

// Return submissions for the authenticated candidate.
export async function getCandidateSubmissions(req: Request, res: Response) {
  if (!req.auth?.userId) {
    throw new ApiError(401, "Authentication required");
  }

  const submissions = await findSubmissionsByCandidate(req.auth.userId);
  return res.json(apiResponse("Submissions fetched successfully", submissions));
}

// Return all submissions for a specific exam.
export async function getSubmissionsByExam(req: Request, res: Response) {
  const submissions = await findSubmissionsByExam(String(req.params.examId));
  return res.json(
    apiResponse("Exam submissions fetched successfully", submissions),
  );
}

// Start or resume a submission for the current candidate.
export async function startSubmission(req: Request, res: Response) {
  const payload = startSubmissionSchema.parse(req.body);

  if (!req.auth?.userId) {
    throw new ApiError(401, "Authentication required");
  }

  const submission = await startExamSubmission(payload.examId, req.auth.userId);
  return res.json(apiResponse("Exam submission started", submission));
}

// Submit answers for a submission and update status.
export async function submitSubmission(req: Request, res: Response) {
  const payload = submitSubmissionSchema.parse(req.body);
  const submission = await submitExamSubmission(
    String(req.params.submissionId),
    payload.answers,
    payload.violations,
  );

  return res.json(apiResponse("Exam submitted successfully", submission));
}
