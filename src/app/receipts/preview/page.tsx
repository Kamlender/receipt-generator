'use client';

// ============================================================
// Receipt Preview Page — View, Download PDF, Print
// ============================================================

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { AuthGuard } from '@/components/auth-guard';
import { Receipt } from '@/types/receipt';
import { getReceiptById, getNGOSettings } from '@/lib/firebase/firestore';
import { ReceiptTemplate } from '@/components/receipt-template/receipt-template';
import { NGOConfig } from '@/types/receipt';

function ReceiptPreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [config, setConfig] = useState<NGOConfig | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const receiptId = searchParams.get('id');

  useEffect(() => {
    async function loadData() {
      if (!receiptId) {
        toast.error('Invalid receipt ID');
        router.push('/receipts/new');
        return;
      }
      try {
        const [data, settings] = await Promise.all([
          getReceiptById(receiptId),
          getNGOSettings()
        ]);
        
        if (!data) {
          toast.error('Receipt not found');
          router.push('/receipts/new');
          return;
        }
        setReceipt(data);
        setConfig(settings);
      } catch (error) {
        console.error('Failed to load receipt or settings:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [receiptId, router]);

  /** Download as PDF using html2canvas + jsPDF */
  const handleDownloadPDF = useCallback(async () => {
    if (!receipt) return;
    setDownloading(true);

    try {
      // Dynamic import to reduce initial bundle
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = document.getElementById('receipt-template');
      if (!element) throw new Error('Receipt template not found');

      // Capture the receipt as a canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Create PDF (A4 size)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // If the image is taller than one page, scale it to fit
      if (imgHeight > pageHeight) {
        const scale = pageHeight / imgHeight;
        pdf.addImage(
          imgData,
          'PNG',
          0,
          0,
          imgWidth * scale,
          pageHeight
        );
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }

      // Save with receipt number and donor name
      const fileName = `${receipt.receiptNumber}_${receipt.donorName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      pdf.save(fileName);

      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  }, [receipt]);

  /** Print the receipt */
  function handlePrint() {
    window.print();
  }

  /** Generate another receipt */
  function handleNewReceipt() {
    router.push('/receipts/new');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 shadow-sm no-print">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800">Receipt Generated</h1>
              <p className="text-xs text-slate-500">{receipt.receiptNumber}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Success Banner */}
      <div className="bg-emerald-600 text-white no-print">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-1">Receipt Successfully Generated!</h2>
          <p className="text-emerald-100 text-sm">
            Receipt <strong>{receipt.receiptNumber}</strong> for <strong>{receipt.donorName}</strong>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-4 mb-6 no-print">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>

          <button
            onClick={handleNewReceipt}
            className="px-5 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-sm rounded-xl transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Receipt
          </button>
        </div>
      </div>

      {/* Receipt Preview */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
          <ReceiptTemplate receipt={receipt} config={config} />
        </div>
      </div>
    </div>
  );
}

export default function ReceiptPreviewPage() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <ReceiptPreviewContent />
      </Suspense>
    </AuthGuard>
  );
}
