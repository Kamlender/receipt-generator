// ============================================================
// Firebase Auth Helpers
// ============================================================

import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

// The admin email that is always allowed (not stored in panel_users)
const ADMIN_EMAIL = 'jeevanta.org@gmail.com';

/**
 * Sign in with email and password.
 * After Firebase Auth succeeds, verifies the user still exists in Firestore
 * (i.e. hasn't been deleted by an admin). If deleted → signs out and rejects.
 */
export async function signIn(email: string, password: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);

    // Admin bypasses Firestore check
    if (result.user.email?.toLowerCase() !== ADMIN_EMAIL) {
      // Derive the username (part before @) to look up in panel_users
      const username = result.user.email?.split('@')[0]?.toLowerCase() || '';
      const userDoc = await getDoc(doc(db, 'panel_users', username));

      if (!userDoc.exists()) {
        // User was deleted from the panel — kick them out
        await firebaseSignOut(auth);
        throw new Error('Your account has been removed. Contact the admin.');
      }

      // Also check if explicitly marked as disabled/inactive
      const data = userDoc.data();
      if (data?.status === 'Disabled' || data?.status === 'Inactive') {
        await firebaseSignOut(auth);
        throw new Error('Your account has been disabled. Contact the admin.');
      }
    }

    return result.user;
  } catch (error: unknown) {
    // Re-throw our custom errors as-is
    if (error instanceof Error && (
      error.message.includes('removed') || error.message.includes('disabled')
    )) {
      throw error;
    }

    const firebaseError = error as { code?: string };
    switch (firebaseError.code) {
      case 'auth/user-not-found':
        throw new Error('No account found with this email.');
      case 'auth/wrong-password':
        throw new Error('Incorrect password. Please try again.');
      case 'auth/invalid-email':
        throw new Error('Please enter a valid email address.');
      case 'auth/too-many-requests':
        throw new Error('Too many failed attempts. Please try again later.');
      case 'auth/invalid-credential':
        throw new Error('Invalid email or password. Please try again.');
      default:
        throw new Error('Login failed. Please try again.');
    }
  }
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function.
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

