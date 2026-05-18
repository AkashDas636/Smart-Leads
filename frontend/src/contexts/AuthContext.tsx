import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { AuthState, User, LoginCredentials, RegisterPayload, UserRole } from '@/types';
import { MOCK_USERS, MOCK_CREDENTIALS } from '@/data/mockData';

// ─── JWT Simulation ───────────────────────────────────────────────────────────

function generateToken(user: User): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: user.id, email: user.email, role: user.role, iat: Date.now() }));
  const signature = btoa(`${user.id}-${user.email}-secret`);
  return `${header}.${payload}.${signature}`;
}

function decodeToken(token: string): { sub: string; email: string; role: UserRole } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: { user: User; token: string } };

interface AuthContextValue extends AuthState {
  login: (creds: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return { ...state, isLoading: false, isAuthenticated: true, user: action.payload.user, token: action.payload.token };
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'RESTORE_SESSION':
      return { ...state, isLoading: false, isAuthenticated: true, user: action.payload.user, token: action.payload.token };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('sl_token');
    const userData = localStorage.getItem('sl_user');
    if (token && userData) {
      try {
        const decoded = decodeToken(token);
        const user: User = JSON.parse(userData);
        if (decoded && decoded.sub === user.id) {
          dispatch({ type: 'RESTORE_SESSION', payload: { user, token } });
          return;
        }
      } catch {
        // invalid session
      }
    }
    dispatch({ type: 'LOGOUT' });
  }, []);

  const login = useCallback(async (creds: LoginCredentials): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    // Simulate network delay
    await new Promise(res => setTimeout(res, 800));

    const expectedPassword = MOCK_CREDENTIALS[creds.email];
    if (!expectedPassword || expectedPassword !== creds.password) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw new Error('Invalid email or password');
    }

    const user = MOCK_USERS.find(u => u.email === creds.email);
    if (!user) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw new Error('User not found');
    }

    const token = generateToken(user);
    localStorage.setItem('sl_token', token);
    localStorage.setItem('sl_user', JSON.stringify(user));
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
  }, []);

  const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    await new Promise(res => setTimeout(res, 800));

    const exists = MOCK_USERS.find(u => u.email === payload.email);
    if (exists) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: `u_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      createdAt: new Date().toISOString(),
    };

    MOCK_USERS.push(newUser);
    MOCK_CREDENTIALS[payload.email] = payload.password;

    const token = generateToken(newUser);
    localStorage.setItem('sl_token', token);
    localStorage.setItem('sl_user', JSON.stringify(newUser));
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user: newUser, token } });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sl_token');
    localStorage.removeItem('sl_user');
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
