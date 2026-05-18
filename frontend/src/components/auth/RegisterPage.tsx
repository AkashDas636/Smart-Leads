import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { RegisterPayload, UserRole } from '@/types';
import { Zap, Eye, EyeOff, AlertCircle, ArrowRight, Shield, TrendingUp } from 'lucide-react';

interface Props {
  onSwitchToLogin: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage({ onSwitchToLogin }: Props) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'Sales' as UserRole });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);
    try {
      const payload: RegisterPayload = { name: form.name, email: form.email, password: form.password, role: form.role };
      await register(payload);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(p => ({ ...p, [key]: e.target.value }));
      setErrors(p => ({ ...p, [key]: undefined }));
    },
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Zap className="w-5 h-5 text-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">SmartLeads</span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <h1 className="text-2xl font-bold text-foreground mb-1">Create account</h1>
          <p className="text-muted-foreground text-sm mb-7">Start managing your leads today</p>

          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="Alex Rivera"
                {...field('name')}
                className={`w-full bg-card border rounded-xl px-4 py-3 text-foreground placeholder-slate-500 text-sm outline-none focus:ring-1 transition-all ${errors.name ? 'border-rose-500/50 focus:ring-rose-500/30' : 'border-border focus:border-cyan-500/50 focus:ring-cyan-500/20'}`}
              />
              {errors.name && <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@company.io"
                {...field('email')}
                className={`w-full bg-card border rounded-xl px-4 py-3 text-foreground placeholder-slate-500 text-sm outline-none focus:ring-1 transition-all ${errors.email ? 'border-rose-500/50 focus:ring-rose-500/30' : 'border-border focus:border-cyan-500/50 focus:ring-cyan-500/20'}`}
              />
              {errors.email && <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Role</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Admin', 'Sales'] as UserRole[]).map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, role }))}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${form.role === role ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400' : 'bg-card border-border text-muted-foreground hover:border-border'}`}
                  >
                    {role === 'Admin' ? <Shield className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  {...field('password')}
                  className={`w-full bg-card border rounded-xl px-4 py-3 pr-11 text-foreground placeholder-slate-500 text-sm outline-none focus:ring-1 transition-all ${errors.password ? 'border-rose-500/50 focus:ring-rose-500/30' : 'border-border focus:border-cyan-500/50 focus:ring-cyan-500/20'}`}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat password"
                {...field('confirmPassword')}
                className={`w-full bg-card border rounded-xl px-4 py-3 text-foreground placeholder-slate-500 text-sm outline-none focus:ring-1 transition-all ${errors.confirmPassword ? 'border-rose-500/50 focus:ring-rose-500/30' : 'border-border focus:border-cyan-500/50 focus:ring-cyan-500/20'}`}
              />
              {errors.confirmPassword && <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20 text-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
