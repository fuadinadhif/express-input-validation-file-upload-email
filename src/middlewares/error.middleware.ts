import { AppError } from "@/errors/app.error.js";
import logger from "@/utils/logger.js";
import { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";

export function errorMiddleware(
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof Error) {
    logger.error(error.stack || error);
  } else {
    logger.error("Non-error thrown:", error);
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof ZodError) {
    return response
      .status(400)
      .json({ error: z.flattenError(error).fieldErrors });
  }

  response.status(500).json({
    message:
      error instanceof Error ? error.message : "Unknown error. Good luck",
  });
}
