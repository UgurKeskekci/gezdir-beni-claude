import { prisma } from "../../db.ts";
import { conflict, notFound } from "../../http/errors.ts";
import { serialiseReservation } from "../reservations/reservations.service.ts";

export const RESERVATION_STATUSES = [
  "pending",
  "confirmed",
  "cancelled",
] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

const listInclude = {
  tour: { select: { slug: true, titleTr: true, titleEn: true } },
  departure: { select: { departsOn: true, returnsOn: true } },
} as const;

export async function listReservations(options: {
  status?: ReservationStatus;
  query?: string;
  page: number;
  perPage: number;
}) {
  const where = {
    ...(options.status ? { status: options.status } : {}),
    ...(options.query
      ? {
          OR: [
            { reference: { contains: options.query } },
            { email: { contains: options.query } },
            { fullName: { contains: options.query } },
          ],
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.reservation.count({ where }),
    prisma.reservation.findMany({
      where,
      include: listInclude,
      orderBy: { createdAt: "desc" },
      skip: (options.page - 1) * options.perPage,
      take: options.perPage,
    }),
  ]);

  return {
    data: rows.map(serialiseReservation),
    meta: {
      total,
      page: options.page,
      perPage: options.perPage,
      pageCount: Math.max(1, Math.ceil(total / options.perPage)),
    },
  };
}

export async function getReservation(reference: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { reference },
    include: listInclude,
  });
  return reservation ? serialiseReservation(reservation) : null;
}

/**
 * Changing the status is the one write the panel needs today. Cancelling gives the
 * seats back inside the same transaction, so availability can never drift.
 */
export async function updateReservationStatus(
  reference: string,
  nextStatus: ReservationStatus,
  now = new Date(),
) {
  const current = await prisma.reservation.findUnique({
    where: { reference },
    select: {
      id: true,
      status: true,
      travellers: true,
      departureId: true,
    },
  });
  if (!current) throw notFound("No reservation with that reference");
  if (current.status === nextStatus) {
    throw conflict(`Reservation is already ${nextStatus}`);
  }

  return prisma.$transaction(async (tx) => {
    if (nextStatus === "cancelled") {
      await tx.$executeRaw`
        UPDATE "Departure"
        SET "seatsBooked" = MAX("seatsBooked" - ${current.travellers}, 0)
        WHERE "id" = ${current.departureId}
      `;
    } else if (current.status === "cancelled") {
      // Reinstating a cancelled booking has to re-take the seats, and only if they
      // are still there.
      const claimed = await tx.$executeRaw`
        UPDATE "Departure"
        SET "seatsBooked" = "seatsBooked" + ${current.travellers}
        WHERE "id" = ${current.departureId}
          AND "seatsBooked" + ${current.travellers} <= "capacity"
      `;
      if (claimed !== 1) {
        throw conflict(
          "The departure is full, this booking cannot be reinstated",
        );
      }
    }

    const updated = await tx.reservation.update({
      where: { id: current.id },
      data: {
        status: nextStatus,
        cancelledAt: nextStatus === "cancelled" ? now : null,
      },
      include: listInclude,
    });

    return serialiseReservation(updated);
  });
}

export async function getStats() {
  const [byStatus, revenue, upcoming, total] = await Promise.all([
    prisma.reservation.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.reservation.aggregate({
      where: { paymentStatus: "paid", status: { not: "cancelled" } },
      _sum: { totalMinor: true },
    }),
    prisma.departure.count({
      where: { status: "open", departsOn: { gt: new Date() } },
    }),
    prisma.reservation.count(),
  ]);

  const counts = Object.fromEntries(
    RESERVATION_STATUSES.map((status) => [
      status,
      byStatus.find((row) => row.status === status)?._count._all ?? 0,
    ]),
  );

  return {
    reservations: { total, ...counts },
    paidRevenueMinor: revenue._sum.totalMinor ?? 0,
    upcomingDepartures: upcoming,
  };
}
