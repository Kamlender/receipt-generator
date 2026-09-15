'use client';

// ============================================================
// Receipt Page — Clean, minimal receipt viewer
// No banner, just a sleek floating toolbar + receipt
// ============================================================

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { AuthGuard } from '@/components/auth-guard';
import { Receipt } from '@/types/receipt';
import { getReceiptById, getNGOSettings } from '@/lib/firebase/firestore';
import { ReceiptPageTemplate } from '@/components/receipt-template/receipt-page-template';
import { NGOConfig } from '@/types/receipt';

function ReceiptPageContent() {
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
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = document.getElementById('receipt-page-template');
      if (!element) throw new Error('Receipt template not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > pageHeight) {
        const scale = pageHeight / imgHeight;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * scale, pageHeight);
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }

      const fileName = `${receipt.receiptNumber}_${receipt.donorName.replace(/[^a-zA-Z0-9]/g, '_')}_receipt.pdf`;
      pdf.save(fileName);
      toast.success('PDF downloaded!');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF.');
    } finally {
      setDownloading(false);
    }
  }, [receipt]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Floating Action Bar */}
      <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-2xl border border-white/20"
          style={{
            background: 'rgba(30, 58, 138, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Receipt Info */}
          <div className="flex items-center gap-2 pr-3 border-r border-white/20">
            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-white/90 text-sm font-medium hidden sm:inline">{receipt.receiptNumber}</span>
          </div>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#1e3a8a] font-bold text-sm rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all"
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#1e3a8a] border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Generating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">Download PDF</span>
              </>
            )}
          </button>

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-2 text-white/90 hover:bg-white/10 text-sm rounded-xl transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* New Receipt */}
          <button
            onClick={() => router.push('/receipts/new')}
            className="flex items-center gap-2 px-3 py-2 text-white/90 hover:bg-white/10 text-sm rounded-xl transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="hidden sm:inline">New</span>
          </button>
        </div>
      </div>

      {/* Receipt — centered on page */}
      <div className="max-w-[210mm] mx-auto px-4 sm:px-0 py-8 pb-24">
        <ReceiptPageTemplate receipt={receipt} config={config} />
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-10 h-10 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <ReceiptPageContent />
      </Suspense>
    </AuthGuard>
  );
}
