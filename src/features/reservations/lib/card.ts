/**
 * Card checks that run before the request leaves the browser, so an obvious typo does
 * not need a round trip. The API repeats them; this is convenience, not security.
 */
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
