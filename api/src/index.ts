import { createApp } from "./app.ts";
import { prisma } from "./db.ts";
import { env } from "./env.ts";

const app = createApp();
const server = app.listen(env.PORT, () => {
  console.log(
    `Gezdir Beni API listening on http://localhost:${env.PORT}/api (${env.NODE_ENV})`,
  );
  console.log(`CORS origin: ${env.WEB_ORIGIN}`);
});

async function shutdown(signal: string) {
  console.log(`\n${signal} received, shutting down…`);
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
