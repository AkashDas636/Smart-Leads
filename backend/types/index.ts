import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

// ─── Enums ────────────────────────────────────────────────────────────────────

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type UserRole = 'Admin' | 'Sales';

// ─── JWT ─────────────────────────────────────────────────────────────────────

export interface TokenPayload extends JwtPayload {
  userId: string;
  role: UserRole;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginBody {
  email: string;
  password: string;
}

// ─── Lead ─────────────────────────────────────────────────────────────────────

export interface CreateLeadBody {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
  phone?: string;
  notes?: string;
}

export interface UpdateLeadBody {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
  phone?: string;
  notes?: string;
}

export interface LeadQuery {
  status?: LeadStatus | 'All';
  source?: LeadSource | 'All';
  search?: string;
  sort?: 'latest' | 'oldest';
  page?: string;
  limit?: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Request Extensions ───────────────────────────────────────────────────────

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}
