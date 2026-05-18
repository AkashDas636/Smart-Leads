import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LeadsProvider } from '@/contexts/LeadsContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import LoginPage from '@/components/auth/LoginPage';
import RegisterPage from '@/components/auth/RegisterPage';
import Sidebar from '@/components/layout/Sidebar';
import DashboardHome from '@/components/dashboard/DashboardHome';
import LeadsTable from '@/components/leads/LeadsTable';
import AnalyticsPage from '@/components/analytics/AnalyticsPage';
import SettingsPage from '@/components/settings/SettingsPage';

export type Page = 'dashboard' | 'leads' | 'analytics' | 'settings';
type AuthPage = 'login' | 'register';

function AuthGate() {
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  if (authPage === 'login') {
    return <LoginPage onSwitchToRegister={() => setAuthPage('register')} />;
  }
  return <RegisterPage onSwitchToLogin={() => setAuthPage('login')} />;
}

function AppShell() {
  const { isAuthenticated, isLoading } = useAuth();
  const [page, setPage] = useState<Page>('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-app)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center animate-pulse shadow-lg shadow-cyan-500/30">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
            </svg>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Initializing...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthGate />;
  }

  return (
    <LeadsProvider>
      <div className="flex min-h-screen" style={{ background: 'var(--bg-app)' }}>
        <Sidebar currentPage={page} onNavigate={setPage} />
        <main className="flex-1 min-w-0 p-5 lg:p-7 pt-14 lg:pt-7 overflow-x-hidden">
          {page === 'dashboard'  && <DashboardHome onNavigateToLeads={() => setPage('leads')} />}
          {page === 'leads'      && <LeadsTable />}
          {page === 'analytics'  && <AnalyticsPage />}
          {page === 'settings'   && <SettingsPage />}
        </main>
      </div>
    </LeadsProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  );
}
