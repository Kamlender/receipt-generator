'use client';

// ============================================================
// Auth Context — Provides authentication state across the app
// ============================================================

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, signOut } from '@/lib/firebase/auth';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      toast.error('You have been logged out due to inactivity.', {
        icon: '⏳',
        duration: 5000,
      });
    } catch (error) {
      console.error('Error auto-logging out:', error);
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // Only start timer if user is logged in
    if (user) {
      timerRef.current = setTimeout(() => {
        handleLogout();
      }, INACTIVITY_TIMEOUT_MS);
    }
  }, [user, handleLogout]);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Inactivity tracking effect
  useEffect(() => {
    if (!user) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const events = ['mousemove', 'mousedown', 'click', 'scroll', 'keypress', 'touchstart'];
    
    // Initial timer start
    resetTimer();

    // Add listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, resetTimer]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access the current authenticated user.
 * Returns { user, loading }.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
