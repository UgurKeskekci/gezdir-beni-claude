import { Router } from "express";
import { z } from "zod";

import { asyncHandler } from "../../http/async-handler.ts";
import { notFound } from "../../http/errors.ts";
import { localeSchema } from "../../lib/locale.ts";
import { getTourBySlug, listDepartures, listTours } from "./tours.service.ts";

const querySchema = z.object({ locale: localeSchema });
const slugSchema = z.string().min(1).max(120);

export const toursRouter = Router();

toursRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { locale } = querySchema.parse(req.query);
    res.json({ data: await listTours(locale) });
  }),
);

toursRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const { locale } = querySchema.parse(req.query);
    const slug = slugSchema.parse(req.params.slug);

    const tour = await getTourBySlug(slug, locale);
    if (!tour) throw notFound(`No tour with slug "${slug}"`);

    res.json({ data: tour });
  }),
);

toursRouter.get(
  "/:slug/departures",
  asyncHandler(async (req, res) => {
    const slug = slugSchema.parse(req.params.slug);

    const departures = await listDepartures(slug);
    if (departures === null) throw notFound(`No tour with slug "${slug}"`);

    res.json({ data: departures });
  }),
);
