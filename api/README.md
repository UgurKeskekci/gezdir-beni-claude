# Gezdir Beni API

Booking backend for the Gezdir Beni site. Standalone Node.js service — the website in
the folder above talks to it over HTTP and shares no code with it.

**The endpoint contract lives in [`../docs/API.md`](../docs/API.md).**

## Stack

- **Node 24** running TypeScript directly (type stripping), so there is no build step
- **Express 5** with **zod** validation at every edge
- **Prisma 7** over **SQLite** through the `better-sqlite3` driver adapter
- Admin auth: one password, HMAC-signed `httpOnly` cookie

## Setup

```bash
npm install
cp .env.example .env     # then fill in ADMIN_PASSWORD and SESSION_SECRET
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Generate a session secret with:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

## Scripts

| Command             | What it does                                                   |
| ------------------- | -------------------------------------------------------------- |
| `npm run dev`       | Watches and restarts on save                                   |
| `npm run typecheck` | `tsc --noEmit`                                                 |
| `npm run smoke`     | 50 end-to-end checks against a running server                  |
| `npm run db:seed`   | Loads the catalogue and generates departure dates (idempotent) |
| `npm run db:studio` | Prisma Studio — browse the data in a GUI                       |
| `npm run db:reset`  | Drops and rebuilds the database                                |

## Where the tour data comes from

The catalogue is seeded from `prisma/tours.json`, which is exported from the website's
own source files so nothing is transcribed by hand:

```bash
node --import ./scripts/register-web-alias.mjs scripts/export-web-tours.ts
npm run db:seed
```

Re-run both whenever `../src/features/tours/data/` changes. Once the admin panel can
edit tours, the database becomes the source of truth and this step retires.

## Things worth knowing

- **Money is in minor units** (kuruş) everywhere: database, API and totals.
- **Card numbers and CVC are never stored or logged.** Only the brand and last four
  digits survive a booking. A card ending in `0002` always declines, on purpose.
- **Seats cannot be oversold**: the seat count and capacity check happen in one
  conditional `UPDATE`, and cancelling a booking gives the seats back.
- `dev.db`, `.env` and the generated Prisma client are git-ignored. After cloning, run
  `npx prisma generate` before starting.
