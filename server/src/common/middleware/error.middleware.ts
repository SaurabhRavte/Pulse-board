import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error(
    `[err] ${req.method} ${req.originalUrl}:`,
    err instanceof Error ? err.stack : err,
  );
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
    });
    return;
  }

  console.error("[unhandled]", err);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
    data: null,
  });
};

const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

export { errorHandler, notFoundHandler };
