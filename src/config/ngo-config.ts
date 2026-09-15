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
  address: 'Faridabad, Haryana - 121001, India',
  pan: 'AAHCJ4905D',
  registration80G: '80G Registration No.: AAHCJ4905DF20261, valid AY 2022-23 to AY 2026-27.',
  registrationNumber: 'Reg. No. U88900HR2026NPL147259',
  contactPhone: '+91 8595232367',
  contactEmail: 'writetous@jeevankriti.org',
  website: 'www.jeevankriti.org',
  logoUrl: '/logo.png', // Place logo.png in the /public folder
  signatureUrl: '/signature.png', // Using uploaded transparent signature
};

/** Receipt number prefix */
export const RECEIPT_PREFIX = 'JKF';

/** Receipt number padding (e.g., 6 digits → JKF-000001) */
export const RECEIPT_NUMBER_PAD = 6;

/** Format a receipt number from prefix and sequence number */
export function formatReceiptNumber(sequenceNumber: number): string {
  return `${RECEIPT_PREFIX}-${String(sequenceNumber).padStart(RECEIPT_NUMBER_PAD, '0')}`;
}
