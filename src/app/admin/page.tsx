'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';

import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/components/auth-provider';
import { signOut } from '@/lib/firebase/auth';
import { getNGOSettings, saveNGOSettings } from '@/lib/firebase/firestore';
import { NGOConfig } from '@/types/receipt';

function AdminDashboardContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<NGOConfig>({
    name: '',
    address: '',
    pan: '',
    registration80G: '',
    registrationNumber: '',
    contactPhone: '',
    contactEmail: '',
    website: '',
    logoUrl: '/logo.png',
    signatureUrl: ''
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        // Enforce Admin only
        if (user?.email !== 'jeevanta@gmail.com') {
          toast.error('Unauthorized access.');
          router.replace('/receipts/new');
          return;
        }

        const settings = await getNGOSettings();
        if (settings) {
          // Clean up old prefixes if they were saved previously
          const cleanedSettings = {
            ...settings,
            address: settings.address.replace(/^\[\s*NGO Registered Address:\s*/i, '').replace(/\s*\]$/, '').trim(),
            registrationNumber: settings.registrationNumber.replace(/^Registration No:\s*/i, '').trim()
          };
          setFormData(cleanedSettings);
        }
      } catch (error) {
        toast.error('Failed to load settings.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [user, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignatureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG)');
      return;
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData(prev => ({ ...prev, signatureUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveNGOSettings(formData);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Admin Dashboard</h1>
              <p className="text-xs text-slate-500">Manage Receipt Configuration</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Logged in as</span>
              <span className="text-sm font-bold text-blue-600">Admin</span>
            </div>

            <button
              onClick={handleSignOut}
              className="text-slate-500 hover:text-red-600 text-sm font-medium flex items-center gap-1.5 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-semibold text-slate-800 border-b pb-4">NGO Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Registered Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="E.g. D 295, Ajronda, Sec 15A..."
              />
              <p className="text-xs text-slate-500 mt-1">Do not include '[ NGO Registered Address: ]'. This will be added automatically.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">PAN Number</label>
              <input
                type="text"
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                placeholder="XXXXX0000X"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+91-XXXXXXXXXX"
              />
              <p className="text-xs text-slate-500 mt-1">Do not include 'Contact:'.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Writetous@jeevankriti.org"
              />
              <p className="text-xs text-slate-500 mt-1">Will be shown next to phone.</p>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">General Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="E.g. U88900HR2026NPL147259"
              />
              <p className="text-xs text-slate-500 mt-1">Do not include 'Registration No:'. This will be added automatically.</p>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">80G Exemption Remarks</label>
              <textarea
                name="registration80G"
                value={formData.registration80G}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="80G Registration No: ... | Valid from: ... to ..."
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Additional Receipt Remark</label>
              <textarea
                name="remark"
                value={formData.remark || ''}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any special note or remark to appear at the bottom of the receipt..."
              />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-slate-800 border-b pb-4 pt-6">Digital Signature</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="w-48 h-20 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center overflow-hidden relative">
                {formData.signatureUrl ? (
                  <Image src={formData.signatureUrl} alt="Signature" fill className="object-contain p-2" />
                ) : (
                  <span className="text-sm text-slate-400">No signature</span>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">Upload Authorized Signature (PNG/JPG)</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleSignatureUpload}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                <p className="text-xs text-slate-500 mt-2">This image will appear at the bottom right of all generated receipts.</p>
              </div>
            </div>
            {formData.signatureUrl && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, signatureUrl: '' }))}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Remove Signature
              </button>
            )}
          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all disabled:opacity-70 flex items-center gap-2"
            >
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AuthGuard>
      <AdminDashboardContent />
    </AuthGuard>
  );
}
