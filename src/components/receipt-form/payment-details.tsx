'use client';

// ============================================================
// Step 3 — Payment Details
// ============================================================

import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { ReceiptFormValues } from '@/lib/validation/receipt-schema';
import { PAYMENT_MODE_LABELS, PAYMENT_MODES_REQUIRING_REFERENCE, PaymentMode } from '@/types/receipt';

interface PaymentDetailsProps {
  register: UseFormRegister<ReceiptFormValues>;
  errors: FieldErrors<ReceiptFormValues>;
  watch: UseFormWatch<ReceiptFormValues>;
}

/** Get the label for the reference field based on payment mode */
function getReferenceLabel(mode: PaymentMode): string {
  switch (mode) {
    case 'UPI':
      return 'UPI Transaction ID';
    case 'BANK_TRANSFER':
      return 'UTR / Reference Number';
    case 'CHEQUE':
      return 'Cheque Number';
    default:
      return 'Reference Number';
  }
}

/** Get placeholder text for reference field */
function getReferencePlaceholder(mode: PaymentMode): string {
  switch (mode) {
    case 'UPI':
      return 'e.g., 426183749261';
    case 'BANK_TRANSFER':
      return 'e.g., UTIB0000001234';
    case 'CHEQUE':
      return 'e.g., 000123';
    default:
      return 'Enter reference number';
  }
}

export function PaymentDetails({ register, errors, watch }: PaymentDetailsProps) {
  const paymentMode = watch('paymentMode');
  const showReference = PAYMENT_MODES_REQUIRING_REFERENCE.includes(paymentMode as PaymentMode);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold">
            3
          </span>
          Payment Details
        </h2>
        <p className="text-sm text-slate-500 mt-1 ml-9">
          Select the payment method and enter transaction details.
        </p>
      </div>

      {/* Payment Mode */}
      <div>
        <label htmlFor="paymentMode" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Payment Mode <span className="text-red-500">*</span>
        </label>
        <select
          id="paymentMode"
          {...register('paymentMode')}
          className={`w-full px-4 py-3 border rounded-xl text-slate-800 bg-slate-50/50 focus:bg-white transition-all appearance-none cursor-pointer ${
            errors.paymentMode ? 'border-red-300 bg-red-50/30' : 'border-slate-200'
          }`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.25em 1.25em',
          }}
        >
          {(Object.entries(PAYMENT_MODE_LABELS) as [PaymentMode, string][]).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.paymentMode && (
          <p className="text-red-500 text-xs mt-1.5 animate-scale-in">{errors.paymentMode.message}</p>
        )}
      </div>

      {/* Payment Reference — conditional */}
      {showReference && (
        <div className="animate-slide-in">
          <label htmlFor="paymentReference" className="block text-sm font-semibold text-slate-700 mb-1.5">
            {getReferenceLabel(paymentMode as PaymentMode)} <span className="text-red-500">*</span>
          </label>
          <input
            id="paymentReference"
            type="text"
            {...register('paymentReference')}
            placeholder={getReferencePlaceholder(paymentMode as PaymentMode)}
            className={`w-full px-4 py-3 border rounded-xl text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition-all ${
              errors.paymentReference ? 'border-red-300 bg-red-50/30' : 'border-slate-200'
            }`}
          />
          {errors.paymentReference && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 animate-scale-in">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.paymentReference.message}
            </p>
          )}
        </div>
      )}

      {/* Cash note */}
      {paymentMode === 'CASH' && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 animate-scale-in">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-amber-800 text-sm">
              For cash donations, no transaction reference is required. The receipt will note the payment mode as Cash.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
