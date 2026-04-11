import { Request, Response } from "express";
import { ApiError } from "../../utils/api-error";
import { apiResponse } from "../../utils/api-response";
import {
  createExamForEmployer,
  findExamById,
  findExamsByRole,
} from "./exam.service";
import { createExamSchema } from "./exam.validation";

export async function getExams(req: Request, res: Response) {
  const exams = await findExamsByRole(req.auth?.userId, req.auth?.role);
  return res.json(apiResponse("Exams fetched successfully", exams));
}

export async function getExamById(req: Request, res: Response) {
  const exam = await findExamById(String(req.params.examId));
  return res.json(apiResponse("Exam fetched successfully", exam));
}

export async function createExam(req: Request, res: Response) {
  const payload = createExamSchema.parse(req.body);

  if (!req.auth?.userId) {
    throw new ApiError(401, "Authentication required");
  }

  const exam = await createExamForEmployer(payload, req.auth.userId);
  return res.status(201).json(apiResponse("Exam created successfully", exam));
}
