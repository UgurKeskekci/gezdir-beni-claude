import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Express 5 forwards rejected promises to the error handler, but only for handlers
 * it recognises as async. Wrapping keeps that behaviour explicit and typed.
 */
export function asyncHandler(
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
