import { Router } from "express";
import { z } from "zod";

import { asyncHandler } from "../../http/async-handler.ts";
import { notFound, unauthorized } from "../../http/errors.ts";
import {
  createSessionToken,
  isAdminPassword,
  requireAdmin,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "../../http/session.ts";
import { REFERENCE_PATTERN } from "../../lib/reference.ts";
import {
  getReservation,
  getStats,
  listReservations,
  RESERVATION_STATUSES,
  updateReservationStatus,
} from "./admin.service.ts";

const loginSchema = z.object({ password: z.string().min(1).max(200) });

const listQuerySchema = z.object({
  status: z.enum(RESERVATION_STATUSES).optional(),
  q: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

const statusSchema = z.object({ status: z.enum(RESERVATION_STATUSES) });

const referenceSchema = z
  .string()
  .transform((value) => value.trim().toUpperCase())
  .refine((value) => REFERENCE_PATTERN.test(value), "Not a booking reference");

export const adminRouter = Router();

adminRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { password } = loginSchema.parse(req.body);

    if (!isAdminPassword(password)) {
      throw unauthorized("Wrong password");
    }

    res.cookie(SESSION_COOKIE, createSessionToken(), sessionCookieOptions());
    res.json({ data: { authenticated: true } });
  }),
);

adminRouter.post("/logout", (_req, res) => {
  res.clearCookie(SESSION_COOKIE, {
    ...sessionCookieOptions(),
    maxAge: undefined,
  });
  res.json({ data: { authenticated: false } });
});

// Everything below needs a valid session.
adminRouter.use(requireAdmin);

adminRouter.get("/me", (_req, res) => {
  res.json({ data: { authenticated: true } });
});

adminRouter.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    res.json({ data: await getStats() });
  }),
);

adminRouter.get(
  "/reservations",
  asyncHandler(async (req, res) => {
    const { status, q, page, perPage } = listQuerySchema.parse(req.query);
    // Mapped field by field on purpose: the query parameter is named "q" while the
    // service argument is named "query"; spreading the parsed object instead would
    // silently drop the search term.
    res.json(await listReservations({ status, query: q, page, perPage }));
  }),
);

adminRouter.get(
  "/reservations/:reference",
  asyncHandler(async (req, res) => {
    const reference = referenceSchema.parse(req.params.reference);
    const reservation = await getReservation(reference);
    if (!reservation) throw notFound("No reservation with that reference");
    res.json({ data: reservation });
  }),
);

adminRouter.patch(
  "/reservations/:reference",
  asyncHandler(async (req, res) => {
    const reference = referenceSchema.parse(req.params.reference);
    const { status } = statusSchema.parse(req.body);
    res.json({ data: await updateReservationStatus(reference, status) });
  }),
);
