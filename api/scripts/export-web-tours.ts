/**
 * Reads the tour catalogue out of the web app's source files and writes it as JSON
 * for the database seed. Run it again whenever ../src/features/tours/data changes:
 *
 *   node --import ./scripts/register-web-alias.mjs scripts/export-web-tours.ts
 *
 * Copying the data by hand would be a transcription bug waiting to happen; this keeps
 * the seed reproducible until the database becomes the source of truth.
 */
import fs from "node:fs/promises";
import path from "node:path";

import { tours } from "@/features/tours/data/tours.ts";
import type { TourEntry } from "@/features/tours/types.ts";

const OUT_FILE = path.join(import.meta.dirname, "..", "prisma", "tours.json");

/** Prices in the web app are whole lira; the database stores minor units. */
function toMinor(amount: number) {
  return Math.round(amount * 100);
}

const payload = (tours as TourEntry[]).map((tour, index) => ({
  slug: tour.slug,
  accent: tour.accent,
  badgeTone: tour.badgeTone ?? null,
  sortOrder: index,
  title: tour.title,
  destination: tour.destination,
  country: tour.country,
  summary: tour.summary,
  description: tour.description,
  badge: tour.badge ?? null,
  durationDays: tour.durationDays,
  durationNights: tour.durationNights,
  maxGroupSize: tour.maxGroupSize,
  rating: tour.rating,
  reviewCount: tour.reviewCount,
  priceMinor: toMinor(tour.price.amount),
  currency: tour.price.currency,
  cover: tour.cover,
  gallery: tour.gallery,
  highlights: tour.highlights,
  included: tour.included,
  itinerary: tour.itinerary,
}));

await fs.writeFile(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

console.log(
  `Exported ${payload.length} tours to ${path.relative(process.cwd(), OUT_FILE)}`,
);
for (const tour of payload) {
  console.log(
    `  ${tour.slug.padEnd(26)} ${tour.itinerary.length} gün, ${tour.gallery.length + 1} görsel, ${tour.priceMinor / 100} ${tour.currency}`,
  );
}
