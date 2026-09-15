'use client';

// ============================================================
// Donation History Page — Table with Search, Filter, Export
// ============================================================

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { AdminLayout } from '@/components/admin-layout';
import { Receipt, PAYMENT_MODE_LABELS, PaymentMode } from '@/types/receipt';
import { getAllReceipts, deleteReceipt } from '@/lib/firebase/firestore';

export default function DonationHistoryPage() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('All years');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load receipts
  useEffect(() => {
    async function load() {
      try {
        const data = await getAllReceipts();
        setReceipts(data);
      } catch (error) {
        console.error('Failed to load receipts:', error);
        toast.error('Failed to load donation history.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Get unique financial years from receipts
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    receipts.forEach((r) => {
      const d = new Date(r.donationDate);
      const fy = d.getMonth() >= 3
        ? `${d.getFullYear()}-${String(d.getFullYear() + 1).slice(2)}`
        : `${d.getFullYear() - 1}-${String(d.getFullYear()).slice(2)}`;
      years.add(fy);
    });
    return Array.from(years).sort().reverse();
  }, [receipts]);

  // Filter receipts
  const filteredReceipts = useMemo(() => {
    let filtered = receipts;

    // Year filter
    if (yearFilter !== 'All years') {
      filtered = filtered.filter((r) => {
        const d = new Date(r.donationDate);
        const fy = d.getMonth() >= 3
          ? `${d.getFullYear()}-${String(d.getFullYear() + 1).slice(2)}`
          : `${d.getFullYear() - 1}-${String(d.getFullYear()).slice(2)}`;
        return fy === yearFilter;
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.donorName.toLowerCase().includes(q) ||
          r.receiptNumber.toLowerCase().includes(q) ||
          r.donorContact.toLowerCase().includes(q) ||
          r.paymentReference.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [receipts, yearFilter, searchQuery]);

  // Stats
  const totalReceipts = filteredReceipts.length;
  const totalAmount = filteredReceipts.reduce((sum, r) => sum + r.amount, 0);

  // Format date
  function formatDate(dateStr: string) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  // Format amount
  function formatAmount(amt: number) {
    return '₹ ' + amt.toLocaleString('en-IN');
  }

  // Get payment mode display label
  function getPaymentLabel(mode: string) {
    const labels: Record<string, string> = {
      UPI: 'Online/UPI',
      BANK_TRANSFER: 'Bank Transfer',
      CHEQUE: 'Cheque',
      CASH: 'Cash',
    };
    return labels[mode] || mode;
  }

  // Delete receipt
  async function handleDelete(id: string, receiptNumber: string) {
    if (!confirm(`Are you sure you want to delete receipt ${receiptNumber}?`)) return;

    setDeletingId(id);
    try {
      await deleteReceipt(id);
      setReceipts((prev) => prev.filter((r) => r.id !== id));
      toast.success(`Receipt ${receiptNumber} deleted.`);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete receipt.');
    } finally {
      setDeletingId(null);
    }
  }

  // Export CSV
  function handleExportCSV() {
    if (filteredReceipts.length === 0) {
      toast.error('No receipts to export.');
      return;
    }

    const headers = ['Date', 'Receipt No.', 'Donor', 'Amount', 'Mode', 'Txn ID', 'Purpose', 'PAN', 'Phone', 'Email'];
    const rows = filteredReceipts.map((r) => [
      formatDate(r.donationDate),
      r.receiptNumber,
      r.donorName,
      r.amount.toString(),
      getPaymentLabel(r.paymentMode),
      r.paymentReference,
      r.purpose,
      r.donorPan,
      r.donorContact,
      r.donorEmail,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `donation_history_${yearFilter.replace(/\s/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully!');
  }

  return (
    <AdminLayout pageTitle="Donation history">
      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">RECEIPTS ISSUED</span>
          <span className="stat-value">{totalReceipts}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">TOTAL AMOUNT</span>
          <span className="stat-value">{formatAmount(totalAmount)}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="history-toolbar">
        <div className="history-search-group">
          <input
            type="text"
            placeholder="Search name, receipt no, phone or..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="history-search-input"
          />
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="history-year-select"
          >
            <option>All years</option>
            {availableYears.map((yr) => (
              <option key={yr}>{yr}</option>
            ))}
          </select>
          <button
            onClick={() => {/* search is reactive */}}
            className="history-search-btn"
          >
            🔍 Search
          </button>
        </div>
        <button onClick={handleExportCSV} className="history-export-btn">
          📄 Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" style={{ margin: '0 auto' }} />
          </div>
        ) : filteredReceipts.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            No receipts found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Receipt no.</th>
                  <th>Donor</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Txn ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceipts.map((r) => (
                  <tr key={r.id}>
                    <td className="history-date">{formatDate(r.donationDate)}</td>
                    <td>{r.receiptNumber}</td>
                    <td>
                      <div className="history-donor-name">{r.donorName}</div>
                      {r.purpose && (
                        <div className="history-donor-purpose">{r.purpose}</div>
                      )}
                    </td>
                    <td className="history-amount">{formatAmount(r.amount)}</td>
                    <td>
                      <span className="history-mode-badge">{getPaymentLabel(r.paymentMode)}</span>
                    </td>
                    <td className="history-txn">{r.paymentReference || '—'}</td>
                    <td>
                      <div className="history-actions">
                        <button
                          onClick={() => router.push(`/receipts/preview?id=${r.id}`)}
                          className="action-btn action-view"
                        >
                          👁 View
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/edit?id=${r.id}`)}
                          className="action-btn action-edit"
                        >
                          ✏ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(r.id, r.receiptNumber)}
                          disabled={deletingId === r.id}
                          className="action-btn action-delete"
                        >
                          {deletingId === r.id ? '...' : '🗑 Delete'}
                        </button>
                      </div>
                    </td>
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
