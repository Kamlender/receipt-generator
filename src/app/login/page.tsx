'use client';

// ============================================================
// Login Page — Firebase Email/Password Authentication
// ============================================================

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signIn } from '@/lib/firebase/auth';
import { useAuth } from '@/components/auth-provider';

export default function LoginPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // If already logged in, redirect to receipt form
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/receipts/new');
    }
  }, [user, authLoading, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    
    const trimmedEmail = email.trim().toLowerCase();

    // Check Roles Before Firebase Auth
    if (isAdmin && trimmedEmail !== 'jeevanta@gmail.com') {
      setError('Only Admin (jeevanta@gmail.com) can login here.');
      return;
    }
    if (!isAdmin && trimmedEmail !== 'jeevanta.org@gmail.com') {
      setError('Only Staff (jeevanta.org@gmail.com) can login here.');
      return;
    }

    setLoading(true);

    try {
      await signIn(trimmedEmail, password);
      // Route Admin to /admin, Staff to /receipts/new
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/receipts/new');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-100/40 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative animate-fade-in">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
            <Image
              src="/logo.png"
              alt="Jeevankriti Foundation Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold">
            <span style={{ color: '#1a56db' }}>JEEVANKRITI</span>{' '}
            <span style={{ color: '#059669' }}>FOUNDATION</span>
          </h1>
          <p className={`mt-1 text-sm font-medium ${isAdmin ? 'text-blue-600' : 'text-emerald-600'}`}>
            80G Receipt Generator — {isAdmin ? 'Admin Login' : 'Staff Login'}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-scale-in">
                <svg
                  className="w-5 h-5 text-red-500 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@jeevankritifoundation.org"
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 ${isAdmin ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 shadow-blue-600/25 hover:shadow-blue-600/40' : 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 shadow-emerald-600/25 hover:shadow-emerald-600/40'} text-white font-semibold rounded-xl transition-all duration-200 shadow-lg disabled:shadow-none flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          {isAdmin ? 'Superadmin access only.' : 'Authorized staff access only. Contact admin for credentials.'}
        </p>
      </div>

      {/* Admin/Staff Floating Switcher (Logo Button) */}
      <button
        onClick={() => setIsAdmin(!isAdmin)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-xl shadow-black/10 border-2 border-emerald-100 hover:scale-105 transition-transform duration-200 group overflow-hidden"
        title={isAdmin ? "Switch to Staff Login" : "Switch to Admin Login"}
      >
        <Image
          src="/logo.png"
          alt="Switch Login"
          width={40}
          height={40}
          className="object-contain drop-shadow-sm m-auto"
        />
        
        {/* Tooltip on hover */}
        <div className="absolute right-full mr-4 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {isAdmin ? 'Switch to Staff Login' : 'Switch to Admin Login'}
        </div>
      </button>
    </div>
  );
}
