import { z } from "zod";

export const questionSchema = z.object({
  title: z.string().min(3, "Question must be at least 3 characters"),
  type: z.enum(["radio", "checkbox", "text"]),
  points: z.string().min(1, "Points required"),
});

export type QuestionForm = z.infer<typeof questionSchema>;

