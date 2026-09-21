import { prisma } from "../../db.ts";
import type { Locale } from "../../lib/locale.ts";
import { toTourDetail, toTourSummary } from "./tours.mapper.ts";

const summaryInclude = {
  images: { where: { role: "cover" } },
  highlights: true,
} as const;

const detailInclude = {
  images: true,
  highlights: true,
  included: true,
  itinerary: true,
} as const;

export async function listTours(locale: Locale) {
  const tours = await prisma.tour.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    include: summaryInclude,
  });
  return tours.map((tour) => toTourSummary(locale, tour));
}

export async function getTourBySlug(slug: string, locale: Locale) {
  const tour = await prisma.tour.findFirst({
    where: { slug, isPublished: true },
    include: detailInclude,
  });
  return tour ? toTourDetail(locale, tour) : null;
}

/**
 * Open, future departures with their remaining seats. `seatsLeft` is what the booking
 * form and the "son 3 kişi" badge read; it is never stored, only derived.
 */
export async function listDepartures(slug: string, now = new Date()) {
  const tour = await prisma.tour.findFirst({
    where: { slug, isPublished: true },
    select: { id: true, priceMinor: true, currency: true },
  });
  if (!tour) return null;

  const departures = await prisma.departure.findMany({
    where: { tourId: tour.id, status: "open", departsOn: { gt: now } },
    orderBy: { departsOn: "asc" },
  });

  return departures.map((departure) => ({
    id: departure.id,
    departsOn: departure.departsOn.toISOString(),
    returnsOn: departure.returnsOn?.toISOString() ?? null,
    capacity: departure.capacity,
    seatsLeft: Math.max(0, departure.capacity - departure.seatsBooked),
    price: {
      amountMinor: departure.priceMinor ?? tour.priceMinor,
      currency: tour.currency,
    },
  }));
}
