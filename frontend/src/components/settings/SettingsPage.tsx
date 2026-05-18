import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getInitials } from '@/lib/utils-leads';
import {
  Sun, Moon, Shield, TrendingUp, Bell, Globe, Lock,
  Palette, User, ChevronRight, Check, Monitor,
} from 'lucide-react';

type ColorAccent = 'cyan' | 'violet' | 'emerald' | 'rose' | 'amber';

const ACCENTS: { id: ColorAccent; label: string; from: string; to: string }[] = [
  { id: 'cyan',    label: 'Cyan',    from: '#06b6d4', to: '#6366f1' },
  { id: 'violet',  label: 'Violet',  from: '#8b5cf6', to: '#ec4899' },
  { id: 'emerald', label: 'Emerald', from: '#10b981', to: '#06b6d4' },
  { id: 'rose',    label: 'Rose',    from: '#f43f5e', to: '#f97316' },
  { id: 'amber',   label: 'Amber',   from: '#f59e0b', to: '#ef4444' },
];

function Card({ title, icon: Icon, children }: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      </div>
      <div className="px-5 py-4 space-y-4">{children}</div>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange, id }: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5.5 rounded-full transition-all duration-200 flex-shrink-0 ${checked ? 'bg-cyan-500' : 'bg-slate-600'}`}
        style={{ width: 40, height: 22 }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform duration-200"
          style={{ width: 18, height: 18, transform: checked ? 'translateX(18px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isAdmin = user?.role === 'Admin';

  const [accent, setAccent] = useState<ColorAccent>('cyan');
  const [notifLeads, setNotifLeads]     = useState(true);
  const [notifWeekly, setNotifWeekly]   = useState(false);
  const [notifLogin, setNotifLogin]     = useState(true);
  const [compactMode, setCompactMode]   = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ThemeOption = ({ value, icon: Icon, label }: {
    value: 'light' | 'dark' | 'system';
    icon: React.ElementType;
    label: string;
  }) => {
    const active = value === 'system'
      ? false
      : theme === value;
    return (
      <button
        id={`theme-${value}`}
        onClick={() => { if (value !== 'system' && theme !== value) toggleTheme(); }}
        className="flex-1 flex flex-col items-center gap-2 py-3 px-2 rounded-xl border transition-all"
        style={{
          background: active ? 'rgba(6,182,212,0.1)' : 'var(--bg-input)',
          borderColor: active ? 'rgba(6,182,212,0.4)' : 'var(--border)',
        }}
      >
        <Icon className="w-5 h-5" style={{ color: active ? '#06b6d4' : 'var(--text-muted)' }} />
        <span className="text-xs font-medium" style={{ color: active ? '#06b6d4' : 'var(--text-secondary)' }}>
          {label}
        </span>
        {active && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
      </button>
    );
  };

  return (
    <div className="max-w-2xl space-y-5 pb-10">

      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Manage your account and preferences
          </p>
        </div>
        <button
          id="save-settings-btn"
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-foreground transition-all shadow-lg"
          style={{
            background: saved
              ? 'linear-gradient(135deg,#10b981,#06b6d4)'
              : 'linear-gradient(135deg,#06b6d4,#6366f1)',
            boxShadow: '0 4px 14px rgba(6,182,212,0.25)',
          }}
        >
          {saved ? <Check className="w-4 h-4" /> : null}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Profile Card */}
      <Card title="Profile" icon={User}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 border flex items-center justify-center text-xl font-bold text-cyan-400 flex-shrink-0"
            style={{ borderColor: 'var(--border)' }}>
            {getInitials(user?.name ?? 'U')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
            <p className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              {isAdmin
                ? <Shield className="w-3.5 h-3.5 text-cyan-400" />
                : <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${isAdmin ? 'text-cyan-400 bg-cyan-500/10' : 'text-indigo-400 bg-indigo-500/10'}`}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Display Name
            </label>
            <input
              id="settings-name"
              defaultValue={user?.name}
              readOnly
              className="w-full text-sm px-3 py-2 rounded-xl outline-none"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Email Address
            </label>
            <input
              id="settings-email"
              defaultValue={user?.email}
              readOnly
              className="w-full text-sm px-3 py-2 rounded-xl outline-none"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            />
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card title="Appearance" icon={Palette}>
        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Theme Mode</p>
          <div className="flex gap-2">
            <ThemeOption value="light"  icon={Sun}     label="Light" />
            <ThemeOption value="dark"   icon={Moon}    label="Dark" />
            <ThemeOption value="system" icon={Monitor} label="System" />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Accent Color</p>
          <div className="flex gap-2 flex-wrap">
            {ACCENTS.map(a => (
              <button
                key={a.id}
                id={`accent-${a.id}`}
                onClick={() => setAccent(a.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all"
                style={{
                  borderColor: accent === a.id ? a.from : 'var(--border)',
                  background: accent === a.id ? `${a.from}18` : 'var(--bg-input)',
                  color: accent === a.id ? a.from : 'var(--text-secondary)',
                }}
              >
                <span className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: `linear-gradient(135deg,${a.from},${a.to})` }} />
                {a.label}
                {accent === a.id && <Check className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>

        <ToggleRow
          id="toggle-compact"
          label="Compact Mode"
          description="Reduce spacing for more content on screen"
          checked={compactMode}
          onChange={setCompactMode}
        />
      </Card>

      {/* Notifications */}
      <Card title="Notifications" icon={Bell}>
        <ToggleRow
          id="toggle-notif-leads"
          label="New Lead Alerts"
          description="Get notified when a new lead is added"
          checked={notifLeads}
          onChange={setNotifLeads}
        />
        <div style={{ height: 1, background: 'var(--border)' }} />
        <ToggleRow
          id="toggle-notif-weekly"
          label="Weekly Digest"
          description="Receive a weekly summary of your pipeline"
          checked={notifWeekly}
          onChange={setNotifWeekly}
        />
        <div style={{ height: 1, background: 'var(--border)' }} />
        <ToggleRow
          id="toggle-notif-login"
          label="Login Notifications"
          description="Alert on new sign-in to your account"
          checked={notifLogin}
          onChange={setNotifLogin}
        />
      </Card>

      {/* Regional */}
      <Card title="Regional" icon={Globe}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Language
            </label>
            <div className="relative">
              <select
                id="settings-language"
                className="w-full text-sm px-3 py-2 rounded-xl outline-none appearance-none pr-8"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                <option>English (US)</option>
                <option>Hindi</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
              <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 pointer-events-none"
                style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Timezone
            </label>
            <div className="relative">
              <select
                id="settings-timezone"
                className="w-full text-sm px-3 py-2 rounded-xl outline-none appearance-none pr-8"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                <option>Asia/Kolkata (IST)</option>
                <option>America/New_York (EST)</option>
                <option>America/Los_Angeles (PST)</option>
                <option>Europe/London (GMT)</option>
                <option>Asia/Tokyo (JST)</option>
              </select>
              <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 pointer-events-none"
                style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card title="Security" icon={Lock}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Change Password</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Last changed: Never</p>
          </div>
          <button
            id="change-password-btn"
            className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-all"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
              background: 'var(--bg-input)',
            }}
            onClick={() => alert('Password change is available in the live backend mode.')}
          >
            Change
          </button>
        </div>
        <div style={{ height: 1, background: 'var(--border)' }} />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Two-Factor Authentication</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Add an extra layer of security</p>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-slate-500/10 text-muted-foreground">
            Coming soon
          </span>
        </div>
        <div style={{ height: 1, background: 'var(--border)' }} />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-rose-400">Sign Out</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Sign out from all devices</p>
          </div>
          <button
            id="settings-logout-btn"
            onClick={logout}
            className="text-xs px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 font-medium transition-all"
          >
            Sign Out
          </button>
        </div>
      </Card>

      {/* Role info */}
      <div className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)' }}>
        <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
          {isAdmin ? <Shield className="w-4 h-4 text-cyan-400" /> : <TrendingUp className="w-4 h-4 text-cyan-400" />}
        </div>
        <div>
          <p className="text-sm font-medium text-cyan-400">
            {isAdmin ? 'Admin Account' : 'Sales Account'}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {isAdmin
              ? 'You have full access — manage all leads, export CSV, and configure the pipeline.'
              : 'You can create and manage your own leads. Contact an Admin for elevated access.'}
          </p>
        </div>
      </div>

    </div>
  );
}
