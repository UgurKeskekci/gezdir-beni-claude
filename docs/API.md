# Gezdir Beni API

A standalone Node.js service in `api/`. The website talks to it over HTTP; there is no
shared code between the two, so **this document is the contract**. When an endpoint
changes here, the frontend types change with it.

- Base URL in development: `http://localhost:4000/api`
- Start it with `npm run dev` inside `api/` (the website runs separately on port 3000)

## Conventions

| Rule          | Detail                                                                                  |
| ------------- | --------------------------------------------------------------------------------------- |
| Success shape | `{ "data": … }`, plus `{ "meta": … }` on paginated lists                                |
| Error shape   | `{ "error": { "code", "message", "details"? } }`                                        |
| Money         | **Minor units** (kuruş). `1890000` is ₺18.900. Never a float, never a formatted string. |
| Dates         | ISO 8601 UTC strings                                                                    |
| Language      | `?locale=tr` (default) or `?locale=en`. The API returns already-translated strings.     |
| Country       | ISO 3166-1 alpha-2, upper case                                                          |

Error codes: `validation_failed`, `bad_request`, `unauthorized`, `not_found`,
`conflict`, `internal_error`.

## Public endpoints

### `GET /health`

Liveness check.

### `GET /tours?locale=tr`

Every published tour, ordered for display. Returns the **summary** shape: no itinerary,
gallery, description or inclusions — those belong to the detail endpoint.

```jsonc
{
  "data": [
    {
      "slug": "kapadokya-balon-rotasi",
      "accent": "sunrise",
      "badgeTone": "bestseller",
      "badge": "En çok satan",
      "title": "Kapadokya Balon Rotası",
      "destination": "Ürgüp",
      "country": "Türkiye",
      "summary": "…",
      "highlights": ["Balon uçuşu dahil", "…"],
      "durationDays": 4,
      "durationNights": 3,
      "maxGroupSize": 10,
      "rating": 4.9,
      "reviewCount": 312,
      "price": { "amountMinor": 1890000, "currency": "TRY" },
      "cover": {
        "url": "/images/tours/…jpg",
        "alt": "…",
        "blurDataURL": "data:image/webp;base64,…",
        "credit": {
          "author": "…",
          "license": "CC BY-SA 3.0",
          "source": "https://commons.wikimedia.org/…",
        },
      },
    },
  ],
}
```

Image URLs are paths into the **website's** `public/` folder, not this API.

### `GET /tours/:slug?locale=tr`

The summary fields plus `description`, `included[]`, `itinerary[]` and `gallery[]`.
`404` when the slug is unknown or unpublished.

### `GET /tours/:slug/departures`

Open, future dates with live availability.

```jsonc
{
  "data": [
    {
      "id": "cmf…",
      "departsOn": "2026-10-01T06:00:00.000Z",
      "returnsOn": "2026-10-04T06:00:00.000Z",
      "capacity": 10,
      "seatsLeft": 8,
      "price": { "amountMinor": 1890000, "currency": "TRY" },
    },
  ],
}
```

`seatsLeft` is derived (`capacity - seatsBooked`), never stored.

### `POST /reservations`

Creates a guest booking. No account is involved.

```jsonc
{
  "departureId": "cmf…",
  "travellers": 2,
  "guest": {
    "fullName": "Elif Kaya",
    "email": "elif@example.com",
    "phone": "+90 555 000 00 00",
    "note": "…",
  },
  "address": {
    "line1": "Bağdat Caddesi 1",
    "line2": "Daire 4",
    "city": "İstanbul",
    "postalCode": "34710",
    "country": "TR",
  },
  "payment": {
    "method": "card",
    "card": {
      "number": "4242 4242 4242 4242",
      "holder": "ELIF KAYA",
      "expiryMonth": 12,
      "expiryYear": 2028,
      "cvc": "123",
    },
  },
}
```

- `payment` is optional. Without it the booking is `pending` / `unpaid`; with a card
  that clears it becomes `confirmed` / `paid`.
- **The total is calculated server side** from the departure's price. A total sent by
  the client is ignored.
- Seats are claimed in a single conditional `UPDATE`, so two people cannot take the
  last seat at the same time. Returns `409` with `details.seatsLeft` when the date is
  full, the departure is closed, or it is in the past.
- `201` on success; the response carries the booking `reference` (`GB-7K3M2Q`).

**Card handling.** There is no payment provider. The number is checked with Luhn and an
expiry test, then discarded — only `cardBrand` and `cardLast4` are stored, and the
number and CVC are never written to the database or the logs. A card whose last four
digits are `0002` always declines, so the failure path can be demonstrated.

### `GET /reservations/:reference?email=…`

Lets a guest find their own booking. **Both** the reference and the e-mail must match,
so a leaked reference on its own reveals nothing. `404` when either is wrong.

## Admin endpoints

One administrator, one password from `ADMIN_PASSWORD`, and a signed `httpOnly` cookie
(`gb_admin`, HMAC-SHA256, expires after `SESSION_TTL_HOURS`). Nothing is stored server
side; replacing this with a user table later only changes what goes into the payload.

Browser calls must use `credentials: "include"`.

| Endpoint                               | Purpose                                                                                                                                        |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /admin/login`                    | `{ "password": "…" }` → sets the cookie. `401` on a wrong password.                                                                            |
| `POST /admin/logout`                   | Clears the cookie.                                                                                                                             |
| `GET /admin/me`                        | `401` unless the session is valid — use it to guard the panel.                                                                                 |
| `GET /admin/stats`                     | Totals per status, paid revenue (minor units), upcoming departures.                                                                            |
| `GET /admin/reservations`              | `?status=pending                                                                                                                               | confirmed | cancelled`, `?q=`(reference, e-mail or name),`?page=`, `?perPage=`. Returns `data`+`meta`. |
| `GET /admin/reservations/:reference`   | One booking.                                                                                                                                   |
| `PATCH /admin/reservations/:reference` | `{ "status": "confirmed" }`. Cancelling **returns the seats**; reinstating re-takes them and fails with `409` if the date has since filled up. |

## Testing

`npm run smoke` in `api/` runs 50 checks against a running server: the catalogue, the
booking path, payment failures, overbooking, guest lookup, the session guard and the
seat accounting. It is the fastest way to tell whether a change broke the contract.
