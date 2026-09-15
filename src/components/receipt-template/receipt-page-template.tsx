'use client';

// ============================================================
// Receipt Page Template — Same as ReceiptTemplate but WITHOUT
// customer/donor details table. Watermark with diagonal
// "JEEVANKRITI FOUNDATION" text repeated across the receipt.
// ============================================================

import { Receipt, NGOConfig } from '@/types/receipt';
import { NGO_CONFIG as DEFAULT_NGO_CONFIG } from '@/config/ngo-config';
import { PAYMENT_MODE_LABELS } from '@/types/receipt';
import { amountToWords } from '@/lib/amount-to-words';

interface ReceiptPageTemplateProps {
  receipt: Receipt;
  config?: NGOConfig;
}

export function ReceiptPageTemplate({ receipt, config }: ReceiptPageTemplateProps) {
  const activeConfig = config || DEFAULT_NGO_CONFIG;

  // Format date as DD-MM-YYYY
  const formattedDate = new Date(receipt.donationDate + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '-');

  // Amount in words — "Rupees ... Only"
  const amountInWordsStr = amountToWords(receipt.amount);

  // Formatted currency — "₹ 89,56,230/-"
  const formattedAmount = '₹ ' + new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(receipt.amount) + '/-';

  return (
    <div id="receipt-page-template" className="receipt-v2-container">
      {/* Diagonal Watermark — "JEEVANKRITI FOUNDATION" repeated diagonally */}
      <div className="receipt-page-watermark" />

      {/* Double Border — Blue outer + Gold inner */}
      <div className="receipt-v2-border-outer">
        <div className="receipt-v2-border-inner">

          {/* ═══════════════ HEADER ═══════════════ */}
          <div className="text-center mb-4">
            <img
              src={activeConfig.logoUrl}
              alt="Logo"
              className="mx-auto h-20 w-auto mb-2 object-contain"
            />
            <h1
              className="text-3xl font-bold tracking-wider"
              style={{ color: '#1e3a8a', fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              JEEVANKRITI FOUNDATION
            </h1>
            <p className="text-[10px] font-bold tracking-[0.3em] mt-1 text-gray-500">
              FOOD | HEALTH | EDUCATION
            </p>
            <p className="text-[11px] text-gray-500 mt-2">
              {activeConfig.address}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              {activeConfig.contactPhone} | {activeConfig.contactEmail} | {activeConfig.website}
            </p>
            <p className="text-[11px] font-bold text-[#1e3a8a] mt-2">
              {activeConfig.registrationNumber} | PAN: {activeConfig.pan} | NGO Darpan: HR/2026/1136355
            </p>
          </div>

          {/* Thin separator */}
          <hr className="border-t border-gray-200 my-4" />

          {/* ═══════════════ DONATION RECEIPT TITLE ═══════════════ */}
          <div className="flex items-center justify-center mb-6">
            <div className="h-px bg-gray-300 w-16 mr-4" />
            <h2 className="text-sm font-bold tracking-[0.3em] text-[#1e3a8a]">DONATION RECEIPT</h2>
            <div className="h-px bg-gray-300 w-16 ml-4" />
          </div>

          {/* ═══════════════ RECEIPT NO & DATE ═══════════════ */}
          <div className="flex justify-between items-end mb-6 px-4">
            <div>
              <p className="text-[10px] text-gray-500 font-bold tracking-wider mb-1">RECEIPT NO.</p>
              <p className="font-bold text-[#1e3a8a] text-sm">{receipt.receiptNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-bold tracking-wider mb-1">DATE</p>
              <p className="font-bold text-[#1e3a8a] text-sm">{formattedDate}</p>
            </div>
          </div>

          {/* ═══════════════ BODY TEXT ═══════════════ */}
          <div className="mb-6 px-4 text-[15px] leading-relaxed text-gray-700">
            Received with sincere gratitude from{' '}
            <strong className="text-black font-semibold">{receipt.donorName}</strong>{' '}
            a donation of{' '}
            <strong className="text-black font-semibold">{formattedAmount}</strong>{' '}
            towards{' '}
            <strong className="text-black font-semibold">{receipt.purpose}</strong>{' '}
            of JEEVANKRITI FOUNDATION, by {PAYMENT_MODE_LABELS[receipt.paymentMode]}.
            <div className="italic text-gray-600 mt-2 font-medium">
              {amountInWordsStr}
            </div>
          </div>

          {/* ═══════════════ AMOUNT RECEIVED BOX ═══════════════ */}
          <div className="mx-4 bg-[#1e3a8a] text-white flex justify-between items-center px-6 py-4 mb-6 rounded-sm shadow-sm">
            <span className="font-bold tracking-widest text-sm">AMOUNT RECEIVED</span>
            <span className="font-bold text-2xl tracking-wide">{formattedAmount}</span>
          </div>

          {/* ═══════════════ DONOR DETAILS TABLE REMOVED ═══════════════ */}

          {/* ═══════════════ TAX EXEMPTION BOX ═══════════════ */}
          <div className="mx-4 border-[1.5px] border-dashed border-[#eab308] p-4 text-[12px] text-gray-700 bg-yellow-50/20 mb-8 rounded-sm text-center">
            <p className="mb-2">
              <strong className="text-black">Tax exemption:</strong> Donations to JEEVANKRITI FOUNDATION are eligible for{' '}
              <strong className="text-black">50% deduction</strong> under{' '}
              <strong className="text-black">Section 80G</strong> of the Income Tax Act, 1961.{' '}
              <strong className="text-black">{activeConfig.registration80G}</strong>
            </p>
            <p className="text-gray-500 italic">
              Please keep this receipt safely. It is required to claim the deduction while filing your income tax return.
            </p>
          </div>

          {/* Spacer — pushes footer to bottom */}
          <div className="mt-auto" />

          {/* ═══════════════ FOOTER SIGNATURES ═══════════════ */}
          <div className="flex justify-between items-end mt-12 mb-2 px-6">
            {/* Left — Donor Signature */}
            <div className="w-48 border-t border-gray-400 pt-2 text-center">
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#1e3a8a]">DONOR SIGNATURE</p>
            </div>

            {/* Right — Authorised Signatory */}
            <div className="w-56 text-center flex flex-col items-center">
              <p className="text-[10px] font-bold mb-1">For JEEVANKRITI FOUNDATION</p>
              <p
                className="text-[11px] font-bold text-[#1e3a8a] italic mb-1"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
              >
                JEEVANKRITI FOUNDATION
              </p>
              <div
                className="flex items-center justify-center text-[#1e3a8a] mb-0.5"
                style={{
                  fontFamily: "'Brush Script MT', 'Segoe Script', 'Cedarville Cursive', cursive",
                  fontSize: '22px',
                  lineHeight: '1.2',
                }}
              >
                Prince Kumar
              </div>
              <p className="text-[9px] text-[#1e3a8a] font-semibold italic mb-1">Auth. Sign. / Director</p>
              <div className="border-t border-gray-400 pt-2 w-full text-center mt-1">
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#1e3a8a]">AUTHORISED SIGNATORY</p>
              </div>
            </div>
          </div>

          {/* ═══════════════ BOTTOM NOTE ═══════════════ */}
          <div className="text-center mt-6">
            <p className="text-[9px] text-gray-400 font-medium">
              This is a computer-generated receipt issued by JEEVANKRITI FOUNDATION.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
