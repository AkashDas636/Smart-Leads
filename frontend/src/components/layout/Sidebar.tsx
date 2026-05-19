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
    `w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 origin-left ${extra} ${
      active
        ? 'bg-gradient-to-r from-cyan-500/25 to-indigo-500/25 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/20'
        : 'text-muted-foreground hover:text-foreground hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-transparent'
    } ${collapsed ? 'justify-center' : ''}`;

  const SidebarContent = () => (
    <div className="h-full flex flex-col py-5">
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-5 mb-8 ${collapsed ? 'justify-center px-0' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-cyan-500/25 flex-shrink-0 hover:shadow-cyan-500/40 transition-shadow">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col gap-0">
            <span className="text-lg font-bold tracking-tight text-foreground leading-5">SmartLeads</span>
            <span className="text-[10px] text-muted-foreground font-semibold tracking-widest">ANALYTICS</span>
          </div>
        )}
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
      <div className="px-3 mb-3">
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-indigo-500/10 hover:border-indigo-500/30 border border-transparent transition-all duration-200 hover:scale-105 origin-left ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? (theme === 'dark' ? 'Switch to light' : 'Switch to dark') : undefined}
        >
          {theme === 'dark'
            ? <Sun className="flex-shrink-0" style={{ width: 18, height: 18 }} />
            : <Moon className="flex-shrink-0" style={{ width: 18, height: 18 }} />}
          {!collapsed && (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}
        </button>
      </div>

      {/* User info + logout */}
      <div className="px-3 pt-4 border-t border-border/50">
        <div className={`flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-cyan-500/10 transition-all duration-200 group cursor-pointer ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/40 to-indigo-500/40 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-xs font-bold text-cyan-300 group-hover:scale-110 transition-transform duration-200 shadow-md">
            {getInitials(user?.name ?? 'U')}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate group-hover:text-cyan-400 transition-colors">{user?.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                {isAdmin
                  ? <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  : <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />}
                <span className={`text-xs font-semibold ${isAdmin ? 'text-cyan-400' : 'text-indigo-400'}`}>{user?.role}</span>
              </div>
            </div>
          )}
          {!collapsed && (
            <button
              id="logout-btn"
              onClick={logout}
              className="text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-lg p-1.5 transition-all duration-200 hover:scale-110"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={logout}
            className="w-full flex justify-center mt-3 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-lg p-2.5 transition-all duration-200"
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
        className="lg:hidden fixed top-5 left-5 z-50 w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-slate-300 hover:text-foreground hover:bg-cyan-500/10 transition-all hover:scale-110 shadow-card"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-64 shadow-2xl animate-in slide-in-from-left duration-300"
            style={{ background: 'linear-gradient(180deg, #080F1E 0%, #0D1425 100%)', borderRight: '1px solid rgba(34,211,238,0.2)' }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-4 text-muted-foreground hover:text-foreground hover:bg-foreground/10 rounded-lg p-1.5 transition-all duration-200">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar — always dark for visual contrast */}
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 border-r transition-all duration-300 flex-shrink-0 relative shadow-xl`}
        style={{ 
          background: 'linear-gradient(180deg, #080F1E 0%, #0D1425 100%)', 
          borderColor: 'rgba(34, 211, 238, 0.15)',
          width: collapsed ? '68px' : '224px'
        }}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          id="collapse-sidebar-btn"
          onClick={() => setCollapsed(p => !p)}
          className="absolute -right-3.5 top-24 w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/30 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:scale-110 duration-200"
          style={{ background: '#0D1425' }}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>
    </>
  );
}
