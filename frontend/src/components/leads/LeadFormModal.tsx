import React, { useState, useEffect } from 'react';
import type { Lead, LeadFormData, LeadStatus, LeadSource } from '@/types';
import { X, AlertCircle, Save, Plus } from 'lucide-react';

interface Props {
  lead?: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
}

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const defaultForm: LeadFormData = {
  name: '',
  email: '',
  status: 'New',
  source: 'Website',
  phone: '',
  notes: '',
};

export default function LeadFormModal({ lead, isOpen, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<LeadFormData>(defaultForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        phone: lead.phone ?? '',
        notes: lead.notes ?? '',
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [lead, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Min 2 characters';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (form.phone && !/^[\+\d\s\-\(\)]{7,15}$/.test(form.phone)) e.phone = 'Invalid phone format';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const set = <K extends keyof LeadFormData>(key: K, val: LeadFormData[K]) => {
    setForm(p => ({ ...p, [key]: val }));
    if (key in errors) setErrors(p => ({ ...p, [key]: undefined }));
  };

  const statusColors: Record<LeadStatus, string> = {
    New: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
    Contacted: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    Qualified: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    Lost: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center">
              {lead ? <Save className="w-3.5 h-3.5 text-cyan-400" /> : <Plus className="w-3.5 h-3.5 text-cyan-400" />}
            </div>
            <h2 className="text-base font-semibold text-foreground">{lead ? 'Edit Lead' : 'Add New Lead'}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-accent">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Name & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name *</label>
              <input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Rahul Sharma"
                className={`w-full bg-card border rounded-xl px-3 py-2.5 text-foreground text-sm placeholder-slate-600 outline-none focus:ring-1 transition-all ${errors.name ? 'border-rose-500/40 focus:ring-rose-500/20' : 'border-border focus:border-cyan-500/40 focus:ring-cyan-500/15'}`}
              />
              {errors.name && <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="rahul@email.com"
                className={`w-full bg-card border rounded-xl px-3 py-2.5 text-foreground text-sm placeholder-slate-600 outline-none focus:ring-1 transition-all ${errors.email ? 'border-rose-500/40 focus:ring-rose-500/20' : 'border-border focus:border-cyan-500/40 focus:ring-cyan-500/15'}`}
              />
              {errors.email && <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">Status *</label>
            <div className="grid grid-cols-4 gap-2">
              {STATUSES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('status', s)}
                  className={`py-2 px-2 rounded-lg border text-xs font-medium transition-all ${form.status === s ? statusColors[s] : 'border-border bg-card text-muted-foreground hover:border-border'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">Source *</label>
            <div className="grid grid-cols-3 gap-2">
              {SOURCES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('source', s)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${form.source === s ? 'border-violet-500/40 bg-violet-500/10 text-violet-400' : 'border-border bg-card text-muted-foreground hover:border-border'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Phone <span className="text-muted-foreground">(optional)</span></label>
            <input
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="+91 98765 43210"
              className={`w-full bg-card border rounded-xl px-3 py-2.5 text-foreground text-sm placeholder-slate-600 outline-none focus:ring-1 transition-all ${errors.phone ? 'border-rose-500/40 focus:ring-rose-500/20' : 'border-border focus:border-cyan-500/40 focus:ring-cyan-500/15'}`}
            />
            {errors.phone && <p className="text-rose-400 text-[11px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Notes <span className="text-muted-foreground">(optional)</span></label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Any additional information..."
              rows={3}
              className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-foreground text-sm placeholder-slate-600 outline-none focus:ring-1 focus:border-cyan-500/40 focus:ring-cyan-500/15 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-border text-sm font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-foreground text-sm font-semibold transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>{lead ? 'Save Changes' : 'Create Lead'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
