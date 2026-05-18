import React from 'react';
import type { DashboardStats } from '@/types';
import { Users, Sparkles, PhoneCall, TrendingDown, CalendarDays, Target } from 'lucide-react';

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
  suffix?: string;
}

export default function StatsCards({ stats }: Props) {
  const cards: StatCard[] = [
    {
      label: 'Total Leads',
      value: stats.total,
      icon: Users,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
    },
    {
      label: 'New Leads',
      value: stats.new,
      icon: Sparkles,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      label: 'Contacted',
      value: stats.contacted,
      icon: PhoneCall,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      label: 'Qualified',
      value: stats.qualified,
      icon: Target,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      label: 'Lost',
      value: stats.lost,
      icon: TrendingDown,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
    },
    {
      label: 'This Week',
      value: stats.thisWeek,
      icon: CalendarDays,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
      {cards.map(card => (
        <div
          key={card.label}
          className={`relative bg-card dark:bg-card border ${card.border} rounded-2xl p-4 overflow-hidden group hover:bg-card transition-colors`}
        >
          <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
            <card.icon className={`w-4.5 h-4.5 ${card.color} w-[18px] h-[18px]`} />
          </div>
          <p className="text-2xl font-bold text-foreground tracking-tight">
            {card.value}{card.suffix}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          {/* Subtle glow on hover */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl ${card.bg} pointer-events-none`} style={{ mixBlendMode: 'overlay' }} />
        </div>
      ))}
    </div>
  );
}
