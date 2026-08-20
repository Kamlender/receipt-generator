'use client';

// ============================================================
// Step 1 — Donor Details
// ============================================================

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ReceiptFormValues } from '@/lib/validation/receipt-schema';

interface DonorDetailsProps {
  register: UseFormRegister<ReceiptFormValues>;
  errors: FieldErrors<ReceiptFormValues>;
}

export function DonorDetails({ register, errors }: DonorDetailsProps) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold">
            1
          </span>
          Donor Details
        </h2>
        <p className="text-sm text-slate-500 mt-1 ml-9">
          Enter the donor&apos;s information as it should appear on the receipt.
        </p>
      </div>

      {/* Donor Name */}
      <div>
        <label htmlFor="donorName" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Donor Name <span className="text-red-500">*</span>
        </label>
        <input
          id="donorName"
          type="text"
          {...register('donorName')}
          placeholder="e.g., Rajesh Kumar Sharma"
          className={`w-full px-4 py-3 border rounded-xl text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition-all ${
            errors.donorName ? 'border-red-300 bg-red-50/30' : 'border-slate-200'
          }`}
        />
        {errors.donorName && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 animate-scale-in">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.donorName.message}
          </p>
        )}
      </div>

      {/* Donor PAN */}
      <div>
        <label htmlFor="donorPan" className="block text-sm font-semibold text-slate-700 mb-1.5">
          PAN Number <span className="text-red-500">*</span>
        </label>
        <input
          id="donorPan"
          type="text"
          {...register('donorPan')}
          placeholder="e.g., ABCDE1234F"
          maxLength={10}
          className={`w-full px-4 py-3 border rounded-xl text-slate-800 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white transition-all uppercase ${
            errors.donorPan ? 'border-red-300 bg-red-50/30' : 'border-slate-200'
          }`}
        />
        {errors.donorPan && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 animate-scale-in">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.donorPan.message}
          </p>
        )}
      </div>

      {/* Donor Address */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Address
        </label>
        <textarea
          {...register('donorAddress')}
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.donorAddress ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
          } focus:ring-4 transition-all resize-none bg-white`}
          placeholder="Enter donor's full address"
          rows={3}
        />
        {errors.donorAddress && (
          <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.donorAddress.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Phone Number
          </label>
          <input
            type="tel"
            {...register('donorContact')}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.donorContact ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
            } focus:ring-4 transition-all bg-white`}
            placeholder="+91-XXXXXXXXXX"
          />
          {errors.donorContact && (
            <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.donorContact.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            {...register('donorEmail')}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.donorEmail ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'
            } focus:ring-4 transition-all bg-white`}
            placeholder="donor@example.com"
          />
          {errors.donorEmail && (
            <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.donorEmail.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
