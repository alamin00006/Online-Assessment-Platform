import { ApiError } from "../../utils/api-error";
import { Types } from "mongoose";
import { UserModel } from "../auth/auth.model";
import { ExamModel } from "../exam/exam.model";
import { ExamSubmissionModel } from "./exam-submission.model";

// Fetch submissions for a single candidate, newest first.
export const findSubmissionsByCandidate = async (candidateId: string) => {
  return ExamSubmissionModel.find({ candidateId }).sort({ createdAt: -1 });
};

// Fetch submissions for a specific exam.
export const findSubmissionsByExam = async (examId: string) => {
  return ExamSubmissionModel.find({ examId }).sort({ createdAt: -1 });
};

// Start a submission if the exam and candidate exist, or resume an existing one.
export const startExamSubmission = async (
  examId: string,
  candidateId: string,
) => {
  const exam = await ExamModel.findById(examId);

  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }

  const candidate = await UserModel.findById(candidateId);

  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }

  const totalQuestions = exam.questionSets.reduce(
    (sum, set) => sum + set.questions.length,
    0,
  );

  return ExamSubmissionModel.findOneAndUpdate(
    { examId, candidateId },
    {
      $set: {
        status: "in-progress",
        totalQuestions,
        startedAt: new Date(),
        candidateName: candidate.name,
        candidateEmail: candidate.email,
      },
      $setOnInsert: {
        answers: {},
        violations: 0,
      },
    },
    {
      new: true,
      upsert: true,
    },
  );
};

// Submit a submission, calculate result status, and save answer data.
export const submitExamSubmission = async (
  submissionId: string,
  candidateId: string,
  answers: Record<string, string | string[]>,
  violations: number,
) => {
  if (!Types.ObjectId.isValid(submissionId)) {
    throw new ApiError(400, "Invalid submission id");
  }

  const submission = await ExamSubmissionModel.findById(submissionId);

  if (!submission) {
    throw new ApiError(404, "Submission not found");
  }

  if (submission.candidateId.toString() !== candidateId) {
    throw new ApiError(403, "You cannot submit this exam attempt");
  }

  submission.answers = answers;
  submission.violations = violations;
  submission.status = violations >= 3 ? "violated" : "completed";
  submission.submittedAt = new Date();
  submission.score = Math.floor(Math.random() * 40) + 60;

  await submission.save();
  return submission;
};
