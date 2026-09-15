'use client';

// ============================================================
// Users Management Page — Add/List Panel Users
// ============================================================

import { useState, useEffect, FormEvent } from 'react';
import toast from 'react-hot-toast';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

import { AdminLayout } from '@/components/admin-layout';
import { useAuth } from '@/components/auth-provider';

interface PanelUser {
  id: string;
  username: string;
  fullName: string;
  role: string;
  status: string;
  lastLogin: string;
  createdAt: string;
}

const USERS_COLLECTION = 'panel_users';

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<PanelUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Add user form
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [addingUser, setAddingUser] = useState(false);

  // Set new password
  const [newPasswords, setNewPasswords] = useState<Record<string, string>>({});

  // Load users
  useEffect(() => {
    async function loadUsers() {
      try {
        const snapshot = await getDocs(collection(db, USERS_COLLECTION));
        const userList: PanelUser[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            username: data.username || '',
            fullName: data.fullName || '',
            role: data.role || 'Staff',
            status: data.status || 'Active',
            lastLogin: data.lastLogin || '',
            createdAt: data.createdAt || '',
          };
        });
        setUsers(userList);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  // Add user
  async function handleAddUser(e: FormEvent) {
    e.preventDefault();

    if (!username.trim() || !fullName.trim() || !password.trim()) {
      toast.error('All fields are required.');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setAddingUser(true);
    try {
      const userRef = doc(db, USERS_COLLECTION, username.trim().toLowerCase());
      await setDoc(userRef, {
        username: username.trim().toLowerCase(),
        fullName: fullName.trim(),
        role: 'Staff',
        status: 'Active',
        lastLogin: '',
        createdAt: new Date().toISOString(),
        password: password, // In production, use Firebase Auth createUser
      });

      setUsers((prev) => [
        ...prev,
        {
          id: username.trim().toLowerCase(),
          username: username.trim().toLowerCase(),
          fullName: fullName.trim(),
          role: 'Staff',
          status: 'Active',
          lastLogin: '',
          createdAt: new Date().toISOString(),
        },
      ]);

      toast.success(`User "${username}" added successfully!`);
      setUsername('');
      setFullName('');
      setPassword('');
    } catch (error) {
      console.error('Failed to add user:', error);
      toast.error('Failed to add user.');
    } finally {
      setAddingUser(false);
    }
  }

  // Set new password for a user
  async function handleSetPassword(userId: string) {
    const newPw = newPasswords[userId];
    if (!newPw || newPw.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, { password: newPw });
      toast.success('Password updated!');
      setNewPasswords((prev) => ({ ...prev, [userId]: '' }));
    } catch (error) {
      console.error('Failed to set password:', error);
      toast.error('Failed to update password.');
    }
  }

  // Format date
  function formatDate(dateStr: string) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  return (
    <AdminLayout pageTitle="Users">
      {/* Add User Form */}
      <div className="dashboard-card">
        <h3 className="card-section-title">Add user</h3>
        <form onSubmit={handleAddUser}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=""
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">FULL NAME</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder=""
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="form-input"
              required
              minLength={8}
              style={{ maxWidth: '50%' }}
            />
          </div>

          <button
            type="submit"
            disabled={addingUser}
            className="form-submit-btn"
          >
            {addingUser ? 'Adding...' : 'Add user'}
          </button>
        </form>
      </div>

      {/* Panel Users Table */}
      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden', marginTop: '1.5rem' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 className="card-section-title" style={{ margin: 0 }}>Panel users</h3>
        </div>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" style={{ margin: '0 auto' }} />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="history-table users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Status</th>
                  <th>Last login</th>
                </tr>
              </thead>
              <tbody>
                {/* Always show admin */}
                <tr>
                  <td>
                    <div className="user-cell-name">admin <span className="user-you-badge">(you)</span></div>
                    <div className="user-cell-role">Administrator</div>
                  </td>
                  <td><span className="user-status-active">Active</span></td>
                  <td className="history-date">
                    {user?.metadata?.lastSignInTime ? formatDate(user.metadata.lastSignInTime) : 'N/A'}
                  </td>
                </tr>
                {/* Dynamic users */}
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-cell-name">{u.username}</div>
                      <div className="user-cell-role">{u.role}</div>
                    </td>
                    <td><span className="user-status-active">{u.status}</span></td>
                    <td className="history-date">{u.lastLogin ? formatDate(u.lastLogin) : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
