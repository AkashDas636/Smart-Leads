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
      {/* Animated gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-30%] left-[-15%] w-[700px] h-[700px] bg-cyan-500/8 rounded-full blur-3xl animate-gradient-shift" />
        <div className="absolute bottom-[-30%] right-[-15%] w-[600px] h-[600px] bg-indigo-500/8 rounded-full blur-3xl animate-gradient-shift" style={{ animationDelay: '-2s' }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom duration-500">
        {/* Logo with animation */}
        <div className="flex items-center gap-3 mb-12 animate-in fade-in slide-in-from-left duration-500">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 group hover:scale-110 transition-transform duration-300 cursor-pointer">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">SmartLeads</span>
        </div>

        {/* Main card */}
        <div className="bg-card border border-border rounded-2xl p-8 backdrop-blur-xl shadow-card-lg hover:shadow-card hover:border-cyan-500/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-500 delay-100">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground text-sm mb-8">Sign in to your dashboard</p>

          {/* Demo accounts */}
          <div className="flex gap-3 mb-7 animate-in fade-in slide-in-from-bottom duration-500 delay-200">
            <button
              type="button"
              onClick={() => fillDemo('admin@smartleads.io')}
              className="flex-1 text-xs py-3 px-4 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25 hover:border-cyan-500/50 hover:shadow-md transition-all duration-200 font-semibold hover:scale-105 shadow-card"
            >
              👤 Demo Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('sales@smartleads.io')}
              className="flex-1 text-xs py-3 px-4 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/25 hover:border-indigo-500/50 hover:shadow-md transition-all duration-200 font-semibold hover:scale-105 shadow-card"
            >
              📊 Demo Sales
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-rose-500/15 border border-rose-500/40 text-rose-300 text-sm rounded-xl px-4 py-3.5 mb-6 animate-in slide-in-from-top duration-300 shadow-card">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-300">
              <label className="block text-sm font-semibold text-foreground mb-2.5">Email Address</label>
              <input
                type="email"
                value={creds.email}
                onChange={e => { setCreds(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: undefined })); }}
                placeholder="you@company.io"
                className={`w-full bg-card border rounded-xl px-4 py-3.5 text-foreground placeholder-muted-foreground text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 shadow-card hover:shadow-card-lg ${errors.email ? 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/20' : 'border-border focus:border-cyan-500/50'}`}
              />
              {errors.email && <p className="text-rose-400 text-xs mt-2 flex items-center gap-1.5 font-medium"><AlertCircle className="w-3.5 h-3.5" />{errors.email}</p>}
            </div>

            {/* Password field */}
            <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-400">
              <label className="block text-sm font-semibold text-foreground mb-2.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={creds.password}
                  onChange={e => { setCreds(p => ({ ...p, password: e.target.value })); setErrors(p => ({ ...p, password: undefined })); }}
                  placeholder="••••••••"
                  className={`w-full bg-card border rounded-xl px-4 py-3.5 pr-12 text-foreground placeholder-muted-foreground text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 shadow-card hover:shadow-card-lg ${errors.password ? 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/20' : 'border-border focus:border-cyan-500/50'}`}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all hover:scale-110 duration-200">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-400 text-xs mt-2 flex items-center gap-1.5 font-medium"><AlertCircle className="w-3.5 h-3.5" />{errors.password}</p>}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 hover:-translate-y-0.5 text-sm mt-6 animate-in fade-in slide-in-from-bottom duration-500 delay-500"
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

          {/* Sign up link */}
          <p className="text-sm text-muted-foreground text-center mt-7 animate-in fade-in slide-in-from-bottom duration-500 delay-600">
            Don't have an account?{' '}
            <button onClick={onSwitchToRegister} className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors hover:underline">
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
