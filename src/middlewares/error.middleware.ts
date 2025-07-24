import { AppError } from "@/errors/app.error.js";
import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof Error) {
    console.error(error.stack || error);
  } else {
    console.error("Non-error thrown:", error);
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  response.status(500).json({
    message:
      error instanceof Error ? error.message : "Unknown error. Good luck",
  });
}
