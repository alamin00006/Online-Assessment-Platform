import { z } from "zod";

const getTimeInMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const basicExamInfoSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  totalCandidates: z.string().min(1, "Required"),
  totalSlots: z.string().min(1, "Required"),
  questionType: z.string().min(1, "Required"),
  duration: z.string().optional(),
  startTime: z.string().min(1, "Required"),
  endTime: z.string().min(1, "Required"),
}).superRefine((data, context) => {
  if (!data.startTime || !data.endTime) return;

  const startMinutes = getTimeInMinutes(data.startTime);
  const endMinutes = getTimeInMinutes(data.endTime);

  if (endMinutes <= startMinutes) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["endTime"],
      message: "End time must be after start time",
    });
  }
});

export type BasicExamInfoForm = z.infer<typeof basicExamInfoSchema>;
