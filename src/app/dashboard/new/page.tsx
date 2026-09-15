'use client';

// ============================================================
// New Donation Page — Single-Page Form (matches Image 1)
// ============================================================

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { AdminLayout } from '@/components/admin-layout';
import { useAuth } from '@/components/auth-provider';
import { createReceipt, initializeSequence, getCurrentSequenceNumber } from '@/lib/firebase/firestore';
import { formatReceiptNumber } from '@/config/ngo-config';
import { PaymentMode, PAYMENT_MODE_LABELS } from '@/types/receipt';

const PURPOSE_OPTIONS = [
  'General Donation',
  'Education',
  'Healthcare',
  'Rural Development',
  'Women Empowerment',
  'Other',
];

export default function NewDonationPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [nextReceiptNumber, setNextReceiptNumber] = useState('');

  // Form fields
  const [donorName, setDonorName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [donorPan, setDonorPan] = useState('');
  const [paymentMode, setPaymentMode] = useState<string>('Online/UPI');
  const [paymentReference, setPaymentReference] = useState('');
  const [purpose, setPurpose] = useState('General Donation');
  const [remarks, setRemarks] = useState('');
  const [donationDate, setDonationDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Calculate financial year
  const now = new Date();
  const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const fyEnd = fyStart + 1;
  const fyLabel = `${fyStart}-${String(fyEnd).slice(2)}`;

  // Load next receipt number
  useEffect(() => {
    async function loadSequence() {
      try {
        const current = await getCurrentSequenceNumber();
        const next = current + 1;
        setNextReceiptNumber(`JKF/${fyLabel}/REC${String(next).padStart(3, '0')}`);
      } catch {
        setNextReceiptNumber('Loading...');
      }
    }
    loadSequence();
  }, [fyLabel]);

  // Map display payment modes to internal values
  function mapPaymentMode(mode: string): PaymentMode {
    switch (mode) {
      case 'Online/UPI': return 'UPI';
      case 'Bank Transfer': return 'BANK_TRANSFER';
      case 'Cheque': return 'CHEQUE';
      case 'Cash': return 'CASH';
      default: return 'UPI';
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in.');
      return;
    }
    if (!donorName.trim()) {
      toast.error('Donor name is required.');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    // ── TEMPORARILY DISABLED ──
    // Receipt generation is disabled. Will be re-enabled with a new receipt page.
    toast('Receipt generation is temporarily disabled. Coming soon!', { icon: '🚧' });
    return;

    /* ── ORIGINAL CODE (uncomment when new receipt page is ready) ──
    setLoading(true);
    try {
      await initializeSequence();

      const receipt = await createReceipt(
        {
          donorName: donorName.trim(),
          donorAddress: address.trim(),
          donorPan: donorPan.trim().toUpperCase(),
          donorContact: phone.trim(),
          donorEmail: email.trim(),
          amount: Number(amount),
          donationDate,
          purpose: purpose.trim(),
          paymentMode: mapPaymentMode(paymentMode),
          paymentReference: paymentReference.trim(),
        },
        user.uid
      );

      toast.success(`Receipt ${receipt.receiptNumber} generated!`);
      router.push(`/receipts/preview?id=${receipt.id}`);
    } catch (error) {
      console.error('Receipt creation failed:', error);
      toast.error('Failed to generate receipt. Please try again.');
    } finally {
      setLoading(false);
    }
    */
  }

  return (
    <AdminLayout pageTitle="New donation">
      <div className="dashboard-card">
        <h2 className="card-section-title">Donation details</h2>

        <form onSubmit={handleSubmit}>
          {/* Receipt No & Date */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">RECEIPT NO.</label>
              <input
                type="text"
                value={nextReceiptNumber}
                readOnly
                className="form-input form-input-readonly"
              />
              <span className="form-hint">Generated on save</span>
            </div>
            <div className="form-group">
              <label className="form-label">DONATION DATE</label>
              <input
                type="date"
                value={donationDate}
                onChange={(e) => setDonationDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Donor Name */}
          <div className="form-group">
            <label className="form-label">DONOR NAME</label>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder=""
              className="form-input"
              required
            />
          </div>

          {/* Phone & Email */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">PHONE</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label">ADDRESS</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="form-input"
            />
          </div>

          {/* Amount & Donor PAN */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">AMOUNT (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">DONOR PAN</label>
              <input
                type="text"
                value={donorPan}
                onChange={(e) => setDonorPan(e.target.value)}
                className="form-input"
                style={{ textTransform: 'uppercase' }}
              />
              <span className="form-hint">Cash alone ₹2,000 is not 80G eligible.</span>
            </div>
          </div>

          {/* Payment Mode & Transaction No */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">PAYMENT MODE</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="form-input form-select"
              >
                <option>Online/UPI</option>
                <option>Bank Transfer</option>
                <option>Cheque</option>
                <option>Cash</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">TRANSACTION / CHEQUE NO.</label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Purpose */}
          <div className="form-group">
            <label className="form-label form-label-accent">PURPOSE</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="form-input form-select"
            >
              {PURPOSE_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Remarks */}
          <div className="form-group">
            <label className="form-label">REMARKS (INTERNAL)</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="form-submit-btn"
          >
            {loading ? 'Saving...' : 'Save and print receipt'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
