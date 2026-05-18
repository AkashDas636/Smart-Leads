import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginCredentials } from '@/types';
import { Zap, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

interface Props {
  onSwitchToRegister: () => void;
}

export default function LoginPage({ onSwitchToRegister }: Props) {
  const { login } = useAuth();
  const [creds, setCreds] = useState<LoginCredentials>({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});

  const validate = (): boolean => {
    const e: Partial<LoginCredentials> = {};
    if (!creds.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(creds.email)) e.email = 'Invalid email format';
    if (!creds.password) e.password = 'Password is required';
    else if (creds.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);
    try {
      await login(creds);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email: string) => {
    setCreds({ email, password: 'password123' });
    setErrors({});
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Zap className="w-5 h-5 text-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">SmartLeads</span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
          <p className="text-muted-foreground text-sm mb-7">Sign in to your dashboard</p>

          {/* Demo accounts */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => fillDemo('admin@smartleads.io')}
              className="flex-1 text-xs py-2 px-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            >
              Demo Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('sales@smartleads.io')}
              className="flex-1 text-xs py-2 px-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
            >
              Demo Sales
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                value={creds.email}
                onChange={e => { setCreds(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: undefined })); }}
                placeholder="you@company.io"
                className={`w-full bg-card border rounded-xl px-4 py-3 text-foreground placeholder-slate-500 text-sm outline-none focus:ring-1 transition-all ${errors.email ? 'border-rose-500/50 focus:ring-rose-500/30' : 'border-border focus:border-cyan-500/50 focus:ring-cyan-500/20'}`}
              />
              {errors.email && <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={creds.password}
                  onChange={e => { setCreds(p => ({ ...p, password: e.target.value })); setErrors(p => ({ ...p, password: undefined })); }}
                  placeholder="••••••••"
                  className={`w-full bg-card border rounded-xl px-4 py-3 pr-11 text-foreground placeholder-slate-500 text-sm outline-none focus:ring-1 transition-all ${errors.password ? 'border-rose-500/50 focus:ring-rose-500/30' : 'border-border focus:border-cyan-500/50 focus:ring-cyan-500/20'}`}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20 text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Don't have an account?{' '}
            <button onClick={onSwitchToRegister} className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
