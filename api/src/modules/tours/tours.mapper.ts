import { pick, pickOptional, type Locale } from "../../lib/locale.ts";

type ImageRow = {
  role: string;
  position: number;
  url: string;
  blurDataUrl: string | null;
  altTr: string;
  altEn: string;
  creditAuthor: string | null;
  creditLicense: string | null;
  creditSource: string | null;
};

type TourRow = {
  slug: string;
  accent: string;
  badgeTone: string | null;
  titleTr: string;
  titleEn: string;
  destinationTr: string;
  destinationEn: string;
  countryTr: string;
  countryEn: string;
  summaryTr: string;
  summaryEn: string;
  descriptionTr: string;
  descriptionEn: string;
  badgeTr: string | null;
  badgeEn: string | null;
  durationDays: number;
  durationNights: number;
  maxGroupSize: number;
  rating: number;
  reviewCount: number;
  priceMinor: number;
  currency: string;
  images: ImageRow[];
  highlights?: { position: number; textTr: string; textEn: string }[];
  included?: { position: number; textTr: string; textEn: string }[];
  itinerary?: {
    day: number;
    titleTr: string;
    titleEn: string;
    descriptionTr: string;
    descriptionEn: string;
  }[];
};

function toImage(locale: Locale, row: ImageRow) {
  return {
    url: row.url,
    alt: pick(locale, { tr: row.altTr, en: row.altEn }),
    ...(row.blurDataUrl ? { blurDataURL: row.blurDataUrl } : {}),
    ...(row.creditAuthor && row.creditLicense && row.creditSource
      ? {
          credit: {
            author: row.creditAuthor,
            license: row.creditLicense,
            source: row.creditSource,
          },
        }
      : {}),
  };
}

function coverOf(locale: Locale, images: ImageRow[]) {
  const cover = images.find((image) => image.role === "cover") ?? images[0];
  return cover ? toImage(locale, cover) : null;
}

/** What a card needs. Deliberately smaller than the detail payload. */
export function toTourSummary(locale: Locale, tour: TourRow) {
  return {
    slug: tour.slug,
    accent: tour.accent,
    badgeTone: tour.badgeTone ?? undefined,
    title: pick(locale, { tr: tour.titleTr, en: tour.titleEn }),
    destination: pick(locale, {
      tr: tour.destinationTr,
      en: tour.destinationEn,
    }),
    country: pick(locale, { tr: tour.countryTr, en: tour.countryEn }),
    summary: pick(locale, { tr: tour.summaryTr, en: tour.summaryEn }),
    badge: pickOptional(locale, { tr: tour.badgeTr, en: tour.badgeEn }),
    highlights: (tour.highlights ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((item) => pick(locale, { tr: item.textTr, en: item.textEn })),
    durationDays: tour.durationDays,
    durationNights: tour.durationNights,
    maxGroupSize: tour.maxGroupSize,
    rating: tour.rating,
    reviewCount: tour.reviewCount,
    price: { amountMinor: tour.priceMinor, currency: tour.currency },
    cover: coverOf(locale, tour.images),
  };
}

/** The full payload for a tour page. */
export function toTourDetail(locale: Locale, tour: TourRow) {
  return {
    ...toTourSummary(locale, tour),
    description: pick(locale, {
      tr: tour.descriptionTr,
      en: tour.descriptionEn,
    }),
    included: (tour.included ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((item) => pick(locale, { tr: item.textTr, en: item.textEn })),
    itinerary: (tour.itinerary ?? [])
      .slice()
      .sort((a, b) => a.day - b.day)
      .map((day) => ({
        day: day.day,
        title: pick(locale, { tr: day.titleTr, en: day.titleEn }),
        description: pick(locale, {
          tr: day.descriptionTr,
          en: day.descriptionEn,
        }),
      })),
    gallery: tour.images
      .filter((image) => image.role === "gallery")
      .sort((a, b) => a.position - b.position)
      .map((image) => toImage(locale, image)),
  };
}
