'use client';

// ============================================================
// Step 4 — Review & Generate
// ============================================================

import { UseFormGetValues } from 'react-hook-form';
import { ReceiptFormValues } from '@/lib/validation/receipt-schema';
import { PAYMENT_MODE_LABELS, PaymentMode } from '@/types/receipt';
import { amountToWords, formatAmountIndian } from '@/lib/amount-to-words';

interface ReviewStepProps {
  getValues: UseFormGetValues<ReceiptFormValues>;
  onGoToStep: (step: number) => void;
  isSubmitting: boolean;
}

function ReviewSection({
  title,
  editStep,
  onEdit,
  children,
}: {
  title: string;
  editStep: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(editStep)}
          className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit
        </button>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string | undefined }) {
  if (!value || value.trim() === '') return null;
  return (
    <div className="flex items-start text-sm">
      <span className="text-slate-500 w-36 shrink-0">{label}</span>
      <span className="text-slate-800 font-medium">{value}</span>
    </div>
  );
}

export function ReviewStep({ getValues, onGoToStep, isSubmitting }: ReviewStepProps) {
  const values = getValues();
  const formattedDate = values.donationDate
    ? new Date(values.donationDate + 'T00:00:00').toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold">
            4
          </span>
          Review & Generate
        </h2>
        <p className="text-sm text-slate-500 mt-1 ml-9">
          Please review all information before generating the receipt.
        </p>
      </div>

      {/* Donor Details */}
      <ReviewSection title="Donor Details" editStep={0} onEdit={onGoToStep}>
        <ReviewRow label="Name" value={values.donorName} />
        <ReviewRow label="Address" value={values.donorAddress} />
        <ReviewRow label="PAN" value={values.donorPan} />
        <ReviewRow label="Phone" value={values.donorContact} />
        <ReviewRow label="Email" value={values.donorEmail} />
      </ReviewSection>

      {/* Donation Details */}
      <ReviewSection title="Donation Details" editStep={1} onEdit={onGoToStep}>
        <ReviewRow label="Amount" value={values.amount ? formatAmountIndian(values.amount) : ''} />
        <ReviewRow
          label="In Words"
          value={values.amount ? amountToWords(values.amount) : ''}
        />
        <ReviewRow label="Date" value={formattedDate} />
        <ReviewRow label="Purpose" value={values.purpose} />
      </ReviewSection>

      {/* Payment Details */}
      <ReviewSection title="Payment Details" editStep={2} onEdit={onGoToStep}>
        <ReviewRow
          label="Payment Mode"
          value={PAYMENT_MODE_LABELS[values.paymentMode as PaymentMode]}
        />
        <ReviewRow label="Reference" value={values.paymentReference} />
      </ReviewSection>

      {/* Generate Button */}
      <div className="pt-2">
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-emerald-800 text-sm">
              A unique receipt number will be automatically generated. Once created, the receipt cannot be modified.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 disabled:shadow-none flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              Generating Receipt...
            </>
          ) : (
            <>
              Generate Receipt
            </>
          )}
        </button>
      </div>
    </div>
  );
}
