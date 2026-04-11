import { z } from "zod";

// Payload required to start an exam submission.
export const startSubmissionSchema = z.object({
  examId: z.string().min(1),
});

// Payload required to submit an exam submission.
export const submitSubmissionSchema = z.object({
  answers: z.record(z.union([z.string(), z.array(z.string())])),
  violations: z.number().int().nonnegative(),
});
