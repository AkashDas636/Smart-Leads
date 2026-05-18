import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getInitials } from '@/lib/utils-leads';
import type { Page } from '@/App';
import {
  Zap, LayoutDashboard, Users, BarChart3, Settings,
  LogOut, Sun, Moon, ChevronLeft, ChevronRight,
  Shield, TrendingUp, Menu, X,
} from 'lucide-react';

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads',     label: 'Leads',     icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar({ currentPage, onNavigate }: Props) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === 'Admin';

  const navBtn = (active: boolean, extra = '') =>
    `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${extra} ${
      active
        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
        : 'text-muted-foreground hover:text-foreground hover:bg-card'
    } ${collapsed ? 'justify-center' : ''}`;

  const SidebarContent = () => (
    <div className="h-full flex flex-col py-5">
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-5 mb-8 ${collapsed ? 'justify-center px-0' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 flex-shrink-0">
          <Zap className="w-4 h-4 text-foreground" />
        </div>
        {!collapsed && <span className="text-lg font-bold tracking-tight text-foreground">SmartLeads</span>}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = currentPage === id;
          return (
            <button
              key={id}
              id={`nav-${id}`}
              onClick={() => { onNavigate(id); setMobileOpen(false); }}
              className={navBtn(active)}
              title={collapsed ? label : undefined}
            >
              <Icon className="flex-shrink-0" style={{ width: 18, height: 18 }} />
              {!collapsed && label}
              {!collapsed && active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
            </button>
          );
        })}

        {/* Admin section */}
        <div className={`pt-4 ${collapsed ? 'hidden' : ''}`}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 pb-2">
            {isAdmin ? 'Admin' : 'Account'}
          </p>
        </div>
        <button
          id="nav-settings"
          onClick={() => { onNavigate('settings'); setMobileOpen(false); }}
          className={navBtn(currentPage === 'settings')}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="flex-shrink-0" style={{ width: 18, height: 18 }} />
          {!collapsed && 'Settings'}
          {!collapsed && currentPage === 'settings' && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
        </button>
      </nav>

      {/* Theme toggle */}
      <div className="px-3 mb-2">
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? (theme === 'dark' ? 'Switch to light' : 'Switch to dark') : undefined}
        >
          {theme === 'dark'
            ? <Sun className="flex-shrink-0" style={{ width: 18, height: 18 }} />
            : <Moon className="flex-shrink-0" style={{ width: 18, height: 18 }} />}
          {!collapsed && (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}
        </button>
      </div>

      {/* User info + logout */}
      <div className="px-3 pt-3 border-t border-border">
        <div className={`flex items-center gap-3 px-2 py-2 rounded-xl ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 border border-border flex items-center justify-center flex-shrink-0 text-xs font-bold text-cyan-400">
            {getInitials(user?.name ?? 'U')}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {isAdmin
                  ? <Shield className="w-3 h-3 text-cyan-400" />
                  : <TrendingUp className="w-3 h-3 text-indigo-400" />}
                <span className={`text-xs ${isAdmin ? 'text-cyan-400' : 'text-indigo-400'}`}>{user?.role}</span>
              </div>
            </div>
          )}
          {!collapsed && (
            <button
              id="logout-btn"
              onClick={logout}
              className="text-muted-foreground hover:text-rose-400 transition-colors p-1"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={logout}
            className="w-full flex justify-center mt-2 text-muted-foreground hover:text-rose-400 transition-colors p-2"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        id="mobile-menu-btn"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-slate-300 hover:text-foreground transition-colors"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-64"
            style={{ background: '#080F1E', borderRight: '1px solid rgba(255,255,255,0.06)' }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar — always dark for visual contrast */}
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 border-r transition-all duration-300 flex-shrink-0 relative ${collapsed ? 'w-[68px]' : 'w-56'}`}
        style={{ background: '#080F1E', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          id="collapse-sidebar-btn"
          onClick={() => setCollapsed(p => !p)}
          className="absolute -right-3 top-24 w-6 h-6 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-lg"
          style={{ background: '#0D1425' }}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>
    </>
  );
}
