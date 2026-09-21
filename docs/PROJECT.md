# Gezdir Beni — what this project is

A small-group tour operator's website with a working booking flow. A visitor browses
tours, picks a departure date, books a seat as a guest (no account), pays with a
pretend card, and can look the booking up again later with a reference code.

It is a **demo / teaching project**. Every tour, price, review and payment is invented.
No real money moves, no e-mail is sent, and nothing is deployed. The point is a
realistic end-to-end flow, not a live product.

## Two applications

|        | Web                                                                | API                                       |
| ------ | ------------------------------------------------------------------ | ----------------------------------------- |
| Folder | repo root                                                          | `api/`                                    |
| Stack  | Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Motion | Node 24, Express 5, Prisma 7, SQLite, zod |
| Port   | 3000                                                               | 4000                                      |
| Start  | `npm run dev`                                                      | `cd api && npm run dev`                   |

They share no code. The contract between them is written down in
[API.md](API.md); the frontend's own rules are in [ARCHITECTURE.md](ARCHITECTURE.md).

**Both must be running.** With the API down the site still builds and the shell
renders, but every page that lists tours or dates fails.

## Languages

Turkish and English, at `/tr` and `/en`. Turkish is the default: `/` redirects to
`/tr`. The language switcher keeps you on the same page. All interface text lives in
`src/i18n/dictionaries/`; tour content is translated in the database.

## Pages

| Route                                | What it does                                                                                                          |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `/tr`                                | Home: hero with the next real departure, 3 featured tours, how it works, why us, reviews, booking lookup, closing CTA |
| `/tr/tours`                          | All six tours                                                                                                         |
| `/tr/tours/[slug]`                   | One tour: day-by-day plan, gallery, price, and a live list of bookable dates                                          |
| `/tr/tours/[slug]/book`              | **Single-page checkout**                                                                                              |
| `/tr/reservations`                   | Find a booking by reference + e-mail                                                                                  |
| `/tr/admin/login`                    | Admin sign-in — one password, no accounts                                                                             |
| `/tr/admin`                          | Panel overview: counts per status, collected revenue, upcoming departures, latest 5 bookings                          |
| `/tr/admin/reservations`             | All bookings: search by reference, name or e-mail, filter by status, paginated                                        |
| `/tr/admin/reservations/[reference]` | One booking in full, with the status actions                                                                          |

## The journeys that matter

**1. Browse and book.** Home → a tour → pick a date → checkout → confirmation with a
reference like `GB-7K3M2Q`.

**2. Checkout, on one page.** Four blocks in order: trip (date + travellers), contact
(name, e-mail, phone, optional note), billing address (line 1, line 2, city, postcode,
two-letter country), payment. A summary panel on the right shows unit price, traveller
count and a total that updates as you change either.

Payment offers two choices:

- **Pay by card now** → booking becomes `confirmed` / `paid`
- **Just hold my seat** → booking stays `pending` / `unpaid`, and the card fields disappear

**3. Find a booking again.** Reference **and** the e-mail used, from the home page
panel or the dedicated page. Both must match; a reference alone reveals nothing.

**4. Handle it in the panel.** Sign in with the single admin password → the overview
shows where things stand → open the list, search or filter → open one booking → confirm
it, put it back to pending, or cancel it. Cancelling asks first, and returns the seats to
the departure; undoing a cancellation re-takes them and is refused if the date filled up
in the meantime. The panel lives under the locale segment like every other page, so it
speaks both languages.

## Rules the code enforces

- **Seats cannot be oversold.** The seat count and the capacity check happen in one
  conditional SQL `UPDATE`, so two people cannot take the last seat at once. A full
  date returns 409 with how many seats are actually left.
- **The price is never trusted from the browser.** The API recalculates the total from
  the departure's own price.
- **Card numbers and CVC are never stored or logged.** They are validated (Luhn +
  expiry) and discarded; only the brand and last four digits survive.
- **Money travels in minor units** (kuruş): `1890000` is ₺18.900. One helper formats it.
- **Seat counts are never cached.** Catalogue text is cached for 60 seconds.

## Data model

`Tour` → `Departure` (a date with capacity and seats booked) → `Reservation`
(a guest booking). Tours also own their images, highlights, inclusions and itinerary
days. Six tours, six dates each, all generated from the first of next month.

## Deliberately fake

- Tours, prices, ratings, review counts and traveller reviews
- Contact details (`merhaba@gezdirbeni.example`)
- Hero statistics (48 routes, 12K+ travellers, 4.9 rating)
- The payment step: card `4242 4242 4242 4242` always succeeds, **any card ending in
  `0002` always declines**, and the checkout is pre-filled with the test card
- Photography is real, from Wikimedia Commons, and carries its CC attribution

## Not built yet

- The panel can read everything and change a booking's status, but it cannot yet edit
  guest details, add tours or open new departures. Those are still seed-and-database work.
- No account system, no password reset, no order history beyond the reference lookup.
- No e-mail. The confirmation screen never claims one was sent.
- No real payment provider.

## What is worth testing

The areas most likely to hurt a real customer:

1. **Checkout validation.** Submitting empty or half-filled forms; what the visitor is
   told, and whether the message points at the field that is wrong. Invalid e-mail,
   a one-character name, a three-letter country code, a postcode of `1`.
2. **Payment errors.** A declined card (`4000 0000 0000 0002`), a card that fails the
   checksum, an expired date — does the page recover, and can the visitor try again?
3. **Date and traveller selection.** Whether dates are picked from a list or typed by
   hand, whether the traveller count is capped by the seats actually left, and whether
   changing the date resets a now-impossible traveller count.
4. **Placeholders and labels.** Whether every field says what it wants, in the page's
   language, and whether required fields are marked as such.
5. **The booking lookup.** A wrong reference, a wrong e-mail, an empty form, and
   whether the error tells the visitor which one was wrong without leaking data.
6. **Sold-out paths.** Booking more seats than remain; a date that fills up between
   opening the page and submitting.
7. **Both languages.** Every screen in `/en` as well as `/tr`, with no Turkish text
   leaking into English or vice versa.
8. **Keyboard and screen sizes.** Tab order through checkout, visible focus, and the
   whole flow at 360px wide.

## Known rough edges

Honest starting points rather than surprises:

- The hero's "quick search" (destination / date / travellers) is **decorative**. It
  scrolls to the tours section and filters nothing. It looks like a real search box.
- The traveller count and the date are `<select>` elements, not a calendar.
- The favourite (heart) on a tour card is per-session only and is never saved.
- Checkout relies on the API for validation; there is little inline field-level
  feedback before submitting.
- The card fields come pre-filled with a test number, which is convenient for a demo
  and confusing if you expect an empty form.

## Commands

```bash
npm run dev            # site on :3000
cd api && npm run dev  # API on :4000

npm run lint && npm run typecheck && npm run build   # site checks
cd api && npm run typecheck && npm run smoke         # API checks, 50 assertions

cd api && npm run db:studio   # browse the database
cd api && npm run db:reset && npm run db:seed        # fresh data
```
