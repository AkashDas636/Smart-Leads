import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthRequest, TokenPayload, UserRole } from '../types/index.js';
import { sendError } from '../utils/response.js';

// ─── Auth Middleware ──────────────────────────────────────────────────────────

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Authorization token required', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');

    const decoded = jwt.verify(token, secret) as TokenPayload;

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      sendError(res, 'Token expired. Please login again.', 401);
    } else if (error instanceof jwt.JsonWebTokenError) {
      sendError(res, 'Invalid token', 401);
    } else {
      sendError(res, 'Authentication failed', 401);
    }
  }
}

// ─── Role Guard ───────────────────────────────────────────────────────────────

export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(res, `Access denied. Requires role: ${roles.join(' or ')}`, 403);
      return;
    }

    next();
  };
}

// ─── Admin-only shorthand ─────────────────────────────────────────────────────

export const adminOnly = requireRole('Admin');
