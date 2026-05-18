import { body, query, validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

// ─── Run Validators ───────────────────────────────────────────────────────────

export function validate(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array()[0];
    sendError(res, first.msg as string, 422);
    return;
  }
  next();
}

// ─── Auth Validators ──────────────────────────────────────────────────────────

export const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(['Admin', 'Sales']).withMessage('Role must be Admin or Sales'),

  validate,
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),

  validate,
];

// ─── Lead Validators ──────────────────────────────────────────────────────────

export const createLeadValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),

  body('source')
    .notEmpty().withMessage('Source is required')
    .isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),

  body('phone')
    .optional()
    .matches(/^[\+\d\s\-\(\)]{7,20}$/).withMessage('Invalid phone format'),

  body('notes')
    .optional()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),

  validate,
];

export const updateLeadValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),

  body('source')
    .optional()
    .isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),

  body('phone')
    .optional()
    .matches(/^[\+\d\s\-\(\)]{7,20}$/).withMessage('Invalid phone format'),

  validate,
];

// ─── Lead Query Validators ────────────────────────────────────────────────────

export const leadsQueryValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1–100'),
  query('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost', 'All']),
  query('source').optional().isIn(['Website', 'Instagram', 'Referral', 'All']),
  query('sort').optional().isIn(['latest', 'oldest']),
  validate,
];
