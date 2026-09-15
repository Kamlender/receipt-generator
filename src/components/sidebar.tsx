'use client';

// ============================================================
// Sidebar Component — Dark Navy Sidebar Navigation
// ============================================================

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const NAV_ITEMS = [
  {
    label: 'New donation',
    href: '/dashboard/new',
    icon: (
      <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8m-4-4h8" />
      </svg>
    ),
  },
  {
    label: 'Donation history',
    href: '/dashboard/history',
    icon: (
      <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    label: 'Download Excel (CSV)',
    href: '/dashboard/history?export=csv',
    icon: (
      <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Change password',
    href: '/dashboard/change-password',
    icon: (
      <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Users',
    href: '/dashboard/users',
    icon: (
      <svg className="sidebar-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo & Branding */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Image
            src="/logo.png"
            alt="Jeevankriti Foundation Logo"
            width={56}
            height={56}
            className="object-contain"
            priority
          />
        </div>
        <h2 className="sidebar-org-name">JEEVANKRITI FOUNDATION</h2>
        <span className="sidebar-org-label">ADMIN PANEL</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive =
            !item.external &&
            (pathname === item.href || pathname.startsWith(item.href.split('?')[0] + '/'));

          // Special case: "Download Excel" should just highlight history
          const isDownload = item.href.includes('export=csv');

          if (item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-nav-link"
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-link ${isActive && !isDownload ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <p>Developed by</p>
        <p className="sidebar-footer-company">ZYROO STUDIO</p>
      </div>
    </aside>
  );
}
