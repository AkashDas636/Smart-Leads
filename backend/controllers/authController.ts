import type { Request, Response } from 'express';
import { User } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { sendSuccess, sendError, sendCreated } from '../utils/response.js';
import type { RegisterBody, LoginBody } from '../types/index.js';

// ─── POST /api/auth/register ──────────────────────────────────────────────────

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role }: RegisterBody = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      sendError(res, 'Email already registered', 409);
      return;
    }

    const user = await User.create({ name, email, password, role: role ?? 'Sales' });
    const token = generateToken(user._id.toString(), user.role);

    sendCreated(res, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    }, 'Registration successful');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    sendError(res, message, 500);
  }
}

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password }: LoginBody = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    sendSuccess(res, {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    }, 'Login successful');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    sendError(res, message, 500);
  }
}

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

export async function getMe(req: Request & { user?: { userId: string } }, res: Response): Promise<void> {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }
    sendSuccess(res, user);
  } catch (error) {
    sendError(res, 'Failed to fetch user', 500);
  }
}
