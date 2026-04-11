import { ApiError } from "../../utils/api-error";
import { ExamModel } from "./exam.model";
import { createExamSchema } from "./exam.validation";

// Return exams owned by an employer or active exams for candidates.
export async function findExamsByRole(userId?: string, role?: string) {
  const query =
    role === "employer" && userId
      ? { createdBy: userId }
      : { status: "active" };

  return ExamModel.find(query).sort({ createdAt: -1 });
}

// Retrieve a single exam by ID and fail if it does not exist.
export async function findExamById(examId: string) {
  const exam = await ExamModel.findById(examId);

  if (!exam) {
    throw new ApiError(404, "Exam not found");
  }

  return exam;
}

// Create a new exam record for an employer and generate slot placeholders.
export async function createExamForEmployer(
  payload: typeof createExamSchema._type,
  employerId: string,
) {
  const slots = Array.from({ length: payload.totalSlots }, () => ({
    startTime: payload.startTime,
    endTime: payload.endTime,
  }));

  return ExamModel.create({
    ...payload,
    createdBy: employerId,
    slots,
    status: "active",
  });
}
