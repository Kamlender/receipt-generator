'use client';

// ============================================================
// Change Password Page — Firebase Auth Password Update
// ============================================================

import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';

import { AdminLayout } from '@/components/admin-layout';
import { useAuth } from '@/components/auth-provider';

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!user || !user.email) {
      toast.error('You must be logged in.');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // Re-authenticate first
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      if (firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/invalid-credential') {
        toast.error('Current password is incorrect.');
      } else if (firebaseError.code === 'auth/weak-password') {
        toast.error('New password is too weak. Use at least 6 characters.');
      } else {
        toast.error('Failed to change password. Please try again.');
      }
      console.error('Password change error:', error);
    } finally {
      setLoading(false);
    }
  }

  // Determine role label
  const roleLabel = user?.email === 'jeevanta@gmail.com' ? 'admin' : 'staff';

  return (
    <AdminLayout pageTitle="Change password">
      <div className="dashboard-card" style={{ maxWidth: '480px' }}>
        <p className="change-pw-role">Signed in as {roleLabel}</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">CURRENT PASSWORD</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">NEW PASSWORD</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input"
              required
              minLength={8}
            />
            <span className="form-hint">At least 8 characters</span>
          </div>

          <div className="form-group">
            <label className="form-label">CONFIRM NEW PASSWORD</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="form-submit-btn"
          >
            {loading ? 'Changing...' : 'Change password'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
