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
        <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2.5 px-5 py-3.5 rounded-xl border text-sm font-semibold shadow-lg shadow-black/20 animate-in slide-in-from-top duration-300 backdrop-blur-sm ${toast.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/20 border-rose-500/40 text-rose-300'}`}>
          <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          {toast.msg}
        </div>
      )}

      {/* Header toolbar */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-top duration-500">
        <div className="animate-in fade-in slide-in-from-left duration-500">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-cyan-400 bg-clip-text text-transparent">Leads</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {pagination.total} total · Page {pagination.page} of {pagination.totalPages}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 hover:border-amber-500/50 text-xs font-semibold transition-all hover:scale-105 shadow-card"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Clear filters
            </button>
          )}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-cyan-500/50 hover:shadow-card-lg text-xs font-semibold transition-all hover:scale-105"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => { setEditingLead(null); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-semibold transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 hover:-translate-y-0.5 duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Search + Filters row */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center animate-in fade-in slide-in-from-top duration-500 delay-100">
        {/* Search */}
        <div className="relative flex-1 max-w-sm group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-cyan-400 transition-colors" />
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-card border border-border rounded-xl pl-11 pr-10 py-3 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-card hover:shadow-card-lg"
          />
          {searchInput && (
            <button onClick={() => { setSearchInput(''); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-foreground/10 rounded-lg p-1 transition-all">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1.5 shadow-card hover:shadow-card-lg transition-all">
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setFilters({ status: s, page: 1 })}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${filters.status === s ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-300 shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Source filter */}
          <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1.5 shadow-card hover:shadow-card-lg transition-all">
            {SOURCES.map(s => (
              <button
                key={s}
                onClick={() => setFilters({ source: s, page: 1 })}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${filters.source === s ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-300 shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Sort */}
          <button
            onClick={() => setFilters({ sort: filters.sort === 'latest' ? 'oldest' : 'latest', page: 1 })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground text-xs font-semibold transition-all shadow-card hover:shadow-card-lg hover:scale-105 duration-200"
          >
            {filters.sort === 'latest' ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
            {filters.sort === 'latest' ? 'Latest' : 'Oldest'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-500 delay-200">
        {isLoading ? (
          <div className="flex items-center justify-center py-32 gap-3 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            <span className="text-sm font-medium">Loading leads...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/20 flex items-center justify-center">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-foreground">No leads found</p>
              <p className="text-sm text-muted-foreground mt-2">
                {hasActiveFilters ? 'Try adjusting your filters' : 'Create your first lead to get started'}
              </p>
            </div>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold bg-cyan-500/10 px-4 py-2 rounded-lg transition-all hover:scale-105">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gradient-to-r from-cyan-500/5 to-indigo-500/5">
                  {['Lead', 'Email', 'Status', 'Source', 'Created', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {leads.map((lead, idx) => (
                  <tr
                    key={lead.id}
                    className="group hover:bg-cyan-500/5 transition-all duration-200 cursor-pointer hover:shadow-md"
                    style={{ animation: `slide-in-from-bottom 0.3s ease ${idx * 30}ms both` }}
                    onClick={() => { setSelectedLead(lead); setShowDetail(true); }}
                  >
                    {/* Lead */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-300 flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-md">
                          {getInitials(lead.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground group-hover:text-cyan-400 transition-colors truncate">{lead.name}</p>
                          <p className="text-[11px] text-muted-foreground font-mono truncate">{lead.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">{lead.email}</span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border transition-all group-hover:scale-110 shadow-md ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>

                    {/* Source */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all group-hover:scale-110 shadow-md ${getSourceColor(lead.source)}`}>
                        {lead.source === 'Website' && <Globe className="w-3.5 h-3.5" />}
                        {lead.source === 'Instagram' && <svg className='w-3.5 h-3.5' viewBox='0 0 24 24' fill='currentColor'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'/></svg>}
                        {lead.source === 'Referral' && <Users className="w-3.5 h-3.5" />}
                        {lead.source}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{formatDate(lead.createdAt)}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => { setSelectedLead(lead); setShowDetail(true); }}
                          className="p-2 rounded-lg text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-200 hover:scale-110 shadow-sm"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setEditingLead(lead); setShowForm(true); }}
                          className="p-2 rounded-lg text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200 hover:scale-110 shadow-sm"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteConfirm(lead.id)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 hover:scale-110 shadow-sm"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border animate-in fade-in slide-in-from-bottom duration-500 delay-300">
          <p className="text-xs text-muted-foreground font-medium">
            Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters({ page: pagination.page - 1 })}
              disabled={pagination.page <= 1}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-cyan-500/40 hover:bg-cyan-500/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 shadow-card"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
              const p = pagination.totalPages <= 5 ? i + 1 : Math.max(1, pagination.page - 2) + i;
              if (p > pagination.totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => setFilters({ page: p })}
                  className={`w-9 h-9 rounded-lg border text-xs font-bold transition-all shadow-card ${pagination.page === p ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border-cyan-500/40 text-cyan-300' : 'border-border text-muted-foreground hover:text-foreground hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:scale-110'}`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setFilters({ page: pagination.page + 1 })}
              disabled={pagination.page >= pagination.totalPages}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-cyan-500/40 hover:bg-cyan-500/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-110 shadow-card"
            >
              <ChevronRight className="w-4.5 h-4.5" />
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
