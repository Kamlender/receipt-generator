// ============================================================
// Firestore Receipt Operations
// ============================================================
// All database operations for receipts, receipt sequencing,
// and NGO config. Uses Firestore Transactions for atomic
// receipt number generation.
// ============================================================

import {
  collection,
  doc,
  getDoc,
  setDoc,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Receipt, ReceiptFormData, PaymentMode } from '@/types/receipt';
import { amountToWords } from '@/lib/amount-to-words';
import { formatReceiptNumber } from '@/config/ngo-config';

// Collection references
const RECEIPTS_COLLECTION = 'receipts';
const SEQUENCE_COLLECTION = 'receipt_sequence';
const SEQUENCE_DOC_ID = 'current';

/**
 * Initialize the receipt sequence counter if it doesn't exist.
 * Call this once during initial setup.
 */
export async function initializeSequence(): Promise<void> {
  const seqRef = doc(db, SEQUENCE_COLLECTION, SEQUENCE_DOC_ID);
  const seqSnap = await getDoc(seqRef);

  if (!seqSnap.exists()) {
    await setDoc(seqRef, {
      prefix: 'JKF',
      currentNumber: 0,
      updatedAt: serverTimestamp(),
    });
  }
}

/**
 * Create a new receipt with an atomically generated receipt number.
 *
 * Uses a Firestore Transaction to:
 * 1. Read the current sequence number
 * 2. Increment it
 * 3. Create the receipt with the new number
 *
 * This guarantees no duplicate receipt numbers even with concurrent requests.
 */
export async function createReceipt(
  formData: ReceiptFormData,
  userId: string
): Promise<Receipt> {
  const receipt = await runTransaction(db, async (transaction) => {
    // Step 1: Read and increment the sequence atomically
    const seqRef = doc(db, SEQUENCE_COLLECTION, SEQUENCE_DOC_ID);
    const seqSnap = await transaction.get(seqRef);

    let currentNumber = 0;
    if (seqSnap.exists()) {
      currentNumber = seqSnap.data().currentNumber || 0;
    }
    const nextNumber = currentNumber + 1;
    const receiptNumber = formatReceiptNumber(nextNumber);

    // Step 2: Update the sequence counter
    transaction.set(seqRef, {
      prefix: 'JKF',
      currentNumber: nextNumber,
      updatedAt: serverTimestamp(),
    });

    // Step 3: Create the receipt document
    const receiptRef = doc(collection(db, RECEIPTS_COLLECTION));
    const now = new Date().toISOString();

    const receiptData: Omit<Receipt, 'id'> & { createdAtTimestamp: ReturnType<typeof serverTimestamp> } = {
      receiptNumber,
      donorName: formData.donorName.trim(),
      donorAddress: formData.donorAddress.trim(),
      donorPan: formData.donorPan?.trim().toUpperCase() || '',
      donorContact: formData.donorContact?.trim() || '',
      donorEmail: formData.donorEmail?.trim().toLowerCase() || '',
      amount: formData.amount,
      amountInWords: amountToWords(formData.amount),
      donationDate: formData.donationDate,
      purpose: formData.purpose?.trim() || '',
      paymentMode: formData.paymentMode as PaymentMode,
      paymentReference: formData.paymentReference?.trim() || '',
      status: 'ISSUED',
      createdBy: userId,
      createdAt: now,
      createdAtTimestamp: serverTimestamp(),
    };

    transaction.set(receiptRef, receiptData);

    return {
      id: receiptRef.id,
      receiptNumber,
      donorName: receiptData.donorName,
      donorAddress: receiptData.donorAddress,
      donorPan: receiptData.donorPan,
      donorContact: receiptData.donorContact,
      donorEmail: receiptData.donorEmail,
      amount: receiptData.amount,
      amountInWords: receiptData.amountInWords,
      donationDate: receiptData.donationDate,
      purpose: receiptData.purpose,
      paymentMode: receiptData.paymentMode,
      paymentReference: receiptData.paymentReference,
      status: receiptData.status as 'ISSUED',
      createdBy: receiptData.createdBy,
      createdAt: receiptData.createdAt,
    } satisfies Receipt;
  });

  return receipt;
}

/**
 * Fetch a receipt by its Firestore document ID.
 */
export async function getReceiptById(receiptId: string): Promise<Receipt | null> {
  const receiptRef = doc(db, RECEIPTS_COLLECTION, receiptId);
  const receiptSnap = await getDoc(receiptRef);

  if (!receiptSnap.exists()) {
    return null;
  }

  const data = receiptSnap.data();

  return {
    id: receiptSnap.id,
    receiptNumber: data.receiptNumber,
    donorName: data.donorName,
    donorAddress: data.donorAddress,
    donorPan: data.donorPan || '',
    donorContact: data.donorContact || '',
    donorEmail: data.donorEmail || '',
    amount: data.amount,
    amountInWords: data.amountInWords,
    donationDate: data.donationDate,
    purpose: data.purpose || '',
    paymentMode: data.paymentMode,
    paymentReference: data.paymentReference || '',
    status: data.status,
    createdBy: data.createdBy,
    createdAt: data.createdAt,
  } satisfies Receipt;
}

/**
 * Get the current sequence number (for display purposes only).
 */
export async function getCurrentSequenceNumber(): Promise<number> {
  const seqRef = doc(db, SEQUENCE_COLLECTION, SEQUENCE_DOC_ID);
  const seqSnap = await getDoc(seqRef);

  if (!seqSnap.exists()) {
    return 0;
  }

  return seqSnap.data().currentNumber || 0;
}

// ============================================================
// NGO Settings Operations
// ============================================================

const SETTINGS_COLLECTION = 'settings';
const NGO_CONFIG_DOC_ID = 'ngo-config';

import { NGOConfig } from '@/types/receipt';
import { NGO_CONFIG as DEFAULT_NGO_CONFIG } from '@/config/ngo-config';

/**
 * Fetch dynamic NGO settings from Firestore.
 * If not found, returns the default hardcoded config.
 */
export async function getNGOSettings(): Promise<NGOConfig> {
  const settingsRef = doc(db, SETTINGS_COLLECTION, NGO_CONFIG_DOC_ID);
  const settingsSnap = await getDoc(settingsRef);

  if (!settingsSnap.exists()) {
    return { ...DEFAULT_NGO_CONFIG, signatureUrl: '' }; // Add default empty signature
  }

  // Merge db settings over defaults to ensure no missing fields
  return {
    ...DEFAULT_NGO_CONFIG,
    ...settingsSnap.data()
  } as NGOConfig;
}

/**
 * Save NGO settings to Firestore.
 */
export async function saveNGOSettings(settings: NGOConfig): Promise<void> {
  const settingsRef = doc(db, SETTINGS_COLLECTION, NGO_CONFIG_DOC_ID);
  await setDoc(settingsRef, settings, { merge: true });
}
