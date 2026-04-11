import { Request, Response } from "express";

// Handle unknown routes with a consistent 404 response.
export function notFoundHandler(req: Request, res: Response) {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}
