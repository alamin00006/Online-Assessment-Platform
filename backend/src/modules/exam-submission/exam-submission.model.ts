import { Schema, model } from "mongoose";

// Schema for candidate exam submissions and stored answers.
const examSubmissionSchema = new Schema(
  {
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    candidateName: {
      type: String,
      required: true,
      trim: true,
    },
    candidateEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "violated"],
      default: "in-progress",
    },
    answers: {
      type: Schema.Types.Mixed,
      default: {},
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    violations: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

examSubmissionSchema.index({ examId: 1, candidateId: 1 }, { unique: true });

export const ExamSubmissionModel = model(
  "ExamSubmission",
  examSubmissionSchema,
);
