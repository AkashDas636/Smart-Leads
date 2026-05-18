import jwt from 'jsonwebtoken';
import type { TokenPayload, UserRole } from '../types/index.js';

export function generateToken(userId: string, role: UserRole): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');

  const payload: Omit<TokenPayload, keyof jwt.JwtPayload> = { userId, role };

  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as jwt.SignOptions['expiresIn'],
  });
}
