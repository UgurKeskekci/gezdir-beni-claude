import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { env } from "./env.ts";
import { errorHandler, notFoundHandler } from "./http/errors.ts";
import { adminRouter } from "./modules/admin/admin.routes.ts";
import { reservationsRouter } from "./modules/reservations/reservations.routes.ts";
import { toursRouter } from "./modules/tours/tours.routes.ts";

export function createApp() {
  const app = express();

  // Behind a proxy in production, req.secure must reflect the original request.
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(
    cors({
      // A single known origin, because the admin session cookie travels with
      // credentials and "*" is not allowed in that case.
      origin: env.WEB_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    res.json({ data: { status: "ok", now: new Date().toISOString() } });
  });

  app.use("/api/tours", toursRouter);
  app.use("/api/reservations", reservationsRouter);
  app.use("/api/admin", adminRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
