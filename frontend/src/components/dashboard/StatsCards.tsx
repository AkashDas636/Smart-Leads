import React from 'react';
import type { DashboardStats } from '@/types';
import { Users, Sparkles, PhoneCall, TrendingDown, CalendarDays, Target, TrendingUp } from 'lucide-react';

interface Props {
  stats: DashboardStats;
}

interface StatCard {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  glow: string;
  trend?: { change: number; positive: boolean };
  suffix?: string;
}

export default function StatsCards({ stats }: Props) {
  // Calculate conversion rate
  const conversionRate = stats.total > 0 ? ((stats.qualified / stats.total) * 100).toFixed(1) : '0';
  
  // Calculate contact rate
  const contactRate = stats.total > 0 ? ((stats.contacted / stats.total) * 100).toFixed(1) : '0';

  const cards: StatCard[] = [
    {
      label: 'Total Leads',
      value: stats.total,
      icon: Users,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      glow: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]',
      trend: { change: 12, positive: true },
    },
    {
      label: 'Conversion Rate',
      value: conversionRate,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      glow: 'hover:shadow-[0_0_30px_rgba(52,211,153,0.3)]',
      trend: { change: 4.2, positive: true },
      suffix: '%',
    },
    {
      label: 'Contact Rate',
      value: contactRate,
      icon: PhoneCall,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      glow: 'hover:shadow-[0_0_30px_rgba(251,146,60,0.3)]',
      suffix: '%',
      trend: { change: 2.1, positive: true },
    },
    {
      label: 'Qualified',
      value: stats.qualified,
      icon: Target,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]',
      trend: { change: 8, positive: true },
    },
    {
      label: 'New This Week',
      value: stats.thisWeek,
      icon: Sparkles,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/30',
      glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
      trend: { change: 5, positive: true },
    },
    {
      label: 'Lost',
      value: stats.lost,
      icon: TrendingDown,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      glow: 'hover:shadow-[0_0_30px_rgba(251,113,133,0.3)]',
      trend: { change: -3, positive: false },
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
      {cards.map((card, idx) => (
        <div
          key={card.label}
          className={`relative bg-card dark:bg-card border ${card.border} rounded-2xl p-4 overflow-hidden group hover:bg-card transition-all duration-300 hover:scale-105 hover:translate-y-[-2px] cursor-default ${card.glow} shadow-card hover:shadow-card-lg`}
          style={{
            animation: `slide-in-from-bottom 0.5s ease ${idx * 50}ms both`,
          }}
        >
          {/* Gradient background on hover */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl ${card.bg} pointer-events-none`} style={{ mixBlendMode: 'overlay' }} />
          
          {/* Icon container with glow */}
          <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
            <div className={`absolute inset-0 rounded-xl ${card.bg} opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300`} />
            <card.icon className={`w-[18px] h-[18px] ${card.color}`} />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-2xl font-bold text-foreground tracking-tight group-hover:scale-110 transition-transform duration-300 origin-left">
                {card.value}{card.suffix}
              </p>
              {card.trend && (
                <div className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-lg ${
                  card.trend.positive 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {card.trend.positive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(card.trend.change)}%
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 group-hover:text-foreground/80 transition-colors duration-300">{card.label}</p>
          </div>

          {/* Subtle border glow on hover */}
          <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300`} style={{ 
            border: `1px solid ${card.color}`,
            opacity: 0
          }} />
        </div>
      ))}
    </div>
  );
}
