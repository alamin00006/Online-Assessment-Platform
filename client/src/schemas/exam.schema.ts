import { z } from "zod";

export const basicExamInfoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  totalCandidates: z.string().min(1, "Required"),
  totalSlots: z.string().min(1, "Required"),
  questionType: z.string().min(1, "Required"),
  duration: z.string().min(1, "Required"),
  startTime: z.string().min(1, "Required"),
  endTime: z.string().min(1, "Required"),
});

export type BasicExamInfoForm = z.infer<typeof basicExamInfoSchema>;
