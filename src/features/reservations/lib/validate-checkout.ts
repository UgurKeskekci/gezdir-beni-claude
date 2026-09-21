import {
  normaliseCardNumber,
  passesLuhn,
} from "@/features/reservations/lib/card";
import type { Dictionary } from "@/i18n/types";

/**
 * Client-side checkout validation.
 *
 * The rules deliberately mirror the API's zod schema (see docs/API.md). If they drift,
 * a visitor passes here and is rejected by the server with a message that cannot point
 * at a field — which is the failure this exists to prevent.
 */
export type CheckoutField =
  | "fullName"
  | "email"
  | "phone"
  | "addressLine1"
  | "city"
  | "postalCode"
  | "country"
  | "cardNumber"
  | "cardHolder"
  | "cvc";

/** Visual order of the form, so the first error is the one nearest the top. */
export const FIELD_ORDER: CheckoutField[] = [
  "fullName",
  "email",
  "phone",
  "addressLine1",
  "city",
  "postalCode",
  "country",
  "cardNumber",
  "cardHolder",
  "cvc",
];

export type FieldErrors = Partial<Record<CheckoutField, string>>;

type Messages = Dictionary["booking"]["fieldErrors"];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateCheckout(
  values: Record<CheckoutField, string>,
  payNow: boolean,
  messages: Messages,
): FieldErrors {
  const errors: FieldErrors = {};
  const value = (field: CheckoutField) => values[field].trim();

  const requireText = (field: CheckoutField, min: number, message: string) => {
    const text = value(field);
    if (text.length === 0) errors[field] = messages.required;
    else if (text.length < min) errors[field] = message;
  };

  requireText("fullName", 2, messages.fullName);

  const email = value("email");
  if (email.length === 0) errors.email = messages.required;
  else if (!EMAIL.test(email)) errors.email = messages.email;

  // The API only checks the length, which lets "letters" through. Phone formats vary
  // too much to match strictly, but a real number always has digits in it.
  const phone = value("phone");
  if (phone.length === 0) errors.phone = messages.required;
  else if (phone.length < 5 || (phone.match(/\d/g) ?? []).length < 6) {
    errors.phone = messages.phone;
  }
  requireText("addressLine1", 3, messages.addressLine1);
  requireText("city", 2, messages.city);
  requireText("postalCode", 3, messages.postalCode);

  const country = value("country");
  if (country.length === 0) errors.country = messages.required;
  else if (!/^[A-Za-z]{2}$/.test(country)) errors.country = messages.country;

  if (payNow) {
    const digits = normaliseCardNumber(value("cardNumber"));
    if (digits.length === 0) errors.cardNumber = messages.required;
    else if (!passesLuhn(digits)) errors.cardNumber = messages.cardNumber;

    requireText("cardHolder", 2, messages.cardHolder);

    const cvc = value("cvc");
    if (cvc.length === 0) errors.cvc = messages.required;
    else if (!/^\d{3,4}$/.test(cvc)) errors.cvc = messages.cvc;
  }

  return errors;
}

/**
 * Maps the API's `details[].path` onto a form field, so a server-side rejection still
 * lands next to the input the visitor has to change.
 */
const PATH_TO_FIELD: Record<string, CheckoutField> = {
  "guest.fullName": "fullName",
  "guest.email": "email",
  "guest.phone": "phone",
  "address.line1": "addressLine1",
  "address.city": "city",
  "address.postalCode": "postalCode",
  "address.country": "country",
  "payment.card.number": "cardNumber",
  "payment.card.holder": "cardHolder",
  "payment.card.cvc": "cvc",
};

export function fieldErrorsFromApi(details: unknown): FieldErrors {
  const errors: FieldErrors = {};
  if (!Array.isArray(details)) return errors;

  for (const item of details) {
    if (typeof item !== "object" || item === null) continue;
    const { path, message } = item as { path?: unknown; message?: unknown };
    if (typeof path !== "string" || typeof message !== "string") continue;

    const field = PATH_TO_FIELD[path];
    if (field) errors[field] = message;
  }
  return errors;
}

/** The single `{ field: message }` the API sends for a declined or malformed card. */
export function fieldErrorFromDetail(details: unknown): FieldErrors {
  if (typeof details !== "object" || details === null) return {};
  const { field } = details as { field?: unknown };
  if (typeof field !== "string") return {};

  const mapped = PATH_TO_FIELD[field];
  return mapped ? { [mapped]: "" } : {};
}
