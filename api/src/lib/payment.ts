/**
 * Dummy card handling.
 *
 * There is no payment provider: this validates the shape of a card the way a real
 * checkout would, then throws the number away. Only the brand and the last four
 * digits are ever returned to the caller, and the full number is never logged.
 */

export type CardBrand = "visa" | "mastercard" | "amex" | "troy" | "unknown";

export function normaliseCardNumber(input: string): string {
  return input.replace(/[\s-]/g, "");
}

/** Standard Luhn checksum — catches typos, not fraud. */
export function passesLuhn(digits: string): boolean {
  if (!/^\d{12,19}$/.test(digits)) return false;

  let sum = 0;
  let double = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let value = digits.charCodeAt(index) - 48;
    if (double) {
      value *= 2;
      if (value > 9) value -= 9;
    }
    sum += value;
    double = !double;
  }
  return sum % 10 === 0;
}

export function detectBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return "visa";
  if (/^9792/.test(digits)) return "troy";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^5[1-5]/.test(digits)) return "mastercard";
  if (/^2(2[2-9]|[3-6]\d|7[01]|720)/.test(digits)) return "mastercard";
  return "unknown";
}

/** True when the card is still valid on the last day of its expiry month. */
export function isExpiryValid(
  month: number,
  year: number,
  now = new Date(),
): boolean {
  if (month < 1 || month > 12) return false;
  const endOfMonth = new Date(Date.UTC(year, month, 1));
  return endOfMonth.getTime() > now.getTime();
}

export function lastFour(digits: string): string {
  return digits.slice(-4);
}
