'use client';

// ============================================================
// Step 2 — Donation Details
// ============================================================

import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { ReceiptFormValues } from '@/lib/validation/receipt-schema';
import { amountToWords, formatAmountIndian } from '@/lib/amount-to-words';

interface DonationDetailsProps {
  register: UseFormRegister<ReceiptFormValues>;
  errors: FieldErrors<ReceiptFormValues>;
  watch: UseFormWatch<ReceiptFormValues>;
}

export function DonationDetails({ register, errors, watch }: DonationDetailsProps) {
  const amount = watch('amount');

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold">
            2
          </span>
          Donation Details
        </h2>
        <p className="text-sm text-slate-500 mt-1 ml-9">
          Enter the donation amount, date, and purpose.
        </p>
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Donation Amount (₹) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-lg">
            ₹
          </span>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="1"
            {...register('amount', { valueAsNumber: true })}
            placeholder="10000"
            className={`w-full pl-10 pr-4 py-3 border rounded-xl text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition-all text-lg font-medium ${
              errors.amount ? 'border-red-300 bg-red-50/30' : 'border-slate-200'
            }`}
          />
        </div>
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 animate-scale-in">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.amount.message}
          </p>
        )}

        {/* Live amount preview */}
        {amount > 0 && !isNaN(amount) && (
          <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3 animate-scale-in">
            <p className="text-emerald-800 font-semibold text-sm">
              {formatAmountIndian(amount)}
            </p>
            <p className="text-emerald-600 text-xs mt-0.5">
              {amountToWords(amount)}
            </p>
          </div>
        )}
      </div>

      {/* Donation Date */}
      <div>
        <label htmlFor="donationDate" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Donation Date <span className="text-red-500">*</span>
        </label>
        <input
          id="donationDate"
          type="date"
          {...register('donationDate')}
          className={`w-full px-4 py-3 border rounded-xl text-slate-800 bg-slate-50/50 focus:bg-white transition-all ${
            errors.donationDate ? 'border-red-300 bg-red-50/30' : 'border-slate-200'
          }`}
        />
        {errors.donationDate && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 animate-scale-in">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.donationDate.message}
          </p>
        )}
      </div>

      {/* Purpose */}
      <div>
        <label htmlFor="purpose" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Purpose / Towards
          <span className="text-slate-400 font-normal ml-1">(optional)</span>
        </label>
        <input
          id="purpose"
          type="text"
          {...register('purpose')}
          placeholder="e.g., General Donation, Education, Healthcare"
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition-all"
        />
      </div>
    </div>
  );
}
