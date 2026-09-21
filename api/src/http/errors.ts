import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

/** An error the client is allowed to see. Anything else becomes a generic 500. */
export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (message: string, details?: unknown) =>
  new AppError(400, "bad_request", message, details);
export const unauthorized = (message = "Authentication required") =>
  new AppError(401, "unauthorized", message);
export const notFound = (message = "Not found") =>
  new AppError(404, "not_found", message);
export const conflict = (message: string, details?: unknown) =>
  new AppError(409, "conflict", message, details);

export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  next(notFound(`No route for ${req.method} ${req.path}`));
}

/**
 * Every error leaves through here in the same shape:
 *   { error: { code, message, details? } }
 * Unexpected errors are logged in full but reported without internals.
 */
export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) return next(error);

  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "validation_failed",
        message: "Request did not match the expected shape",
        details: error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.details === undefined ? {} : { details: error.details }),
      },
    });
    return;
  }

  console.error("Unhandled error:", error);
  res.status(500).json({
    error: { code: "internal_error", message: "Something went wrong" },
  });
}
