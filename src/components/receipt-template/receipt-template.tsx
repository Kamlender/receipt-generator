'use client';

// ============================================================
// Receipt Template — The actual 80G receipt layout
// ============================================================
// This is the HTML receipt that gets:
// 1. Shown as a preview
// 2. Converted to PDF
// 3. Printed
//
// Replace the placeholder design with the approved receipt
// design when provided.
// ============================================================

import { Receipt, NGOConfig } from '@/types/receipt';
import { NGO_CONFIG as DEFAULT_NGO_CONFIG } from '@/config/ngo-config';
import { PAYMENT_MODE_LABELS, PaymentMode } from '@/types/receipt';
import { formatAmountIndian } from '@/lib/amount-to-words';

interface ReceiptTemplateProps {
  receipt: Receipt;
  config?: NGOConfig;
}

export function ReceiptTemplate({ receipt, config }: ReceiptTemplateProps) {
  const activeConfig = config || DEFAULT_NGO_CONFIG;
  const formattedDate = new Date(receipt.donationDate + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      id="receipt-template"
      className="receipt-template bg-white w-full max-w-[210mm] mx-auto shadow-2xl"
      style={{
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        color: '#1e293b',
        padding: '28px',
        minHeight: '297mm',
        position: 'relative',
      }}
    >
      {/* Decorative border */}
      <div
        style={{
          position: 'absolute',
          inset: '12px',
          border: '2px solid #059669',
          borderRadius: '4px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '16px',
          border: '1px solid #d1fae5',
          borderRadius: '2px',
          pointerEvents: 'none',
        }}
      />

      {/* Content inside borders */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img
            src={activeConfig.logoUrl}
            alt={`${activeConfig.name} Logo`}
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'contain',
              margin: '0 auto 12px',
              display: 'block',
            }}
          />
          <h1
            style={{
              fontSize: '22px',
              fontWeight: '800',
              letterSpacing: '1px',
              margin: '0 0 4px 0',
            }}
          >
            <span style={{ color: '#1a56db' }}>JEEVANKRITI</span>{' '}
            <span style={{ color: '#059669' }}>FOUNDATION</span>
          </h1>
          <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0' }}>
            NGO Registered Address: {activeConfig.address}
          </p>
          <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0' }}>
            PAN: {activeConfig.pan} | Contact: {activeConfig.contactPhone}, {activeConfig.contactEmail}
          </p>
          <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0' }}>
            Registration No: {activeConfig.registrationNumber}
          </p>
        </div>

        {/* Title bar */}
        <div
          style={{
            background: 'linear-gradient(135deg, #059669, #047857)',
            color: 'white',
            textAlign: 'center',
            padding: '10px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '2px', margin: 0 }}>
            DONATION RECEIPT — 80G
          </h2>
        </div>

        {/* Receipt Number & Date row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '24px',
            fontSize: '13px',
          }}
        >
          <div>
            <span style={{ color: '#64748b' }}>Receipt No: </span>
            <strong style={{ color: '#059669', fontSize: '15px' }}>{receipt.receiptNumber}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Date: </span>
            <strong>{formattedDate}</strong>
          </div>
        </div>

        {/* Donor Information */}
        <div
          style={{
            background: '#f8fafb',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#059669',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: 0,
              marginBottom: '12px',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '8px',
            }}
          >
            Donor Information
          </h3>
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 0', color: '#64748b', width: '140px', verticalAlign: 'top' }}>
                  Name
                </td>
                <td style={{ padding: '4px 0', fontWeight: '600' }}>{receipt.donorName}</td>
              </tr>
              {receipt.donorAddress && (
                <tr>
                  <td style={{ padding: '4px 0', color: '#64748b', verticalAlign: 'top' }}>Address</td>
                  <td style={{ padding: '4px 0' }}>{receipt.donorAddress}</td>
                </tr>
              )}
              {receipt.donorContact && (
                <tr>
                  <td style={{ padding: '4px 0', color: '#64748b' }}>Phone</td>
                  <td style={{ padding: '4px 0' }}>{receipt.donorContact}</td>
                </tr>
              )}
              {receipt.donorEmail && (
                <tr>
                  <td style={{ padding: '4px 0', color: '#64748b' }}>Email</td>
                  <td style={{ padding: '4px 0' }}>{receipt.donorEmail}</td>
                </tr>
              )}
              {receipt.donorPan && (
                <tr>
                  <td style={{ padding: '4px 0', color: '#64748b' }}>PAN</td>
                  <td style={{ padding: '4px 0', fontWeight: '600', fontFamily: 'monospace' }}>
                    {receipt.donorPan}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Donation Details */}
        <div
          style={{
            background: '#f8fafb',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#059669',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: 0,
              marginBottom: '12px',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '8px',
            }}
          >
            Donation Details
          </h3>
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '6px 0', color: '#64748b', width: '140px' }}>Amount</td>
                <td style={{ padding: '6px 0', fontWeight: '700', fontSize: '18px', color: '#059669' }}>
                  {formatAmountIndian(receipt.amount)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', color: '#64748b' }}>In Words</td>
                <td style={{ padding: '4px 0', fontStyle: 'italic', fontSize: '12px' }}>
                  {receipt.amountInWords}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '4px 0', color: '#64748b' }}>Donation Date</td>
                <td style={{ padding: '4px 0' }}>{formattedDate}</td>
              </tr>
              {receipt.purpose && (
                <tr>
                  <td style={{ padding: '4px 0', color: '#64748b' }}>Purpose</td>
                  <td style={{ padding: '4px 0' }}>{receipt.purpose}</td>
                </tr>
              )}
              <tr>
                <td style={{ padding: '4px 0', color: '#64748b' }}>Payment Mode</td>
                <td style={{ padding: '4px 0' }}>
                  {PAYMENT_MODE_LABELS[receipt.paymentMode as PaymentMode]}
                </td>
              </tr>
              {receipt.paymentReference && (
                <tr>
                  <td style={{ padding: '4px 0', color: '#64748b' }}>Reference</td>
                  <td style={{ padding: '4px 0', fontFamily: 'monospace', fontSize: '12px' }}>
                    {receipt.paymentReference}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 80G Information */}
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '8px',
            padding: '16px 20px',
            marginBottom: '32px',
            fontSize: '11px',
            color: '#065f46',
          }}
        >
          <p style={{ margin: '0 0 4px 0', fontWeight: '600', fontSize: '12px' }}>
            80G Tax Exemption Certificate
          </p>
          <p style={{ margin: '2px 0', whiteSpace: 'pre-wrap' }}>{activeConfig.registration80G}</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: '#047857' }}>
            Donations to {activeConfig.name} are exempt from Income Tax under Section 80G of the
            Income Tax Act, 1961. This receipt can be used as proof for claiming tax deduction.
          </p>
        </div>

        {/* Optional Admin Remark */}
        {activeConfig.remark && (
          <div style={{ marginBottom: '32px', fontSize: '11px', color: '#475569', fontStyle: 'italic', borderLeft: '3px solid #cbd5e1', paddingLeft: '12px' }}>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{activeConfig.remark}</p>
          </div>
        )}

        {/* Signature Area with Stamp */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            marginTop: '48px',
            paddingTop: '24px',
          }}
        >
          {/* Stamp Container */}
          <div
            style={{
              position: 'relative',
              width: '220px',
              textAlign: 'center',
            }}
          >
            {/* The Stamp Overlay */}
            <div
              style={{
                position: 'relative',
                border: '3px solid #1a237e',
                borderRadius: '6px',
                padding: '12px 16px',
                transform: 'rotate(-4deg)',
                opacity: 0.85,
              }}
            >
              {/* Stamp Top Text */}
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: '900',
                  color: '#1a237e',
                  letterSpacing: '1.5px',
                  margin: '0 0 6px 0',
                  textTransform: 'uppercase',
                  fontFamily: "'Arial Black', 'Impact', sans-serif",
                }}
              >
                JEEVANKRITI FOUNDATION
              </p>

              {/* Signature in the middle of stamp */}
              <div
                style={{
                  height: '55px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '4px 0',
                }}
              >
                {activeConfig.signatureUrl && (
                  <img
                    src={activeConfig.signatureUrl}
                    alt="Authorized Signature"
                    style={{
                      maxHeight: '50px',
                      maxWidth: '160px',
                      objectFit: 'contain',
                      transform: 'rotate(4deg)',
                    }}
                  />
                )}
              </div>

              {/* Stamp Bottom Text */}
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#1a237e',
                  margin: '6px 0 0 0',
                  fontFamily: "'Arial Black', 'Impact', sans-serif",
                }}
              >
                Auth. Sign./ Director
              </p>
            </div>

            {/* Label below stamp */}
            <p style={{ fontSize: '11px', color: '#64748b', margin: '12px 0 0 0' }}>
              For {activeConfig.name}
            </p>
            <p style={{ fontSize: '10px', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Authorized Signatory
            </p>
          </div>
        </div>


      </div>

      {/* Foreground Watermark Logo (Overlay) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          opacity: 0.12,
          zIndex: 50,
          paddingTop: '60px',
        }}
      >
        <img
          src={activeConfig.logoUrl}
          alt="Watermark"
          style={{ width: '750px', height: '750px', objectFit: 'contain' }}
        />
      </div>

    </div>
  );
}
