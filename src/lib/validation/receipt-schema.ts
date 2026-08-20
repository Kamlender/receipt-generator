// ============================================================
// Zod Validation Schemas — Receipt Form
// ============================================================
// Shared validation used by both client-side form and server-side API.
// ============================================================

import { z } from 'zod';

/** PAN format: 5 uppercase letters, 4 digits, 1 uppercase letter */
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

/** Payment modes enum */
export const paymentModeEnum = z.enum(['UPI', 'BANK_TRANSFER', 'CHEQUE', 'CASH']);

/** Complete receipt form validation schema */
export const receiptFormSchema = z
  .object({
    // --- Donor Details ---
    donorName: z
      .string()
      .min(2, 'Donor name must be at least 2 characters')
      .max(200, 'Donor name is too long')
      .transform((val) => val.trim()),

    donorAddress: z
      .string()
      .max(500, 'Address is too long')
      .transform((val) => val.trim()),

    donorPan: z
      .string()
      .min(1, 'PAN number is required')
      .transform((val) => val.trim().toUpperCase())
      .refine(
        (val) => PAN_REGEX.test(val),
        'PAN must be in format: ABCDE1234F'
      ),

    donorContact: z
      .string()
      .max(20, 'Phone number is too long')
      .transform((val) => val.trim()),

    donorEmail: z
      .string()
      .max(100, 'Email is too long')
      .transform((val) => val.trim()),

    // --- Donation Details ---
    amount: z
      .number({ invalid_type_error: 'Please enter a valid amount' })
      .positive('Amount must be greater than zero')
      .max(999999999999, 'Amount is too large'),

    donationDate: z
      .string()
      .min(1, 'Donation date is required'),

    purpose: z
      .string()
      .max(300, 'Purpose is too long')
      .transform((val) => val.trim()),

    // --- Payment Details ---
    paymentMode: paymentModeEnum,

    paymentReference: z
      .string()
      .max(100, 'Reference number is too long')
      .transform((val) => val.trim()),
  })
  .superRefine((data, ctx) => {
    // Payment reference is required for UPI, Bank Transfer, and Cheque
    const modesRequiringRef = ['UPI', 'BANK_TRANSFER', 'CHEQUE'];
    if (
      modesRequiringRef.includes(data.paymentMode) &&
      (!data.paymentReference || data.paymentReference.trim() === '')
    ) {
      const labels: Record<string, string> = {
        UPI: 'Transaction ID',
        BANK_TRANSFER: 'UTR/Reference Number',
        CHEQUE: 'Cheque Number',
      };
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${labels[data.paymentMode]} is required for ${data.paymentMode === 'BANK_TRANSFER' ? 'Bank Transfer' : data.paymentMode} payments`,
        path: ['paymentReference'],
      });
    }
  });

/** Type inferred from the schema */
export type ReceiptFormValues = z.infer<typeof receiptFormSchema>;
