import React from 'react';
import type { Lead } from '@/types';
import { formatDate, getInitials, getStatusColor, getSourceColor } from '@/lib/utils-leads';
import { X, Mail, Phone, Calendar, FileText, Globe, Users, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  lead: Lead | null;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

const InstagramIcon = () => (
  <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'/></svg>
);
const sourceIcons: Record<string, React.ElementType> = {
  Website: Globe,
  Instagram: InstagramIcon,
  Referral: Users,
};

export default function LeadDetailPanel({ lead, onClose, onEdit, onDelete }: Props) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  if (!lead) return null;

  const SourceIcon = sourceIcons[lead.source] ?? Globe;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm h-full bg-background border-l border-border flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Lead Details</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-accent">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Avatar + Name */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-border flex items-center justify-center text-lg font-bold text-cyan-400 flex-shrink-0">
              {getInitials(lead.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate">{lead.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">{lead.id}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${getSourceColor(lead.source)}`}>
                  <SourceIcon className="w-3 h-3" />
                  {lead.source}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Contact</p>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-card flex items-center justify-center flex-shrink-0">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <span className="text-sm text-slate-300 break-all">{lead.email}</span>
            </div>
            {lead.phone && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-card flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <span className="text-sm text-slate-300">{lead.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-card flex items-center justify-center flex-shrink-0">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <span className="text-sm text-slate-300">{formatDate(lead.createdAt)}</span>
            </div>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Notes</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{lead.notes}</p>
            </div>
          )}

          {/* Status history placeholder */}
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Status Timeline</p>
            <div className="relative">
              <div className="absolute left-[11px] top-0 bottom-0 w-px bg-card" />
              {['Created', lead.status !== 'New' ? 'Contacted' : null, lead.status === 'Qualified' || lead.status === 'Lost' ? lead.status : null]
                .filter(Boolean)
                .map((s, i) => (
                  <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                    <div className="w-[22px] h-[22px] rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center z-10 flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    </div>
                    <span className="text-xs text-muted-foreground">{s}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-border flex gap-2">
          <button
            onClick={() => onEdit(lead)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:border-cyan-500/30 hover:bg-cyan-500/5 text-slate-300 hover:text-cyan-400 text-sm font-medium transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
          {isAdmin && (
            <button
              onClick={() => { onDelete(lead.id); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400 text-sm font-medium transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
