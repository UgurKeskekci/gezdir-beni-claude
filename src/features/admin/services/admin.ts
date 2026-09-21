import type { AdminStats, ReservationQuery } from "@/features/admin/types";
import type { Reservation, ReservationStatus } from "@/features/reservations";
import { api, ApiError, type Page } from "@/lib/api/client";

/**
 * Every call here runs in the browser and carries the session cookie. The panel is
 * served from port 3000 and the API from 4000, so `credentials: "include"` is what
 * makes the cookie travel; without it every request comes back 401.
 */
const authed = { cache: "no-store", credentials: "include" } as const;

export async function adminLogin(password: string): Promise<void> {
  await api.post("/admin/login", { password }, authed);
}

export async function adminLogout(): Promise<void> {
  await api.post("/admin/logout", undefined, authed);
}

/** `true` when the cookie is still valid — the panel's guard. */
export async function hasAdminSession(): Promise<boolean> {
  try {
    await api.get("/admin/me", authed);
    return true;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return false;
    throw error;
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  return api.get<AdminStats>("/admin/stats", authed);
}

export async function listAdminReservations(
  query: ReservationQuery = {},
): Promise<Page<Reservation>> {
  const search = new URLSearchParams();
  if (query.status) search.set("status", query.status);
  if (query.q) search.set("q", query.q);
  if (query.page) search.set("page", String(query.page));
  if (query.perPage) search.set("perPage", String(query.perPage));

  const suffix = search.toString();
  return api.getPage<Reservation>(
    `/admin/reservations${suffix ? `?${suffix}` : ""}`,
    authed,
  );
}

/** `null` rather than a throw, so the detail page can show "not found" on its own. */
export async function getAdminReservation(
  reference: string,
): Promise<Reservation | null> {
  try {
    return await api.get<Reservation>(
      `/admin/reservations/${encodeURIComponent(reference)}`,
      authed,
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/**
 * The one write the panel makes. Cancelling returns the seats to the departure and
 * reinstating re-takes them, both inside one transaction on the API side, so
 * availability cannot drift.
 */
export async function setReservationStatus(
  reference: string,
  status: ReservationStatus,
): Promise<Reservation> {
  return api.patch<Reservation>(
    `/admin/reservations/${encodeURIComponent(reference)}`,
    { status },
    authed,
  );
}
