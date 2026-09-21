import { z } from "zod";

/**
 * The only place that reads process.env. Fails loudly at boot instead of handing
 * an undefined secret to the session signer at the first login attempt.
 */
const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  /** Origin allowed to call this API with credentials. */
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
  /** Single admin password — see docs/API.md for why there is no user table yet. */
  ADMIN_PASSWORD: z
    .string()
    .min(8, "ADMIN_PASSWORD must be at least 8 characters"),
  /** Used to sign the admin session cookie. */
  SESSION_SECRET: z
    .string()
    .min(32, "SESSION_SECRET must be at least 32 characters"),
  /** How long an admin session stays valid. */
  SESSION_TTL_HOURS: z.coerce.number().int().positive().default(12),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  console.error(
    `Invalid environment configuration:\n${details}\n\nCopy .env.example to .env and fill it in.`,
  );
  process.exit(1);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === "production";
