import type { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// ─── Global Error Handler ─────────────────────────────────────────────────────

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  sendError(res, message, statusCode);
}

// ─── 404 Handler ──────────────────────────────────────────────────────────────

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
}

// ─── Create Operational Error ─────────────────────────────────────────────────

export function createError(message: string, statusCode: number): AppError {
  const err: AppError = new Error(message);
  err.statusCode = statusCode;
  err.isOperational = true;
  return err;
}
