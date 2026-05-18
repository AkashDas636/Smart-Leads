// ─── Lead Types ───────────────────────────────────────────────────────────────

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type UserRole = 'Admin' | 'Sales';

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string;
  assignedTo?: string;
  phone?: string;
  notes?: string;
}

// ─── User / Auth Types ────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// ─── Filter / Sort Types ──────────────────────────────────────────────────────

export type SortOrder = 'latest' | 'oldest';

export interface FilterState {
  status: LeadStatus | 'All';
  source: LeadSource | 'All';
  search: string;
  sort: SortOrder;
  page: number;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LeadsResponse {
  leads: Lead[];
  pagination: PaginationMeta;
}

export interface ApiError {
  message: string;
  field?: string;
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface LeadFormData {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  phone?: string;
  notes?: string;
}

// ─── Stats Types ──────────────────────────────────────────────────────────────

export interface DashboardStats {
  total: number;
  new: number;
  qualified: number;
  contacted: number;
  lost: number;
  thisWeek: number;
  conversionRate: number;
}
