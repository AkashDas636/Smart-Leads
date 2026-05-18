
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

function Donut({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div className="text-xs text-muted-foreground text-center py-8">No data</div>;

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
    <div className="flex items-center gap-6">
      <svg width="140" height="140" viewBox="0 0 140 140" className="flex-shrink-0">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" />
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
            style={{ transform: 'rotate(-90deg)', transformOrigin: '70px 70px' }}
          />
        ))}
        <text x="70" y="70" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="20" fontWeight="700">{total}</text>
        <text x="70" y="86" textAnchor="middle" fill="#64748b" fontSize="9">total</text>
      </svg>
      <div className="space-y-2 flex-1">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-xs text-muted-foreground flex-1">{seg.label}</span>
            <span className="text-xs font-semibold text-foreground">{seg.value}</span>
            <span className="text-xs text-muted-foreground">({Math.round((seg.value / total) * 100)}%)</span>
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
    <div className="flex items-end gap-2 h-32 mt-4">
      {sorted.map(([key, val]) => {
        const [, m] = key.split('-');
        const h = (val / max) * 100;
        return (
          <div key={key} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">{val}</span>
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-cyan-500/60 to-indigo-500/60 hover:from-cyan-500 hover:to-indigo-500 transition-colors cursor-pointer"
              style={{ height: `${Math.max(h, 4)}%` }}
              title={`${key}: ${val} leads`}
            />
            <span className="text-[10px] text-muted-foreground">{monthNames[parseInt(m) - 1]}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsPage() {
  const { allLeads, stats } = useLeads();

  const statusData = [
    { label: 'New', value: stats.new, color: '#3b82f6' },
    { label: 'Contacted', value: stats.contacted, color: '#f59e0b' },
    { label: 'Qualified', value: stats.qualified, color: '#10b981' },
    { label: 'Lost', value: stats.lost, color: '#f43f5e' },
  ];

  const sourceData = [
    { label: 'Website', value: allLeads.filter(l => l.source === 'Website').length, color: '#8b5cf6' },
    { label: 'Instagram', value: allLeads.filter(l => l.source === 'Instagram').length, color: '#ec4899' },
    { label: 'Referral', value: allLeads.filter(l => l.source === 'Referral').length, color: '#06b6d4' },
  ];

  const maxSource = Math.max(...sourceData.map(d => d.value), 1);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Performance overview of your lead pipeline</p>
      </div>

      {/* Conversion Rate */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-4xl font-bold text-foreground mt-1">{stats.conversionRate}<span className="text-2xl text-muted-foreground">%</span></p>
            <p className="text-xs text-muted-foreground mt-1">Leads converted to Qualified</p>
          </div>
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="url(#convGrad)" strokeWidth="3"
                strokeDasharray={`${stats.conversionRate} ${100 - stats.conversionRate}`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="convGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-cyan-400">{stats.conversionRate}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status breakdown */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Lead Status</h3>
          <Donut data={statusData} />
        </div>

        {/* Source breakdown */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Lead Sources</h3>
          <div className="space-y-3 mt-2">
            {sourceData.map(s => (
              <Bar key={s.label} label={s.label} value={s.value} max={maxSource} color={`bg-[${s.color}]`} />
            ))}
          </div>
          <div className="mt-4 space-y-3">
            {sourceData.map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-20 flex-shrink-0">{s.label}</span>
                <div className="flex-1 h-2 bg-card rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${maxSource > 0 ? (s.value / maxSource) * 100 : 0}%`, background: s.color }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-300 w-6 text-right">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly trend */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">Monthly Trend</h3>
          <span className="text-xs text-muted-foreground">Last 8 months</span>
        </div>
        <p className="text-xs text-muted-foreground mb-1">Leads generated per month</p>
        <MonthlyTrend leads={allLeads} />
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
