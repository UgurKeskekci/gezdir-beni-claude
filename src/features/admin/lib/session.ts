import { ApiError } from "@/lib/api/client";

/**
 * A 401 from a panel screen means the cookie ran out while the tab was open, which is
 * the one case where "your session expired" is the truth rather than a guess.
 */
export function isSessionExpired(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

export function isOffline(error: unknown): boolean {
  return error instanceof ApiError && error.isOffline;
}
