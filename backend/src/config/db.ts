import mongoose from "mongoose";
import { env } from "./env";

// Connect to MongoDB using the configured connection string.
export async function connectDatabase() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("MongoDB connected");
}
