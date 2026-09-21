import { Router } from "express";
import { z } from "zod";

import { asyncHandler } from "../../http/async-handler.ts";
import { notFound } from "../../http/errors.ts";
import { REFERENCE_PATTERN } from "../../lib/reference.ts";
import {
  createReservationSchema,
  lookupReservationSchema,
} from "./reservations.schema.ts";
import { createReservation, findReservation } from "./reservations.service.ts";

const referenceSchema = z
  .string()
  .transform((value) => value.trim().toUpperCase())
  .refine((value) => REFERENCE_PATTERN.test(value), "Not a booking reference");

export const reservationsRouter = Router();

reservationsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = createReservationSchema.parse(req.body);
    const reservation = await createReservation(input);
    res.status(201).json({ data: reservation });
  }),
);

/**
 * Looking a booking up needs both the reference and the e-mail, so a leaked
 * reference on its own reveals nothing about the guest.
 */
reservationsRouter.get(
  "/:reference",
  asyncHandler(async (req, res) => {
    const reference = referenceSchema.parse(req.params.reference);
    const { email } = lookupReservationSchema.parse(req.query);

    const reservation = await findReservation(reference, email);
    if (!reservation)
      throw notFound("No reservation matches that reference and e-mail");

    res.json({ data: reservation });
  }),
);
