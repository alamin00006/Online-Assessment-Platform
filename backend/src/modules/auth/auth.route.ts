import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { login, register } from "./auth.controller";

const router = Router();

// Public authentication endpoints.
router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

export default router;
