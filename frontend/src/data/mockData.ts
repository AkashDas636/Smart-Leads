import type { Lead, User, LeadStatus, LeadSource } from '@/types';

// ─── Mock Users ───────────────────────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Rivera',
    email: 'admin@smartleads.io',
    role: 'Admin',
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: 'u2',
    name: 'Jordan Kim',
    email: 'sales@smartleads.io',
    role: 'Sales',
    createdAt: '2024-01-15T10:00:00Z',
  },
];

// password for both: password123

const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Rohan', 'Meera', 'Karan', 'Divya',
  'Aditya', 'Pooja', 'Nikhil', 'Shruti', 'Siddharth', 'Neha', 'Arjun', 'Kavya', 'Ravi', 'Simran',
  'Harsh', 'Tanya', 'Akash', 'Nisha', 'Gaurav', 'Ritika', 'Manish', 'Swati', 'Vivek', 'Pallavi'];

const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Mehta', 'Joshi', 'Rao', 'Gupta', 'Verma', 'Nair',
  'Iyer', 'Reddy', 'Shah', 'Chopra', 'Malhotra', 'Bansal', 'Agarwal', 'Bhatia', 'Kapoor', 'Saxena'];

const statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const sources: LeadSource[] = ['Website', 'Instagram', 'Referral'];

function generateEmail(first: string, last: string, idx: number): string {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'company.io'];
  return `${first.toLowerCase()}.${last.toLowerCase()}${idx}@${domains[idx % domains.length]}`;
}

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString();
}

// ─── Generate 50 Mock Leads ───────────────────────────────────────────────────

export const MOCK_LEADS: Lead[] = Array.from({ length: 50 }, (_, i) => {
  const first = firstNames[i % firstNames.length];
  const last = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
  const name = `${first} ${last}`;
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2025-05-15');

  const phoneDigits = Math.floor(7000000000 + Math.random() * 2999999999);

  return {
    id: `lead_${String(i + 1).padStart(3, '0')}`,
    name,
    email: generateEmail(first, last, i + 1),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    createdAt: randomDate(startDate, endDate),
    assignedTo: i % 3 === 0 ? 'u1' : 'u2',
    phone: `+91 ${phoneDigits}`,
    notes: i % 5 === 0
      ? 'Interested in premium plan. Follow up next week.'
      : i % 7 === 0
      ? 'Requested demo. Schedule meeting ASAP.'
      : undefined,
  };
});

// ─── Hashed Passwords (bcrypt simulation) ────────────────────────────────────

export const MOCK_CREDENTIALS: Record<string, string> = {
  'admin@smartleads.io': 'password123',
  'sales@smartleads.io': 'password123',
};
