import React, { useState, useEffect } from 'react';
import { useLeads } from '@/contexts/LeadsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import type { Lead, LeadFormData, LeadStatus, LeadSource } from '@/types';
import { formatDate, getInitials, getStatusColor, getSourceColor, exportLeadsToCSV } from '@/lib/utils-leads';
import LeadFormModal from './LeadFormModal';
import LeadDetailPanel from './LeadDetailPanel';
import {
  Search, Plus, Download, Filter, X, ChevronLeft, ChevronRight,
  ArrowDown, ArrowUp, Eye, Edit2, Trash2, Globe, Users, Loader2, RefreshCw
} from 'lucide-react';

const STATUSES: (LeadStatus | 'All')[] = ['All', 'New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: (LeadSource | 'All')[] = ['All', 'Website', 'Instagram', 'Referral'];

export default function LeadsTable() {
  const { filteredResponse, filters, setFilters, resetFilters, createLead, updateLead, deleteLead, allLeads, isLoading } = useLeads();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [searchInput, setSearchInput] = useState(filters.search);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const debouncedSearch = useDebounce(searchInput, 350);

  useEffect(() => {
    setFilters({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = async (data: LeadFormData) => {
    try {
      await createLead(data);
      showToast('Lead created successfully!');
    } catch {
      showToast('Failed to create lead', 'error');
    }
  };

  const handleUpdate = async (data: LeadFormData) => {
    if (!editingLead) return;
    try {
      await updateLead(editingLead.id, data);
      showToast('Lead updated successfully!');
    } catch {
      showToast('Failed to update lead', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLead(id);
      setDeleteConfirm(null);
      showToast('Lead deleted');
    } catch {
      showToast('Failed to delete lead', 'error');
    }
  };

  const handleExport = () => {
    exportLeadsToCSV(allLeads, `leads-${new Date().toISOString().split('T')[0]}.csv`);
    showToast(`Exported ${allLeads.length} leads to CSV`);
  };

  const { leads, pagination } = filteredResponse;
  const hasActiveFilters = filters.status !== 'All' || filters.source !== 'All' || filters.search.trim();

  const SortIcon = ({ field }: { field: string }) => {
    const isActive = true; // simplified
    return filters.sort === 'latest' ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />;
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium shadow-lg animate-in slide-in-from-top-2 duration-200 ${toast.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/15 border-rose-500/30 text-rose-400'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          {toast.msg}
        </div>
      )}

      {/* Header toolbar */}
      <div className="flex flex-col gap-3 mb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Leads</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {pagination.total} total · Page {pagination.page} of {pagination.totalPages}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/15 text-xs font-medium transition-all"
            >
              <RefreshCw className="w-3 h-3" />
              Clear filters
            </button>
          )}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border text-xs font-medium transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => { setEditingLead(null); setShowForm(true); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-foreground text-xs font-semibold transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Search + Filters row */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-card border border-border rounded-xl pl-9 pr-9 py-2.5 text-sm text-foreground placeholder-slate-600 outline-none focus:ring-1 focus:border-cyan-500/40 focus:ring-cyan-500/15 transition-all"
          />
          {searchInput && (
            <button onClick={() => { setSearchInput(''); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setFilters({ status: s, page: 1 })}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${filters.status === s ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-slate-300'}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Source filter */}
          <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
            {SOURCES.map(s => (
              <button
                key={s}
                onClick={() => setFilters({ source: s, page: 1 })}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${filters.source === s ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-slate-300'}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Sort */}
          <button
            onClick={() => setFilters({ sort: filters.sort === 'latest' ? 'oldest' : 'latest', page: 1 })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground text-xs font-medium transition-all"
          >
            {filters.sort === 'latest' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
            {filters.sort === 'latest' ? 'Latest' : 'Oldest'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading leads...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">No leads found</p>
              <p className="text-xs text-muted-foreground mt-1">
                {hasActiveFilters ? 'Try adjusting your filters' : 'Create your first lead to get started'}
              </p>
            </div>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Lead', 'Email', 'Status', 'Source', 'Created', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {leads.map(lead => (
                  <tr
                    key={lead.id}
                    className="group hover:bg-card transition-colors cursor-pointer"
                    onClick={() => { setSelectedLead(lead); setShowDetail(true); }}
                  >
                    {/* Lead */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-border flex items-center justify-center text-xs font-bold text-cyan-400 flex-shrink-0">
                          {getInitials(lead.name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{lead.name}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">{lead.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-muted-foreground">{lead.email}</span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>

                    {/* Source */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${getSourceColor(lead.source)}`}>
                        {lead.source === 'Website' && <Globe className="w-3 h-3" />}
                        {lead.source === 'Instagram' && <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'/></svg>}
                        {lead.source === 'Referral' && <Users className="w-3 h-3" />}
                        {lead.source}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-muted-foreground">{formatDate(lead.createdAt)}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => { setSelectedLead(lead); setShowDetail(true); }}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setEditingLead(lead); setShowForm(true); }}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteConfirm(lead.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilters({ page: pagination.page - 1 })}
              disabled={pagination.page <= 1}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
              const p = pagination.totalPages <= 5 ? i + 1 : Math.max(1, pagination.page - 2) + i;
              if (p > pagination.totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => setFilters({ page: p })}
                  className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${pagination.page === p ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' : 'border-border text-muted-foreground hover:text-foreground hover:border-border'}`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setFilters({ page: pagination.page + 1 })}
              disabled={pagination.page >= pagination.totalPages}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-background border border-border rounded-2xl p-6 w-full max-w-xs shadow-2xl animate-in fade-in duration-200">
            <h3 className="text-base font-semibold text-foreground mb-2">Delete Lead?</h3>
            <p className="text-sm text-muted-foreground mb-5">This action cannot be undone. The lead will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-rose-500/80 hover:bg-rose-500 text-foreground text-sm font-medium transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <LeadFormModal
        lead={editingLead}
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingLead(null); }}
        onSubmit={editingLead ? handleUpdate : handleCreate}
      />

      {/* Detail Panel */}
      {showDetail && selectedLead && (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setShowDetail(false)}
          onEdit={(lead) => { setEditingLead(lead); setShowForm(true); setShowDetail(false); }}
          onDelete={(id) => { handleDelete(id); setShowDetail(false); }}
        />
      )}
    </div>
  );
}
