import { randomInt } from "node:crypto";

/**
 * Booking reference shown to the guest: GB-7K3M2Q.
 * The alphabet drops characters that are easy to misread over the phone
 * (0/O, 1/I/L, 5/S, 8/B), so a guest can read it back without ambiguity.
 */
const ALPHABET = "234679ACDEFGHJKMNPQRTUVWXYZ";
const LENGTH = 6;

export function generateReference(): string {
  let code = "";
  for (let index = 0; index < LENGTH; index += 1) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `GB-${code}`;
}

export const REFERENCE_PATTERN = new RegExp(`^GB-[${ALPHABET}]{${LENGTH}}$`);
