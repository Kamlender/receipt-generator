'use client';

// ============================================================
// Dashboard Layout — Wraps all dashboard pages with AuthGuard
// ============================================================

import { AuthGuard } from '@/components/auth-guard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
