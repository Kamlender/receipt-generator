// ============================================================
// Amount to Words Converter (Indian English)
// ============================================================
// Converts numeric amounts to Indian English words.
// Examples:
//   1000      → "Rupees One Thousand Only"
//   25000     → "Rupees Twenty Five Thousand Only"
//   150000    → "Rupees One Lakh Fifty Thousand Only"
//   2500000   → "Rupees Twenty Five Lakh Only"
//   10000000  → "Rupees One Crore Only"
//   1500.50   → "Rupees One Thousand Five Hundred and Paise Fifty Only"
// ============================================================

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
  'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen',
  'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
  'Sixty', 'Seventy', 'Eighty', 'Ninety',
];

/**
 * Convert a number less than 100 to words.
 */
function convertBelowHundred(n: number): string {
  if (n < 20) return ONES[n];
  const ten = TENS[Math.floor(n / 10)];
  const one = ONES[n % 10];
  return one ? `${ten} ${one}` : ten;
}

/**
 * Convert a number less than 1000 to words.
 */
function convertBelowThousand(n: number): string {
  if (n < 100) return convertBelowHundred(n);
  const hundreds = ONES[Math.floor(n / 100)];
  const remainder = n % 100;
  const rest = remainder > 0 ? ` ${convertBelowHundred(remainder)}` : '';
  return `${hundreds} Hundred${rest}`;
}

/**
 * Convert a whole number to Indian English words.
 * Uses Indian numbering system: Thousand, Lakh, Crore.
 */
function convertWholeNumber(n: number): string {
  if (n === 0) return 'Zero';
  if (n < 0) return `Minus ${convertWholeNumber(-n)}`;

  let result = '';
  let remaining = n;

  // Crores (1,00,00,000)
  if (remaining >= 10000000) {
    const crores = Math.floor(remaining / 10000000);
    result += `${convertBelowThousand(crores)} Crore `;
    remaining %= 10000000;
  }

  // Lakhs (1,00,000)
  if (remaining >= 100000) {
    const lakhs = Math.floor(remaining / 100000);
    result += `${convertBelowHundred(lakhs)} Lakh `;
    remaining %= 100000;
  }

  // Thousands (1,000)
  if (remaining >= 1000) {
    const thousands = Math.floor(remaining / 1000);
    result += `${convertBelowHundred(thousands)} Thousand `;
    remaining %= 1000;
  }

  // Hundreds and below
  if (remaining > 0) {
    result += convertBelowThousand(remaining);
  }

  return result.trim();
}

/**
 * Convert a numeric amount to Indian English words for use on receipts.
 *
 * @param amount - The numeric amount (e.g., 25000 or 1500.50)
 * @returns The amount in words (e.g., "Rupees Twenty Five Thousand Only")
 *
 * @example
 * amountToWords(25000)    // "Rupees Twenty Five Thousand Only"
 * amountToWords(1500.50)  // "Rupees One Thousand Five Hundred and Paise Fifty Only"
 * amountToWords(0)        // "Rupees Zero Only"
 */
export function amountToWords(amount: number): string {
  if (amount < 0) {
    throw new Error('Amount cannot be negative');
  }

  // Split into rupees and paise
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let result = `Rupees ${convertWholeNumber(rupees)}`;

  if (paise > 0) {
    result += ` and Paise ${convertWholeNumber(paise)}`;
  }

  result += ' Only';

  return result;
}

/**
 * Format amount with Indian numbering (₹1,00,000)
 */
export function formatAmountIndian(amount: number): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
}
