import { z } from "zod";

/**
 * The only place that reads process.env.
 * NEXT_PUBLIC_* vars must be referenced literally so Next.js can inline them.
 * When a backend arrives, add a separate server schema here (non-public vars).
 */
const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.url().optional(),
});

export const env = clientSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || undefined,
});
