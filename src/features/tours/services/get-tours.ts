import type { Locale } from "@/config/i18n";
import type { Departure, Tour, TourSummary } from "@/features/tours/types";
import { api, ApiError } from "@/lib/api/client";

/**
 * The only way the UI reads tours. Everything comes from the booking API
 * (see docs/API.md); the catalogue is no longer bundled with the site.
 *
 * Catalogue text changes rarely, so it is cached briefly. Seat counts must never be
 * cached — see `getDepartures`.
 */
const CATALOGUE_CACHE = { next: { revalidate: 60 } } as const;

export async function getTours(locale: Locale): Promise<TourSummary[]> {
  return api.get<TourSummary[]>(`/tours?locale=${locale}`, CATALOGUE_CACHE);
}

/** The shorter list shown on the home page. */
export async function getFeaturedTours(
  locale: Locale,
  limit = 3,
): Promise<TourSummary[]> {
  const tours = await getTours(locale);
  return tours.slice(0, limit);
}

export async function getTourBySlug(
  slug: string,
  locale: Locale,
): Promise<Tour | null> {
  try {
    return await api.get<Tour>(
      `/tours/${encodeURIComponent(slug)}?locale=${locale}`,
      CATALOGUE_CACHE,
    );
  } catch (error) {
    // An unknown slug is a 404 page, not a crash.
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/** Other tours to show at the bottom of a detail page. */
export async function getRelatedTours(
  slug: string,
  locale: Locale,
  limit = 3,
): Promise<TourSummary[]> {
  const tours = await getTours(locale);
  return tours.filter((tour) => tour.slug !== slug).slice(0, limit);
}

/**
 * Bookable dates with live availability. Never cached: a stale `seatsLeft` would send
 * someone into a checkout for a seat that is already gone.
 */
export async function getDepartures(slug: string): Promise<Departure[]> {
  try {
    return await api.get<Departure[]>(
      `/tours/${encodeURIComponent(slug)}/departures`,
      { cache: "no-store" },
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return [];
    throw error;
  }
}

/**
 * Slugs for the sitemap. A failure here must not fail the build, so it degrades to an
 * empty list and says so in the log.
 */
export async function getTourSlugs(): Promise<string[]> {
  try {
    const tours = await getTours("tr");
    return tours.map((tour) => tour.slug);
  } catch (error) {
    console.warn(
      "Sitemap: could not reach the booking API, tour URLs are omitted.",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}
