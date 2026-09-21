import { prisma } from "../../db.ts";
import { badRequest, conflict, notFound } from "../../http/errors.ts";
import {
  detectBrand,
  isExpiryValid,
  lastFour,
  normaliseCardNumber,
  passesLuhn,
} from "../../lib/payment.ts";
import { generateReference } from "../../lib/reference.ts";
import type { CreateReservationInput } from "./reservations.schema.ts";

/** Test card that always declines, so the failure path can be exercised. */
const DECLINE_SUFFIX = "0002";

type CardResult = {
  paymentStatus: "paid" | "failed";
  cardBrand: string;
  cardLast4: string;
};

/**
 * Validates a card and reduces it to the two fields worth keeping.
 * The number never leaves this function.
 */
function chargeCard(
  card: NonNullable<CreateReservationInput["payment"]>["card"],
  now: Date,
): CardResult {
  const digits = normaliseCardNumber(card.number);

  if (!passesLuhn(digits)) {
    throw badRequest("Card number is not valid", {
      field: "payment.card.number",
    });
  }
  if (!isExpiryValid(card.expiryMonth, card.expiryYear, now)) {
    throw badRequest("Card has expired", { field: "payment.card.expiryMonth" });
  }

  const brand = detectBrand(digits);
  const last4 = lastFour(digits);

  return {
    paymentStatus: last4 === DECLINE_SUFFIX ? "failed" : "paid",
    cardBrand: brand,
    cardLast4: last4,
  };
}

export function serialiseReservation(reservation: {
  reference: string;
  status: string;
  travellers: number;
  fullName: string;
  email: string;
  phone: string;
  note: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  postalCode: string;
  country: string;
  unitPriceMinor: number;
  totalMinor: number;
  currency: string;
  paymentStatus: string;
  paymentMethod: string | null;
  cardBrand: string | null;
  cardLast4: string | null;
  paidAt: Date | null;
  createdAt: Date;
  departure: { departsOn: Date; returnsOn: Date | null };
  tour: { slug: string; titleTr: string; titleEn: string };
}) {
  return {
    reference: reservation.reference,
    status: reservation.status,
    travellers: reservation.travellers,
    tour: {
      slug: reservation.tour.slug,
      title: { tr: reservation.tour.titleTr, en: reservation.tour.titleEn },
    },
    departure: {
      departsOn: reservation.departure.departsOn.toISOString(),
      returnsOn: reservation.departure.returnsOn?.toISOString() ?? null,
    },
    guest: {
      fullName: reservation.fullName,
      email: reservation.email,
      phone: reservation.phone,
      note: reservation.note ?? undefined,
    },
    address: {
      line1: reservation.addressLine1,
      line2: reservation.addressLine2 ?? undefined,
      city: reservation.city,
      postalCode: reservation.postalCode,
      country: reservation.country,
    },
    price: {
      unitAmountMinor: reservation.unitPriceMinor,
      totalAmountMinor: reservation.totalMinor,
      currency: reservation.currency,
    },
    payment: {
      status: reservation.paymentStatus,
      method: reservation.paymentMethod ?? undefined,
      cardBrand: reservation.cardBrand ?? undefined,
      cardLast4: reservation.cardLast4 ?? undefined,
      paidAt: reservation.paidAt?.toISOString() ?? null,
    },
    createdAt: reservation.createdAt.toISOString(),
  };
}

const reservationInclude = {
  tour: { select: { slug: true, titleTr: true, titleEn: true } },
  departure: { select: { departsOn: true, returnsOn: true } },
} as const;

export async function createReservation(
  input: CreateReservationInput,
  now = new Date(),
) {
  const departure = await prisma.departure.findUnique({
    where: { id: input.departureId },
    include: {
      tour: { select: { id: true, priceMinor: true, currency: true } },
    },
  });

  if (!departure) throw notFound("That departure does not exist");
  if (departure.status !== "open")
    throw conflict("That departure is not open for booking");
  if (departure.departsOn <= now)
    throw conflict("That departure is in the past");

  const seatsLeft = departure.capacity - departure.seatsBooked;
  if (input.travellers > seatsLeft) {
    throw conflict("Not enough seats left on that departure", {
      seatsLeft,
      requested: input.travellers,
    });
  }

  // The price always comes from the server; a client-supplied total is never trusted.
  const unitPriceMinor = departure.priceMinor ?? departure.tour.priceMinor;
  const totalMinor = unitPriceMinor * input.travellers;

  const card = input.payment ? chargeCard(input.payment.card, now) : null;
  const paid = card?.paymentStatus === "paid";

  return prisma.$transaction(async (tx) => {
    // Conditional update: the seat count and the capacity check happen in one
    // statement, so two simultaneous bookings cannot both take the last seat.
    const claimed = await tx.$executeRaw`
      UPDATE "Departure"
      SET "seatsBooked" = "seatsBooked" + ${input.travellers}
      WHERE "id" = ${departure.id}
        AND "status" = 'open'
        AND "seatsBooked" + ${input.travellers} <= "capacity"
    `;

    if (claimed !== 1) {
      throw conflict("Those seats were just taken, please pick another date");
    }

    const created = await tx.reservation.create({
      data: {
        reference: generateReference(),
        status: paid ? "confirmed" : "pending",
        tourId: departure.tour.id,
        departureId: departure.id,
        travellers: input.travellers,
        fullName: input.guest.fullName,
        email: input.guest.email,
        phone: input.guest.phone,
        note: input.guest.note ?? null,
        addressLine1: input.address.line1,
        addressLine2: input.address.line2 ?? null,
        city: input.address.city,
        postalCode: input.address.postalCode,
        country: input.address.country,
        unitPriceMinor,
        totalMinor,
        currency: departure.tour.currency,
        paymentStatus: card?.paymentStatus ?? "unpaid",
        paymentMethod: input.payment ? input.payment.method : null,
        cardBrand: card?.cardBrand ?? null,
        cardLast4: card?.cardLast4 ?? null,
        paidAt: paid ? now : null,
      },
      include: reservationInclude,
    });

    return serialiseReservation(created);
  });
}

/** A guest finds their own booking with the reference plus the e-mail they used. */
export async function findReservation(reference: string, email: string) {
  const reservation = await prisma.reservation.findFirst({
    where: { reference, email: email.toLowerCase() },
    include: reservationInclude,
  });
  return reservation ? serialiseReservation(reservation) : null;
}
