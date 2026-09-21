import type { LocalizedText } from "@/config/i18n";
import type { ImageEntry } from "@/types";

/** What a badge means — each tone gets its own colour on the card. */
export type TourBadgeTone = "bestseller" | "new" | "scarce";

/** Decorative colour theme, shown behind a photo while it loads. */
export type TourAccent = "sunrise" | "sea" | "forest" | "city" | "sand";

/**
 * Money always crosses the wire in minor units (kuruş), never as a float or a
 * pre-formatted string. `formatPrice` is the only place that divides.
 */
export type Price = {
  amountMinor: number;
  currency: string;
};

/** A photo as the API sends it. Credit is absent for images without attribution. */
export type TourImage = {
  url: string;
  alt: string;
  blurDataURL?: string;
  credit?: { author: string; license: string; source: string };
};

export type ItineraryDay = {
  day: number;
  title: string;
  description: string;
};

/** What a card needs: `GET /tours`. */
export type TourSummary = {
  slug: string;
  accent: TourAccent;
  badgeTone?: TourBadgeTone;
  badge?: string;
  title: string;
  destination: string;
  country: string;
  summary: string;
  highlights: string[];
  durationDays: number;
  durationNights: number;
  maxGroupSize: number;
  rating: number;
  reviewCount: number;
  price: Price;
  cover: TourImage | null;
};

/** The full payload for a tour page: `GET /tours/:slug`. */
export type Tour = TourSummary & {
  description: string;
  included: string[];
  itinerary: ItineraryDay[];
  gallery: TourImage[];
};

/** One bookable date: `GET /tours/:slug/departures`. */
export type Departure = {
  id: string;
  departsOn: string;
  returnsOn: string | null;
  capacity: number;
  seatsLeft: number;
  price: Price;
};

/**
 * Shape of the seed source in data/tours.ts. The API owns the catalogue now; this
 * type only survives so `api/scripts/export-web-tours.ts` can read that file.
 */
export type TourEntry = {
  slug: string;
  accent: TourAccent;
  cover: ImageEntry;
  gallery: ImageEntry[];
  title: LocalizedText;
  destination: LocalizedText;
  country: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  badge?: LocalizedText;
  badgeTone?: TourBadgeTone;
  highlights: LocalizedText[];
  included: LocalizedText[];
  itinerary: {
    day: number;
    title: LocalizedText;
    description: LocalizedText;
  }[];
  durationDays: number;
  durationNights: number;
  maxGroupSize: number;
  rating: number;
  reviewCount: number;
  /** Whole lira in the seed source; converted to minor units on export. */
  price: { amount: number; currency: "TRY" };
};
