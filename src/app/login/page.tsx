'use client';

// ============================================================
// Login Page — Single Unified Login (Firebase Email/Password)
// ============================================================

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signIn } from '@/lib/firebase/auth';
import { useAuth } from '@/components/auth-provider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

    if (!trimmedEmail || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      await signIn(trimmedEmail, password);
      router.push('/receipts/new');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="login-page">
        <div className="login-spinner" />
      </div>
    );
  }

  return (
    <div className="login-page">
      {/* Login Card */}
      <div className="login-card animate-fade-in">
        {/* Logo */}
        <div className="login-logo-wrapper">
          <Image
            src="/logo.png"
            alt="Jeevankriti Foundation Logo"
            width={72}
            height={72}
            className="object-contain"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="login-title">Donation Portal</h1>
        <p className="login-subtitle">JEEVANKRITI FOUNDATION</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Error Alert */}
          {error && (
            <div className="login-error animate-scale-in">
              <svg
                className="login-error-icon"
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

          {/* Username */}
          <div className="login-field">
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username"
              required
              autoComplete="email"
              className="login-input"
            />
          </div>

          {/* Password */}
          <div className="login-field">
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="current-password"
              className="login-input"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? (
              <>
                <div className="login-button-spinner" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
