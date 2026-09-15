'use client';

import { Receipt, NGOConfig } from '@/types/receipt';
import { NGO_CONFIG as DEFAULT_NGO_CONFIG } from '@/config/ngo-config';
import { PAYMENT_MODE_LABELS } from '@/types/receipt';
import { formatAmountIndian } from '@/lib/amount-to-words';

interface ReceiptTemplateProps {
  receipt: Receipt;
  config?: NGOConfig;
}

export function ReceiptTemplate({ receipt, config }: ReceiptTemplateProps) {
  const activeConfig = config || DEFAULT_NGO_CONFIG;
  const formattedDate = new Date(receipt.donationDate + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '-'); // e.g., 15-09-2026

  const amountInWords = formatAmountIndian(receipt.amount);
  
  // Custom format for currency
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(receipt.amount) + '/-';

  return (
    <div id="receipt-template" className="receipt-v2-container">
      <div className="receipt-v2-watermark" />
      
      <div className="receipt-v2-border-outer">
        <div className="receipt-v2-border-inner">
          
          {/* Header */}
          <div className="text-center mb-4">
            <img 
              src={activeConfig.logoUrl} 
              alt="Logo" 
              className="mx-auto h-20 w-auto mb-2 object-contain" 
            />
            <h1 className="text-3xl font-bold tracking-wider" style={{ color: '#1e3a8a', fontFamily: "'Georgia', 'Times New Roman', serif" }}>
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

          <hr className="border-t border-gray-200 my-4" />

          {/* Title Row */}
          <div className="flex items-center justify-center mb-6">
            <div className="h-px bg-gray-300 w-16 mr-4"></div>
            <h2 className="text-sm font-bold tracking-[0.3em] text-[#1e3a8a]">DONATION RECEIPT</h2>
            <div className="h-px bg-gray-300 w-16 ml-4"></div>
          </div>

          {/* Receipt Info */}
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

          {/* Body Text */}
          <div className="mb-6 px-4 text-[15px] leading-relaxed text-gray-700">
            Received with sincere gratitude from <strong className="text-black font-semibold">{receipt.donorName}</strong> a donation of <strong className="text-black font-semibold">{formattedAmount}</strong> towards <strong className="text-black font-semibold">{receipt.purpose}</strong> of JEEVANKRITI FOUNDATION, by {PAYMENT_MODE_LABELS[receipt.paymentMode]}.
            <div className="italic text-gray-600 mt-2 font-medium">
              Rupees {amountInWords} Only
            </div>
          </div>

          {/* Amount Box */}
          <div className="mx-4 bg-[#1e3a8a] text-white flex justify-between items-center px-6 py-4 mb-6 rounded-sm shadow-sm">
            <span className="font-bold tracking-widest text-sm">AMOUNT RECEIVED</span>
            <span className="font-bold text-2xl tracking-wide">{formattedAmount}</span>
          </div>

          {/* Details Table */}
          <div className="mb-6 px-4">
            <table className="w-full text-[13px] border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2.5 font-bold w-1/3 text-[#1e3a8a] bg-gray-50/50">Donor name</td>
                  <td className="border border-gray-300 p-2.5 text-gray-700">{receipt.donorName}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2.5 font-bold text-[#1e3a8a] bg-gray-50/50">Contact no.</td>
                  <td className="border border-gray-300 p-2.5 text-gray-700">{receipt.donorContact || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2.5 font-bold text-[#1e3a8a] bg-gray-50/50">Email address</td>
                  <td className="border border-gray-300 p-2.5 text-gray-700">{receipt.donorEmail || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2.5 font-bold text-[#1e3a8a] bg-gray-50/50">Donor address</td>
                  <td className="border border-gray-300 p-2.5 text-gray-700">{receipt.donorAddress || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2.5 font-bold text-[#1e3a8a] bg-gray-50/50">Donor PAN</td>
                  <td className="border border-gray-300 p-2.5 text-gray-700">{receipt.donorPan || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2.5 font-bold text-[#1e3a8a] bg-gray-50/50">Payment mode</td>
                  <td className="border border-gray-300 p-2.5 text-gray-700">{PAYMENT_MODE_LABELS[receipt.paymentMode]}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2.5 font-bold text-[#1e3a8a] bg-gray-50/50">Transaction / Cheque no.</td>
                  <td className="border border-gray-300 p-2.5 text-gray-700">{receipt.paymentReference || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tax Exemption Box */}
          <div className="mx-4 border-[1.5px] border-dashed border-[#eab308] p-4 text-[12px] text-gray-700 bg-yellow-50/20 mb-8 rounded-sm text-center">
            <p className="mb-2">
              <strong className="text-black">Tax exemption:</strong> Donations to JEEVANKRITI FOUNDATION are eligible for <strong className="text-black">50% deduction</strong> under <strong className="text-black">Section 80G</strong> of the Income Tax Act, 1961. <strong className="text-black">{activeConfig.registration80G}</strong>
            </p>
            <p className="text-gray-500 italic">
              Please keep this receipt safely. It is required to claim the deduction while filing your income tax return.
            </p>
          </div>

          <div className="mt-auto"></div>

          {/* Footer Signatures */}
          <div className="flex justify-between items-end mt-12 mb-2 px-6">
            <div className="w-48 border-t border-gray-400 pt-2 text-center">
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#1e3a8a]">DONOR SIGNATURE</p>
            </div>
            <div className="w-56 text-center flex flex-col items-center">
              <p className="text-[10px] font-bold mb-2">For JEEVANKRITI FOUNDATION</p>
              {activeConfig.signatureUrl ? (
                <img 
                  src={activeConfig.signatureUrl} 
                  alt="Signature" 
                  className="h-10 w-auto mb-1 object-contain"
                />
              ) : (
                <div 
                  className="h-10 flex items-center justify-center text-[#1e3a8a] text-xl"
                  style={{ fontFamily: "'Brush Script MT', 'Cedarville Cursive', cursive" }}
                >
                  Prince Kumar
                </div>
              )}
              <div className="border-t border-gray-400 pt-2 w-full text-center mt-1">
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#1e3a8a] mb-0.5">AUTHORISED SIGNATORY</p>
                <p className="text-[9px] text-[#1e3a8a] font-semibold italic">Auth. Sign. / Director</p>
              </div>
            </div>
          </div>

          {/* Bottom Note */}
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
