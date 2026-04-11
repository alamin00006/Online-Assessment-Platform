import { Request, Response } from "express";
import { apiResponse } from "../../utils/api-response";
import { loginUser, registerUser } from "./auth.service";
import { loginSchema, registerSchema } from "./auth.validation";

// Handle registration requests and return normalized user data.
export async function register(req: Request, res: Response) {
  const payload = registerSchema.parse(req.body);
  const user = await registerUser(payload);

  return res.status(201).json(
    apiResponse("User registered successfully", {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    }),
  );
}

// Authenticate users and return a JWT with user details.
export async function login(req: Request, res: Response) {
  const payload = loginSchema.parse(req.body);
  const data = await loginUser(payload);

  return res.json(apiResponse("Login successful", data));
}
