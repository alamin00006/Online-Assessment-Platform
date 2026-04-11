import { Schema, model, Types } from "mongoose";

// Structure for a single exam question.
const questionSchema = new Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["radio", "checkbox", "text"],
      required: true,
    },
    options: [{ type: String }],
    correctAnswer: { type: Schema.Types.Mixed },
    points: { type: Number, default: 1 },
  },
  { _id: true },
);

// Group questions into a named question set.
const questionSetSchema = new Schema(
  {
    name: { type: String, required: true },
    questions: [questionSchema],
  },
  { _id: true },
);

// Represent exam time slots for the created exam.
const slotSchema = new Schema(
  {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: true },
);

const examSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    totalCandidates: { type: Number, required: true },
    totalSlots: { type: Number, required: true },
    duration: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    negativeMarking: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "active", "completed", "archived"],
      default: "active",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionSets: [questionSetSchema],
    slots: [slotSchema],
  },
  {
    timestamps: true,
  },
);

export interface ExamDocument {
  _id: Types.ObjectId;
  title: string;
}

export const ExamModel = model("Exam", examSchema);
