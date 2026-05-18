import React from 'react';
import { useLeads } from '@/contexts/LeadsContext';
import { useAuth } from '@/contexts/AuthContext';
import StatsCards from './StatsCards';
import { formatDate, getInitials, getStatusColor, getSourceColor } from '@/lib/utils-leads';
import { Globe, Users, TrendingUp, Activity, Zap } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Here's what's happening with your leads today
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Pipeline Active</span>
        </div>
      </div>

      {/* Stats cards */}
      <StatsCards stats={stats} />

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent Leads */}
        <div className="lg:col-span-3 rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Leads</h3>
            </div>
            <button
              id="view-all-leads-btn"
              onClick={onNavigateToLeads}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View all →
            </button>
          </div>
          <div>
            {recentLeads.map(lead => {
              const SrcIcon = sourceIcons[lead.source] ?? Globe;
              return (
                <div
                  key={lead.id}
                  className="flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors"
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400 flex-shrink-0">
                    {getInitials(lead.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{lead.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{lead.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${getSourceColor(lead.source)}`}>
                      <SrcIcon className="w-2.5 h-2.5" />
                      {lead.source}
                    </span>
                  </div>
                  <span className="text-[11px] flex-shrink-0 hidden md:block" style={{ color: 'var(--text-muted)' }}>
                    {formatDate(lead.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Pipeline health */}
          <div className="rounded-2xl p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Pipeline Health</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'New',       value: stats.new,       total: stats.total, color: '#3b82f6' },
                { label: 'Contacted', value: stats.contacted, total: stats.total, color: '#f59e0b' },
                { label: 'Qualified', value: stats.qualified, total: stats.total, color: '#10b981' },
                { label: 'Lost',      value: stats.lost,      total: stats.total, color: '#f43f5e' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-input)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%`,
                        background: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="rounded-2xl p-5" style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(99,102,241,0.08))',
            border: '1px solid rgba(6,182,212,0.2)',
          }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Conversion Rate</span>
              <span className="text-xs text-cyan-400 font-medium">Qualified / Total</span>
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {stats.conversionRate}%
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.12)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${stats.conversionRate}%`,
                  background: 'linear-gradient(90deg,#06b6d4,#6366f1)',
                }}
              />
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              {stats.thisWeek} new leads this week
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
