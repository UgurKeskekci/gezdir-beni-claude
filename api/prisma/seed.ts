/**
 * Seeds the catalogue from prisma/tours.json (produced by scripts/export-web-tours.ts)
 * and generates a rolling set of departure dates.
 *
 * Idempotent: run it as often as you like. Tours are matched by slug, their child rows
 * are rebuilt, and departures are matched by (tour, date). Reservations are never
 * touched, so seeding cannot destroy a booking you are testing with.
 */
import fs from "node:fs/promises";
import path from "node:path";

import { prisma } from "../src/db.ts";

type Localized = { tr: string; en: string };

type ImagePayload = {
  url: string;
  alt: Localized;
  blurDataURL?: string;
  credit: { author: string; license: string; source: string };
};

type TourPayload = {
  slug: string;
  accent: string;
  badgeTone: string | null;
  sortOrder: number;
  title: Localized;
  destination: Localized;
  country: Localized;
  summary: Localized;
  description: Localized;
  badge: Localized | null;
  durationDays: number;
  durationNights: number;
  maxGroupSize: number;
  rating: number;
  reviewCount: number;
  priceMinor: number;
  currency: string;
  cover: ImagePayload;
  gallery: ImagePayload[];
  highlights: Localized[];
  included: Localized[];
  itinerary: { day: number; title: Localized; description: Localized }[];
};

const DEPARTURES_PER_TOUR = 6;
const DAYS_BETWEEN_DEPARTURES = 21;
/** Seats already sold, cycled per departure so availability looks lived-in. */
const PRESOLD_PATTERN = [0, 2, 5, 1, 7, 3];

function imageRow(image: ImagePayload, role: string, position: number) {
  return {
    role,
    position,
    url: image.url,
    blurDataUrl: image.blurDataURL ?? null,
    altTr: image.alt.tr,
    altEn: image.alt.en,
    creditAuthor: image.credit.author,
    creditLicense: image.credit.license,
    creditSource: image.credit.source,
  };
}

/** First departure lands on the 1st of next month, then every three weeks. */
function departureDates(count: number) {
  const now = new Date();
  const first = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 6, 0, 0),
  );
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(first);
    date.setUTCDate(first.getUTCDate() + index * DAYS_BETWEEN_DEPARTURES);
    return date;
  });
}

const file = path.join(import.meta.dirname, "tours.json");
const tours = JSON.parse(await fs.readFile(file, "utf8")) as TourPayload[];

console.log(`Seeding ${tours.length} tours…`);

for (const tour of tours) {
  const data = {
    accent: tour.accent,
    badgeTone: tour.badgeTone,
    sortOrder: tour.sortOrder,
    isPublished: true,
    titleTr: tour.title.tr,
    titleEn: tour.title.en,
    destinationTr: tour.destination.tr,
    destinationEn: tour.destination.en,
    countryTr: tour.country.tr,
    countryEn: tour.country.en,
    summaryTr: tour.summary.tr,
    summaryEn: tour.summary.en,
    descriptionTr: tour.description.tr,
    descriptionEn: tour.description.en,
    badgeTr: tour.badge?.tr ?? null,
    badgeEn: tour.badge?.en ?? null,
    durationDays: tour.durationDays,
    durationNights: tour.durationNights,
    maxGroupSize: tour.maxGroupSize,
    rating: tour.rating,
    reviewCount: tour.reviewCount,
    priceMinor: tour.priceMinor,
    currency: tour.currency,
  };

  const saved = await prisma.tour.upsert({
    where: { slug: tour.slug },
    create: { slug: tour.slug, ...data },
    update: data,
  });

  // Child rows are rebuilt so the JSON stays the single source of truth.
  await prisma.$transaction([
    prisma.tourImage.deleteMany({ where: { tourId: saved.id } }),
    prisma.tourHighlight.deleteMany({ where: { tourId: saved.id } }),
    prisma.tourIncluded.deleteMany({ where: { tourId: saved.id } }),
    prisma.tourItineraryDay.deleteMany({ where: { tourId: saved.id } }),
    prisma.tourImage.createMany({
      data: [
        { tourId: saved.id, ...imageRow(tour.cover, "cover", 0) },
        ...tour.gallery.map((image, index) => ({
          tourId: saved.id,
          ...imageRow(image, "gallery", index),
        })),
      ],
    }),
    prisma.tourHighlight.createMany({
      data: tour.highlights.map((item, index) => ({
        tourId: saved.id,
        position: index,
        textTr: item.tr,
        textEn: item.en,
      })),
    }),
    prisma.tourIncluded.createMany({
      data: tour.included.map((item, index) => ({
        tourId: saved.id,
        position: index,
        textTr: item.tr,
        textEn: item.en,
      })),
    }),
    prisma.tourItineraryDay.createMany({
      data: tour.itinerary.map((day) => ({
        tourId: saved.id,
        day: day.day,
        titleTr: day.title.tr,
        titleEn: day.title.en,
        descriptionTr: day.description.tr,
        descriptionEn: day.description.en,
      })),
    }),
  ]);

  for (const [index, departsOn] of departureDates(
    DEPARTURES_PER_TOUR,
  ).entries()) {
    const returnsOn = new Date(departsOn);
    returnsOn.setUTCDate(departsOn.getUTCDate() + tour.durationDays - 1);

    const presold = PRESOLD_PATTERN[index % PRESOLD_PATTERN.length] ?? 0;
    const seatsBooked = Math.min(presold, tour.maxGroupSize);

    await prisma.departure.upsert({
      where: { tourId_departsOn: { tourId: saved.id, departsOn } },
      create: {
        tourId: saved.id,
        departsOn,
        returnsOn,
        capacity: tour.maxGroupSize,
        seatsBooked,
        status: "open",
      },
      // Seats are left alone: a re-seed must not wipe availability that real
      // reservations in the database are counting on.
      update: { returnsOn, capacity: tour.maxGroupSize, status: "open" },
    });
  }

  console.log(`  ${tour.slug}`);
}

const summary = {
  tours: await prisma.tour.count(),
  images: await prisma.tourImage.count(),
  itineraryDays: await prisma.tourItineraryDay.count(),
  departures: await prisma.departure.count(),
  reservations: await prisma.reservation.count(),
};
console.log("Done:", JSON.stringify(summary));

await prisma.$disconnect();
