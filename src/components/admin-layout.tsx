'use client';

// ============================================================
// Admin Layout — Sidebar + Header + Main Content Area
// ============================================================

import { useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { useAuth } from './auth-provider';
import { signOut } from '@/lib/firebase/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
}

export function AdminLayout({ children, pageTitle, pageSubtitle }: AdminLayoutProps) {
  const router = useRouter();
  const { user } = useAuth();

  // Calculate financial year
  const now = new Date();
  const fy = now.getMonth() >= 3
    ? `${now.getFullYear()}-${String(now.getFullYear() + 1).slice(2)}`
    : `${now.getFullYear() - 1}-${String(now.getFullYear()).slice(2)}`;

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  return (
    <div className="admin-wrapper">
      <Sidebar />
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <h1 className="admin-page-title">{pageTitle}</h1>
            <p className="admin-page-subtitle">Financial year {pageSubtitle || fy}</p>
          </div>
          <div className="admin-header-right">
            <div className="admin-user-info">
              <svg className="admin-user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="admin-user-name">Administrator</span>
            </div>
            <button onClick={handleSignOut} className="admin-logout-btn">
              <svg className="admin-logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
