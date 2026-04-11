import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Validate and normalize environment variables before the app starts.
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z
    .string()
    .default("http://localhost:3000,http://localhost:3001"),
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  ...parsedEnv,
  CORS_ORIGINS: parsedEnv.CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
