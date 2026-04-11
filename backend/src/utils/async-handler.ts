import { NextFunction, Request, Response } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

// Wrap async route handlers so thrown errors are forwarded to Express error middleware.
export function asyncHandler(controller: AsyncController) {
  return (req: Request, res: Response, next: NextFunction) => {
    controller(req, res, next).catch(next);
  };
}
