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
      {/* Animated gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-30%] right-[-15%] w-[700px] h-[700px] bg-indigo-500/8 rounded-full blur-3xl animate-gradient-shift" />
        <div className="absolute bottom-[-30%] left-[-15%] w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-3xl animate-gradient-shift" style={{ animationDelay: '-2s' }} />
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Create account</h1>
          <p className="text-muted-foreground text-sm mb-8">Start managing your leads today</p>

          {error && (
            <div className="flex items-center gap-3 bg-rose-500/15 border border-rose-500/40 text-rose-300 text-sm rounded-xl px-4 py-3.5 mb-6 animate-in slide-in-from-top duration-300 shadow-card">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-200">
              <label className="block text-sm font-semibold text-foreground mb-2.5">Full Name</label>
              <input
                type="text"
                placeholder="Alex Rivera"
                {...field('name')}
                className={`w-full bg-card border rounded-xl px-4 py-3.5 text-foreground placeholder-muted-foreground text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 shadow-card hover:shadow-card-lg ${errors.name ? 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/20' : 'border-border focus:border-cyan-500/50'}`}
              />
              {errors.name && <p className="text-rose-400 text-xs mt-2 flex items-center gap-1.5 font-medium"><AlertCircle className="w-3.5 h-3.5" />{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-300">
              <label className="block text-sm font-semibold text-foreground mb-2.5">Email Address</label>
              <input
                type="email"
                placeholder="you@company.io"
                {...field('email')}
                className={`w-full bg-card border rounded-xl px-4 py-3.5 text-foreground placeholder-muted-foreground text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 shadow-card hover:shadow-card-lg ${errors.email ? 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/20' : 'border-border focus:border-cyan-500/50'}`}
              />
              {errors.email && <p className="text-rose-400 text-xs mt-2 flex items-center gap-1.5 font-medium"><AlertCircle className="w-3.5 h-3.5" />{errors.email}</p>}
            </div>

            {/* Role */}
            <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-400">
              <label className="block text-sm font-semibold text-foreground mb-2.5">Role</label>
              <div className="grid grid-cols-2 gap-3">
                {(['Admin', 'Sales'] as UserRole[]).map((role, idx) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, role }))}
                    className={`flex items-center gap-2 px-4 py-3.5 rounded-xl border text-sm font-bold transition-all duration-200 hover:scale-105 shadow-card ${form.role === role ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border-cyan-500/40 text-cyan-300' : 'bg-card border-border text-muted-foreground hover:border-cyan-500/40 hover:bg-cyan-500/5'}`}
                    style={{ animation: `fade-in 0.3s ease ${idx * 50}ms both` }}
                  >
                    {role === 'Admin' ? <Shield className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-500">
              <label className="block text-sm font-semibold text-foreground mb-2.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  {...field('password')}
                  className={`w-full bg-card border rounded-xl px-4 py-3.5 pr-12 text-foreground placeholder-muted-foreground text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 shadow-card hover:shadow-card-lg ${errors.password ? 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/20' : 'border-border focus:border-cyan-500/50'}`}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all hover:scale-110 duration-200">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-400 text-xs mt-2 flex items-center gap-1.5 font-medium"><AlertCircle className="w-3.5 h-3.5" />{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-600">
              <label className="block text-sm font-semibold text-foreground mb-2.5">Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat password"
                {...field('confirmPassword')}
                className={`w-full bg-card border rounded-xl px-4 py-3.5 text-foreground placeholder-muted-foreground text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 shadow-card hover:shadow-card-lg ${errors.confirmPassword ? 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/20' : 'border-border focus:border-cyan-500/50'}`}
              />
              {errors.confirmPassword && <p className="text-rose-400 text-xs mt-2 flex items-center gap-1.5 font-medium"><AlertCircle className="w-3.5 h-3.5" />{errors.confirmPassword}</p>}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 hover:-translate-y-0.5 text-sm mt-6 animate-in fade-in slide-in-from-bottom duration-500 delay-700"
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

          {/* Sign in link */}
          <p className="text-sm text-muted-foreground text-center mt-7 animate-in fade-in slide-in-from-bottom duration-500 delay-800">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
