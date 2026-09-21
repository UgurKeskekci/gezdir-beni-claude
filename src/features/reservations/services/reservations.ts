import type {
  CreateReservationInput,
  Reservation,
} from "@/features/reservations/types";
import { api, ApiError } from "@/lib/api/client";

/** Creates a guest booking. The API recalculates the total; nothing here is trusted. */
export async function createReservation(
  input: CreateReservationInput,
): Promise<Reservation> {
  return api.post<Reservation>("/reservations", input, { cache: "no-store" });
}

/**
 * Finds a booking from the reference plus the e-mail it was made with. Both are
 * required by the API, so a leaked reference on its own reveals nothing.
 */
export async function findReservation(
  reference: string,
  email: string,
): Promise<Reservation | null> {
  try {
    return await api.get<Reservation>(
      `/reservations/${encodeURIComponent(reference)}?email=${encodeURIComponent(email)}`,
      { cache: "no-store" },
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
