import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { ApiError } from "../../utils/api-error";
import { UserModel } from "./auth.model";
import { loginSchema, registerSchema } from "./auth.validation";

// Handle user registration and ensure duplicate accounts are prevented.
export async function registerUser(input: typeof registerSchema._type) {
  const existingUser = await UserModel.findOne({ email: input.email });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  const password = await bcrypt.hash(input.password, 10);

  return UserModel.create({
    ...input,
    password,
  });
}

// Validate credentials and generate a signed JWT for authenticated users.
export async function loginUser(input: typeof loginSchema._type) {
  const user = await UserModel.findOne({ email: input.email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
  );

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    },
  };
}
