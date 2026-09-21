import { z } from "zod";

/**
 * The only place that reads process.env.
 * NEXT_PUBLIC_* vars must be referenced literally so Next.js can inline them.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  /** Base URL of the booking API in api/ — see docs/API.md. */
  NEXT_PUBLIC_API_URL: z.url().default("http://localhost:4000/api"),
});

export const env = clientSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || undefined,
});
