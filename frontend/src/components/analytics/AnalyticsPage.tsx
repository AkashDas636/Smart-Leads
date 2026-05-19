
import { useLeads } from '@/contexts/LeadsContext';
import type { Lead } from '@/types';

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-20 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-card rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-300 w-6 text-right">{value}</span>
    </div>
  );
}

function Donut({ data }: { data: { label: string; value: number; color: string; icon?: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div className="text-sm text-muted-foreground text-center py-12">No data available</div>;

  let offset = 0;
  const r = 60;
  const circumference = 2 * Math.PI * r;
  const segments = data.map(d => {
    const pct = d.value / total;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const seg = { ...d, dash, gap, offset };
    offset += dash;
    return seg;
  });

  return (
    <div className="flex items-center gap-8">
      <svg width="160" height="160" viewBox="0 0 140 140" className="flex-shrink-0 drop-shadow-lg">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="16" />
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="16"
            strokeDasharray={`${seg.dash} ${seg.gap}`}
            strokeDashoffset={-seg.offset}
            strokeLinecap="round"
            className="transition-all duration-500 hover:opacity-75"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '70px 70px', filter: 'drop-shadow(0 0 6px ' + seg.color + '40)' }}
          />
        ))}
        <text x="70" y="68" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="24" fontWeight="700">{total}</text>
        <text x="70" y="88" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">total</text>
      </svg>
      <div className="space-y-3 flex-1">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-cyan-500/5 transition-colors duration-200" style={{ animation: `fade-in 0.3s ease ${i * 50}ms both` }}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-3 h-3 rounded-full flex-shrink-0 shadow-md" style={{ background: seg.color, boxShadow: `0 0 8px ${seg.color}40` }} />
              <span className="text-sm font-semibold text-foreground flex-shrink-0">{seg.icon || ''} {seg.label}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm font-bold text-cyan-400">{seg.value}</span>
              <span className="text-xs text-muted-foreground">({Math.round((seg.value / total) * 100)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyTrend({ leads }: { leads: Lead[] }) {
  const months: Record<string, number> = {};
  leads.forEach(l => {
    const d = new Date(l.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months[key] = (months[key] ?? 0) + 1;
  });

  const sorted = Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).slice(-8);
  const max = Math.max(...sorted.map(([, v]) => v), 1);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="flex items-end gap-3 h-40 mt-6 px-2">
      {sorted.map(([key, val], idx) => {
        const [, m] = key.split('-');
        const h = (val / max) * 100;
        return (
          <div 
            key={key} 
            className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
            style={{ animation: `slide-in-from-bottom 0.3s ease ${idx * 50}ms both` }}
          >
            <span className="text-xs font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">{val}</span>
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 transition-all duration-200 cursor-pointer group-hover:shadow-lg group-hover:scale-110 origin-bottom"
              style={{ height: `${Math.max(h, 6)}%` }}
              title={`${key}: ${val} leads`}
            />
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-semibold">{monthNames[parseInt(m) - 1]}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsPage() {
  const { allLeads, stats } = useLeads();

  const statusData = [
    { label: 'New', value: stats.new, color: '#3b82f6', icon: '🆕' },
    { label: 'Contacted', value: stats.contacted, color: '#f59e0b', icon: '📞' },
    { label: 'Qualified', value: stats.qualified, color: '#10b981', icon: '✓' },
    { label: 'Lost', value: stats.lost, color: '#f43f5e', icon: '✕' },
  ];

  const sourceData = [
    { label: 'Website', value: allLeads.filter(l => l.source === 'Website').length, color: '#8b5cf6' },
    { label: 'Instagram', value: allLeads.filter(l => l.source === 'Instagram').length, color: '#ec4899' },
    { label: 'Referral', value: allLeads.filter(l => l.source === 'Referral').length, color: '#06b6d4' },
  ];

  const maxSource = Math.max(...sourceData.map(d => d.value), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-in fade-in slide-in-from-top duration-500">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-cyan-400 bg-clip-text text-transparent">Analytics</h2>
        <p className="text-sm text-muted-foreground mt-2">Performance overview of your lead pipeline</p>
      </div>

      {/* Conversion Rate - Enhanced */}
      <div className="bg-gradient-to-br from-cyan-500/15 to-indigo-500/15 border border-cyan-500/30 rounded-2xl p-8 shadow-card hover:shadow-card-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-500 hover:border-cyan-500/50 group overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Conversion Rate</p>
            <p className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent mt-3 group-hover:scale-110 transition-transform duration-300 origin-left">
              {stats.conversionRate}<span className="text-2xl text-muted-foreground">%</span>
            </p>
            <p className="text-sm text-muted-foreground mt-3">Leads successfully converted to Qualified status</p>
          </div>
          <div className="relative w-32 h-32 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="url(#convGrad)" strokeWidth="3"
                strokeDasharray={`${stats.conversionRate} ${100 - stats.conversionRate}`}
                strokeLinecap="round"
                className="transition-all duration-700"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.3))'
                }}
              />
              <defs>
                <linearGradient id="convGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-cyan-300 group-hover:scale-110 transition-transform">{stats.conversionRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status breakdown */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card hover:shadow-card-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-500 delay-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Lead Status</h3>
            <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg">Distribution</span>
          </div>
          <Donut data={statusData} />
        </div>

        {/* Source breakdown */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card hover:shadow-card-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-500 delay-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Lead Sources</h3>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg">Performance</span>
          </div>
          <div className="space-y-4">
            {sourceData.map((s, idx) => (
              <div key={s.label} style={{ animation: `slide-in-from-bottom 0.3s ease ${idx * 50}ms both` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📊</span>
                    <span className="text-sm font-semibold text-foreground">{s.label}</span>
                  </div>
                  <span className="text-sm font-bold text-cyan-400">{s.value}</span>
                </div>
                <div className="h-2.5 bg-card rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 shadow-md hover:shadow-lg"
                    style={{ width: `${maxSource > 0 ? (s.value / maxSource) * 100 : 0}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}dd)` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly trend */}
      <div className="bg-card border border-border rounded-2xl p-8 shadow-card hover:shadow-card-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom duration-500 delay-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">Monthly Trend</h3>
            <p className="text-xs text-muted-foreground mt-1">Leads generated per month (Last 8 months)</p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg">📈 Growth</span>
        </div>
        <div className="bg-gradient-to-b from-cyan-500/5 to-indigo-500/5 rounded-xl p-6 -m-2">
          <MonthlyTrend leads={allLeads} />
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Avg per Month', value: allLeads.length > 0 ? Math.round(allLeads.length / Math.max(1, 6)) : 0, suffix: '' },
          { label: 'This Week', value: stats.thisWeek, suffix: '' },
          { label: 'Qualified', value: stats.qualified, suffix: '' },
          { label: 'Lost Rate', value: stats.total > 0 ? Math.round((stats.lost / stats.total) * 100) : 0, suffix: '%' },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-2xl font-bold text-foreground">{stat.value}{stat.suffix}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
