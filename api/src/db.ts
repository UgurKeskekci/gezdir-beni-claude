import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { env } from "./env.ts";
import { PrismaClient } from "./generated/prisma/client.ts";

/**
 * One client for the whole process. `--watch` reloads the module on every save, so
 * the instance is cached on globalThis to avoid leaking connections in development.
 *
 * Prisma 7 talks to SQLite through a driver adapter rather than a bundled engine.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const adapter = new PrismaBetterSqlite3({ url: env.DATABASE_URL });
  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
