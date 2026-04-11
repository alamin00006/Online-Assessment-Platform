import { z } from "zod";

// Define the shape of a single exam question and how it must be validated.
export const questionSchema = z.object({
  title: z.string().min(3),
  type: z.enum(["radio", "checkbox", "text"]),
  options: z.array(z.string()).optional(),
  correctAnswer: z.any().optional(),
  points: z.number().int().positive().default(1),
});

// Group questions into named sets for an exam.
export const questionSetSchema = z.object({
  name: z.string().min(1),
  questions: z.array(questionSchema),
});

// Validation rules for exam creation payloads.
export const createExamSchema = z.object({
  title: z.string().min(3),
  totalCandidates: z.number().int().nonnegative(),
  totalSlots: z.number().int().positive(),
  duration: z.number().int().positive(),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  negativeMarking: z.boolean().optional(),
  questionSets: z.array(questionSetSchema).default([]),
});
