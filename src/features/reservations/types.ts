import type { Price } from "@/features/tours/types";

export type ReservationStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "failed";

/** A booking as the API returns it — see docs/API.md. */
export type Reservation = {
  reference: string;
  status: ReservationStatus;
  travellers: number;
  tour: { slug: string; title: { tr: string; en: string } };
  departure: { departsOn: string; returnsOn: string | null };
  guest: { fullName: string; email: string; phone: string; note?: string };
  address: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  price: {
    unitAmountMinor: number;
    totalAmountMinor: number;
    currency: Price["currency"];
  };
  payment: {
    status: PaymentStatus;
    method?: string;
    cardBrand?: string;
    cardLast4?: string;
    paidAt: string | null;
  };
  createdAt: string;
};

/**
 * Card details are sent once and never stored: the API validates them, keeps the brand
 * and last four digits, and throws the rest away.
 */
export type CardInput = {
  number: string;
  holder: string;
  expiryMonth: number;
  expiryYear: number;
  cvc: string;
};

export type CreateReservationInput = {
  departureId: string;
  travellers: number;
  guest: {
    fullName: string;
    email: string;
    phone: string;
    note?: string;
  };
  address: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
  /** Omit to hold the booking without paying; it stays "pending". */
  payment?: { method: "card"; card: CardInput };
};
