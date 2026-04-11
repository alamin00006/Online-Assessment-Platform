import { Schema, model } from "mongoose";

export type UserRole = "employer" | "candidate";

// Mongoose schema for user accounts and authentication data.
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["employer", "candidate"],
      required: true,
    },
    employeeId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model("User", userSchema);
