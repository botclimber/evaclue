import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../helpers/ErrorTypes";

export const errorMiddleware = (
  error: Error & Partial<ErrorHandler>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode ?? 500;
  const message = error.statusCode ? error.message : "Internal Server Error";
  return res.status(statusCode).json({ message: error.message });
};
