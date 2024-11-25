// errorHandler.ts
import { Request, Response, NextFunction } from "express";

// Global error handling middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err.message || err); // Log the error

  res.status(err.status || 500).json({
    message: err.message || "An unexpected error occurred",
  });
};
