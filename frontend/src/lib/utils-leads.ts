import type { Lead } from '@/types';

export function exportLeadsToCSV(leads: Lead[], filename = 'leads-export.csv'): void {
  const headers = ['ID', 'Name', 'Email', 'Status', 'Source', 'Phone', 'Notes', 'Created At'];

  const rows = leads.map(lead => [
    lead.id,
    lead.name,
    lead.email,
    lead.status,
    lead.source,
    lead.phone ?? '',
    (lead.notes ?? '').replace(/,/g, ';'),
    new Date(lead.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    New: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    Contacted: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Qualified: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Lost: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };
  return map[status] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/30';
}

export function getSourceColor(source: string): string {
  const map: Record<string, string> = {
    Website: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    Instagram: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
    Referral: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  };
  return map[source] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/30';
}
