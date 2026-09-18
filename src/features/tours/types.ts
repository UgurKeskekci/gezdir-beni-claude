import type { LocalizedText } from "@/config/i18n";
import type { ImageEntry, LocalizedImage } from "@/types";

/** What a badge means — each tone gets its own colour on the card. */
export type TourBadgeTone = "bestseller" | "new" | "scarce";

/** Decorative colour theme, used behind a photo while it loads. */
export type TourAccent = "sunrise" | "sea" | "forest" | "city" | "sand";

export type TourPrice = {
  amount: number;
  currency: "TRY";
};

type ItineraryDayBase = {
  day: number;
};

export type ItineraryDayEntry = ItineraryDayBase & {
  title: LocalizedText;
  description: LocalizedText;
};

export type ItineraryDay = ItineraryDayBase & {
  title: string;
  description: string;
};

/** How a tour is stored today (all languages in one record). */
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
  itinerary: ItineraryDayEntry[];
  durationDays: number;
  durationNights: number;
  maxGroupSize: number;
  rating: number;
  reviewCount: number;
  price: TourPrice;
};

/** How a tour reaches the UI: already resolved into one language. */
export type Tour = {
  slug: string;
  accent: TourAccent;
  cover: LocalizedImage;
  gallery: LocalizedImage[];
  title: string;
  destination: string;
  country: string;
  summary: string;
  description: string;
  badge?: string;
  badgeTone?: TourBadgeTone;
  highlights: string[];
  included: string[];
  itinerary: ItineraryDay[];
  durationDays: number;
  durationNights: number;
  maxGroupSize: number;
  rating: number;
  reviewCount: number;
  price: TourPrice;
};
