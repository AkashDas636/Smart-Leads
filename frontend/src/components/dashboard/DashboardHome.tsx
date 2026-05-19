import React from 'react';
import { useLeads } from '@/contexts/LeadsContext';
import { useAuth } from '@/contexts/AuthContext';
import StatsCards from './StatsCards';
import { formatDate, getInitials, getStatusColor, getSourceColor } from '@/lib/utils-leads';
import { Globe, Users, TrendingUp, Activity, Zap, ArrowRight } from 'lucide-react';

interface Props {
  onNavigateToLeads: () => void;
}

export default function DashboardHome({ onNavigateToLeads }: Props) {
  const { stats, allLeads } = useLeads();
  const { user } = useAuth();

  const recentLeads = [...allLeads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const sourceIcons: Record<string, React.ElementType> = {
    Website:   Globe,
    Instagram: Globe,
    Referral:  Users,
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8">
      {/* Header with greeting and status */}
      <div className="flex items-start justify-between flex-wrap gap-4 animate-in fade-in slide-in-from-top duration-500">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-cyan-400 bg-clip-text text-transparent" style={{ color: 'var(--text-primary)' }}>
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Track and manage your leads seamlessly
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl shadow-card hover:shadow-card-lg transition-all hover:scale-105 hover:border-emerald-500/50">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-semibold">Pipeline Active</span>
        </div>
      </div>

      {/* Stats cards */}
      <StatsCards stats={stats} />

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-card hover:shadow-card-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-500" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-transparent via-transparent to-cyan-500/5" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Recent Leads</h3>
                <p className="text-[11px] text-muted-foreground">Latest activity</p>
              </div>
            </div>
            <button
              id="view-all-leads-btn"
              onClick={onNavigateToLeads}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition-all hover:translate-x-1 duration-200"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Leads list */}
          <div className="max-h-[400px] overflow-y-auto">
            {recentLeads.length > 0 ? recentLeads.map((lead, idx) => {
              const SrcIcon = sourceIcons[lead.source] ?? Globe;
              return (
                <div
                  key={lead.id}
                  className="flex items-center gap-3 px-6 py-4 hover:bg-cyan-500/5 transition-all duration-200 group cursor-pointer"
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(34,211,238,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Avatar with animation */}
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/40 to-indigo-500/40 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-300 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    {getInitials(lead.name)}
                  </div>
                  
                  {/* Lead info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate group-hover:text-cyan-400 transition-colors" style={{ color: 'var(--text-primary)' }}>{lead.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{lead.email}</p>
                  </div>
                  
                  {/* Status badges */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${getStatusColor(lead.status)} hover:scale-110`}>
                      {lead.status}
                    </span>
                    <span className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${getSourceColor(lead.source)}`}>
                      <SrcIcon className="w-3 h-3" />
                      {lead.source}
                    </span>
                  </div>
                  
                  {/* Date */}
                  <span className="text-[11px] flex-shrink-0 hidden md:block px-2 py-1 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                    {formatDate(lead.createdAt)}
                  </span>
                </div>
              );
            }) : (
              <div className="p-8 text-center">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No leads yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Pipeline health */}
          <div className="rounded-2xl p-6 shadow-card hover:shadow-card-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-500 delay-100" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Pipeline Health</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'New',       value: stats.new,       total: stats.total, color: 'from-blue-500 to-blue-600', icon: '🆕' },
                { label: 'Contacted', value: stats.contacted, total: stats.total, color: 'from-amber-500 to-amber-600', icon: '📞' },
                { label: 'Qualified', value: stats.qualified, total: stats.total, color: 'from-emerald-500 to-emerald-600', icon: '✓' },
                { label: 'Lost',      value: stats.lost,      total: stats.total, color: 'from-rose-500 to-rose-600', icon: '✕' },
              ].map((item, idx) => (
                <div key={item.label} style={{ animation: `slide-in-from-bottom 0.3s ease ${idx * 50}ms both` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.icon}</span>
                      <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                    </div>
                    <span className="text-xs font-bold text-cyan-400">{item.value}/{item.total}</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-input)' }}>
                    <div
                      className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${item.color} shadow-lg`}
                      style={{
                        width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="rounded-2xl p-6 shadow-card hover:shadow-card-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-500 delay-200 group" style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(99,102,241,0.12))',
            border: '1px solid rgba(6,182,212,0.3)',
          }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Conversion Rate</span>
              <span className="text-xs text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-lg">Qualified / Total</span>
            </div>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 origin-left">
                {stats.conversionRate}%
              </span>
              <span className="text-sm text-muted-foreground mb-1">conversion</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.1)' }}>
              <div
                className="h-full rounded-full transition-all duration-700 shadow-lg"
                style={{
                  width: `${stats.conversionRate}%`,
                  background: 'linear-gradient(90deg, #06b6d4, #6366f1)',
                }}
              />
            </div>
            <p className="text-xs mt-3 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              <span>📈</span>
              <span>{stats.thisWeek} new leads this week</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
