// ============================================================
// Fixed NGO Configuration — JEEVANKRITI FOUNDATION
// ============================================================
// This file contains hardcoded NGO information that appears on
// every receipt. It is NEVER editable via the form.
// Replace placeholder values with real data before going live.
// ============================================================

import { NGOConfig } from '@/types/receipt';

export const NGO_CONFIG: NGOConfig = {
  name: 'JEEVANKRITI FOUNDATION',
  address: 'To Be Provided',
  pan: 'XXXXX0000X',
  registration80G: '80G Registration No: [ To Be Provided ] | Valid from: [ Date ] to [ Date ]',
  registrationNumber: 'To Be Provided',
  contactPhone: '+91-XXXXXXXXXX',
  contactEmail: 'contact@jeevankritifoundation.org',
  website: 'www.jeevankritifoundation.org',
  logoUrl: '/logo.png', // Place logo.png in the /public folder
  signatureUrl: '',
};

/** Receipt number prefix */
export const RECEIPT_PREFIX = 'JKF';

/** Receipt number padding (e.g., 6 digits → JKF-000001) */
export const RECEIPT_NUMBER_PAD = 6;

/** Format a receipt number from prefix and sequence number */
export function formatReceiptNumber(sequenceNumber: number): string {
  return `${RECEIPT_PREFIX}-${String(sequenceNumber).padStart(RECEIPT_NUMBER_PAD, '0')}`;
}
