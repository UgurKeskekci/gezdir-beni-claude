import type { ReservationStatus } from "@/features/reservations";

export const RESERVATION_STATUSES = [
  "pending",
  "confirmed",
  "cancelled",
] as const;

/** `GET /admin/stats` — see docs/API.md. */
export type AdminStats = {
  reservations: {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
  };
  paidRevenueMinor: number;
  upcomingDepartures: number;
};

/** The query behind the bookings table; `page` is 1-based like the API's. */
export type ReservationQuery = {
  status?: ReservationStatus;
  q?: string;
  page?: number;
  perPage?: number;
};
