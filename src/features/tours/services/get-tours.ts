import type { Locale } from "@/config/i18n";
import { tours } from "@/features/tours/data/tours";
import type { Tour, TourEntry } from "@/features/tours/types";
import { localizeImage } from "@/lib/localize";

function localize(entry: TourEntry, locale: Locale): Tour {
  return {
    ...entry,
    cover: localizeImage(entry.cover, locale),
    gallery: entry.gallery.map((image) => localizeImage(image, locale)),
    title: entry.title[locale],
    destination: entry.destination[locale],
    country: entry.country[locale],
    summary: entry.summary[locale],
    description: entry.description[locale],
    badge: entry.badge?.[locale],
    highlights: entry.highlights.map((highlight) => highlight[locale]),
    included: entry.included.map((item) => item[locale]),
    itinerary: entry.itinerary.map((day) => ({
      day: day.day,
      title: day.title[locale],
      description: day.description[locale],
    })),
  };
}

/**
 * The only way the UI reads tours.
 * Backend later: return api.get<Tour[]>(`/tours?locale=${locale}`).
 */
export async function getTours(locale: Locale): Promise<Tour[]> {
  return tours.map((entry) => localize(entry, locale));
}

/** The shorter list shown on the home page. */
export async function getFeaturedTours(
  locale: Locale,
  limit = 3,
): Promise<Tour[]> {
  return tours.slice(0, limit).map((entry) => localize(entry, locale));
}

export async function getTourBySlug(
  slug: string,
  locale: Locale,
): Promise<Tour | null> {
  const entry = tours.find((tour) => tour.slug === slug);
  return entry ? localize(entry, locale) : null;
}

/** Other tours to show at the bottom of a detail page. */
export async function getRelatedTours(
  slug: string,
  locale: Locale,
  limit = 3,
): Promise<Tour[]> {
  return tours
    .filter((tour) => tour.slug !== slug)
    .slice(0, limit)
    .map((entry) => localize(entry, locale));
}

/** Every slug, for generateStaticParams. */
export async function getTourSlugs(): Promise<string[]> {
  return tours.map((tour) => tour.slug);
}
