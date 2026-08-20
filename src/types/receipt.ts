// ============================================================
// 80G Receipt Generator — TypeScript Interfaces
// ============================================================

/** Payment modes supported by JEEVANKRITI FOUNDATION */
export type PaymentMode = 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'CASH';

/** Receipt status */
export type ReceiptStatus = 'ISSUED';

/** Payment mode display labels */
export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  UPI: 'UPI',
  BANK_TRANSFER: 'Bank Transfer (NEFT/RTGS/IMPS)',
  CHEQUE: 'Cheque',
  CASH: 'Cash',
};

/** Which payment modes require a reference/transaction ID */
export const PAYMENT_MODES_REQUIRING_REFERENCE: PaymentMode[] = [
  'UPI',
  'BANK_TRANSFER',
  'CHEQUE',
];

/** Form data as entered by the user (before server processing) */
export interface ReceiptFormData {
  // Donor Details
  donorName: string;
  donorAddress: string;
  donorPan: string;
  donorContact: string;
  donorEmail: string;

  // Donation Details
  amount: number;
  donationDate: string; // ISO date string YYYY-MM-DD
  purpose: string;

  // Payment Details
  paymentMode: PaymentMode;
  paymentReference: string;
}

/** Complete receipt as stored in Firestore */
export interface Receipt {
  id: string;
  receiptNumber: string;

  // Donor
  donorName: string;
  donorAddress: string;
  donorPan: string;
  donorContact: string;
  donorEmail: string;

  // Donation
  amount: number;
  amountInWords: string;
  donationDate: string;
  purpose: string;

  // Payment
  paymentMode: PaymentMode;
  paymentReference: string;

  // Meta
  status: ReceiptStatus;
  createdBy: string;
  createdAt: string; // ISO string
}

/** Fixed NGO configuration — now editable via Admin panel */
export interface NGOConfig {
  name: string;
  address: string;
  pan: string;
  registration80G: string;
  registrationNumber: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  logoUrl: string;
  signatureUrl: string; // Base64 data URL of admin's digital signature
  remark?: string; // Optional remark controlled by Admin
}

/** The form steps for the multi-step wizard */
export type FormStep = 'donor' | 'donation' | 'payment' | 'review';

/** Form step metadata for progress display */
export interface FormStepInfo {
  id: FormStep;
  label: string;
  number: number;
}

export const FORM_STEPS: FormStepInfo[] = [
  { id: 'donor', label: 'Donor Details', number: 1 },
  { id: 'donation', label: 'Donation Details', number: 2 },
  { id: 'payment', label: 'Payment Details', number: 3 },
  { id: 'review', label: 'Review & Generate', number: 4 },
];
