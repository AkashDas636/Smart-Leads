import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import type { Lead, LeadFormData, FilterState, LeadsResponse, DashboardStats } from '@/types';
import { MOCK_LEADS } from '@/data/mockData';

// ─── Types ────────────────────────────────────────────────────────────────────

type LeadsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LEADS'; payload: Lead[] }
  | { type: 'ADD_LEAD'; payload: Lead }
  | { type: 'UPDATE_LEAD'; payload: Lead }
  | { type: 'DELETE_LEAD'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'RESET_FILTERS' };

interface LeadsState {
  allLeads: Lead[];
  filters: FilterState;
  isLoading: boolean;
}

interface LeadsContextValue {
  allLeads: Lead[];
  filteredResponse: LeadsResponse;
  filters: FilterState;
  isLoading: boolean;
  stats: DashboardStats;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  createLead: (data: LeadFormData) => Promise<Lead>;
  updateLead: (id: string, data: Partial<LeadFormData>) => Promise<Lead>;
  deleteLead: (id: string) => Promise<void>;
  getLeadById: (id: string) => Lead | undefined;
}

const LIMIT = 10;

const defaultFilters: FilterState = {
  status: 'All',
  source: 'All',
  search: '',
  sort: 'latest',
  page: 1,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

const initialState: LeadsState = {
  allLeads: [...MOCK_LEADS],
  filters: defaultFilters,
  isLoading: false,
};

function leadsReducer(state: LeadsState, action: LeadsAction): LeadsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_LEADS':
      return { ...state, allLeads: action.payload };
    case 'ADD_LEAD':
      return { ...state, allLeads: [action.payload, ...state.allLeads] };
    case 'UPDATE_LEAD':
      return {
        ...state,
        allLeads: state.allLeads.map(l => l.id === action.payload.id ? action.payload : l),
      };
    case 'DELETE_LEAD':
      return { ...state, allLeads: state.allLeads.filter(l => l.id !== action.payload) };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload, page: action.payload.page ?? 1 } };
    case 'RESET_FILTERS':
      return { ...state, filters: defaultFilters };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const LeadsContext = createContext<LeadsContextValue | null>(null);

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(leadsReducer, initialState);

  // ── Compute filtered + paginated results ──────────────────────────────────
  const filteredResponse = useMemo<LeadsResponse>(() => {
    const { filters, allLeads } = state;
    let leads = [...allLeads];

    // Filter by status
    if (filters.status !== 'All') {
      leads = leads.filter(l => l.status === filters.status);
    }

    // Filter by source
    if (filters.source !== 'All') {
      leads = leads.filter(l => l.source === filters.source);
    }

    // Search by name or email
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      leads = leads.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
      );
    }

    // Sort
    leads.sort((a, b) => {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return filters.sort === 'latest' ? diff : -diff;
    });

    const total = leads.length;
    const totalPages = Math.max(1, Math.ceil(total / LIMIT));
    const page = Math.min(filters.page, totalPages);
    const start = (page - 1) * LIMIT;
    const paginated = leads.slice(start, start + LIMIT);

    return {
      leads: paginated,
      pagination: { total, page, limit: LIMIT, totalPages },
    };
  }, [state.allLeads, state.filters]);

  // ── Dashboard Stats ───────────────────────────────────────────────────────
  const stats = useMemo<DashboardStats>(() => {
    const leads = state.allLeads;
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const qualified = leads.filter(l => l.status === 'Qualified').length;
    const total = leads.length;

    return {
      total,
      new: leads.filter(l => l.status === 'New').length,
      qualified,
      contacted: leads.filter(l => l.status === 'Contacted').length,
      lost: leads.filter(l => l.status === 'Lost').length,
      thisWeek: leads.filter(l => new Date(l.createdAt) >= oneWeekAgo).length,
      conversionRate: total > 0 ? Math.round((qualified / total) * 100) : 0,
    };
  }, [state.allLeads]);

  const setFilters = useCallback((filters: Partial<FilterState>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const createLead = useCallback(async (data: LeadFormData): Promise<Lead> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    await new Promise(res => setTimeout(res, 500));
    const newLead: Lead = {
      ...data,
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_LEAD', payload: newLead });
    dispatch({ type: 'SET_LOADING', payload: false });
    return newLead;
  }, []);

  const updateLead = useCallback(async (id: string, data: Partial<LeadFormData>): Promise<Lead> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    await new Promise(res => setTimeout(res, 500));
    const existing = state.allLeads.find(l => l.id === id);
    if (!existing) throw new Error('Lead not found');
    const updated: Lead = { ...existing, ...data };
    dispatch({ type: 'UPDATE_LEAD', payload: updated });
    dispatch({ type: 'SET_LOADING', payload: false });
    return updated;
  }, [state.allLeads]);

  const deleteLead = useCallback(async (id: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    await new Promise(res => setTimeout(res, 400));
    dispatch({ type: 'DELETE_LEAD', payload: id });
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const getLeadById = useCallback((id: string) => {
    return state.allLeads.find(l => l.id === id);
  }, [state.allLeads]);

  return (
    <LeadsContext.Provider value={{
      allLeads: state.allLeads,
      filteredResponse,
      filters: state.filters,
      isLoading: state.isLoading,
      stats,
      setFilters,
      resetFilters,
      createLead,
      updateLead,
      deleteLead,
      getLeadById,
    }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads(): LeadsContextValue {
  const ctx = useContext(LeadsContext);
  if (!ctx) throw new Error('useLeads must be used within LeadsProvider');
  return ctx;
}
