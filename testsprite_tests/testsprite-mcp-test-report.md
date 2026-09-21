# TestSprite AI Testing Report (MCP)

---

## 1️⃣ Document Metadata

- **Project Name:** claudeforbeginners (Gezdir Beni)
- **Version:** 0.1.0
- **Date:** 2026-09-18
- **Prepared by:** TestSprite AI Team
- **Scope:** Frontend, production build on `localhost:3000`, booking API on `localhost:4000`
- **Focus requested:** checkout validation, placeholders, date/traveller selection, reservation lookup, both languages

---

## 2️⃣ Requirement Validation Summary

### Requirement: Browse the catalogue

Visitors can find tours from the home page and the catalogue page, and open a tour.

- **TC006 — Browse featured tours and open the full catalogue** — ✅ Passed
- **TC008 — Open a tour detail page from browsing** — ✅ Passed
- **TC010 — Review itinerary, gallery and live departures on a tour page** — ✅ Passed
- **TC018 — Mark a tour as favourite while browsing** — ✅ Passed
  The heart toggles. It is session-only by design and never persisted.

### Requirement: Guest checkout

A visitor books without an account, on one page, paying now or holding the seat.

- **TC001 — Complete guest checkout by paying now** — ✅ Passed
- **TC007 — Complete guest checkout by holding the seat** — ✅ Passed
- **TC004 — Start checkout with a selected departure date** — ✅ Passed
- **TC013 — Start booking without preselecting a departure** — ✅ Passed
- **TC005 — Recover an existing reservation (via checkout)** — ❌ Failed, agent ran out of time on the form

  This is the most important result in the run. The agent filled the form with bad
  values (full name "A", e-mail "abc", phone "letters"), submitted, and got one generic
  message in the summary panel: "Some fields are missing or invalid — could you check
  them?". Nothing showed which field was wrong, nothing took focus, and the agent could
  not work out how to proceed. It exhausted its step budget on that screen. A human hits
  the same wall.

### Requirement: Find a booking by reference

The PNR-style lookup, on the home page panel and on its own page.

- **TC011 — Show a not found result for an incorrect lookup** — ✅ Passed
- **TC003 — Recover a booking with matching reference and e-mail** — ⚠️ Blocked
- **TC014 — Retry lookup after no match** — ⚠️ Blocked
- **TC019 — Use the home page lookup panel inline** — ⚠️ Blocked

  All three blocked for the same reason: the site gives a tester, or a visitor, no way
  to obtain a valid reference without completing a booking first, so the success path
  could not be verified.

  TC019 also recorded a real inconsistency. A malformed reference produced "Sorgulama
  yapılamadı. Lütfen tekrar dene." while an unknown but well-formed reference produced
  "Bu numara ve e-posta ile bir rezervasyon bulunamadı.". The first message sends the
  visitor into a retry loop with no hint that the format is the problem. Reproduced by
  hand against the API — see Key Gaps 2.

### Requirement: Language

Turkish and English, switchable without losing your place.

- **TC002 — Open the site in Turkish** — ✅ Passed
- **TC009 — Switch from Turkish to English on the same page** — ✅ Passed
- **TC012 — Switch language in the header while staying on the page** — ✅ Passed

  No Turkish text was reported on English pages, or the reverse.

### Requirement: Navigation

Header, in-page anchors and the mobile menu.

- **TC015 — Jump to a section using the header navigation** — ✅ Passed
- **TC016 — Use the mobile header menu without losing locale** — ⚠️ Blocked
- **TC017 — Open the mobile menu and review the options** — ⚠️ Blocked
- **TC021 — Close the mobile menu with Escape** — ⚠️ Blocked

  All three blocked by a limitation of the test environment, not the product. TestSprite
  renders a fixed desktop viewport and cannot resize it, so the hamburger that appears
  below 768px is never on screen.

### Requirement: Contact

- **TC020 — Open the contact link from a tour page** — ❌ Failed, agent ran out of time

  The agent found "Soru sor" and two mailto anchors but never captured their href and
  looped until its budget ran out. No product defect was demonstrated, though a bare
  mailto is a weak contact affordance — see Key Gaps 5.

---

## 3️⃣ Coverage & Matching Metrics

- 21 tests generated, 13 passed (61.9%), 2 failed, 6 blocked.
- Of the 8 non-passing tests: 1 is a confirmed product defect (TC005), 3 are blocked by
  missing test data that is itself a product gap (TC003, TC014, TC019), 3 are blocked by
  the test tool's fixed viewport (TC016, TC017, TC021), and 1 is inconclusive (TC020).

| Requirement                 | Total | Passed | Blocked | Failed |
| --------------------------- | ----- | ------ | ------- | ------ |
| Browse the catalogue        | 4     | 4      | 0       | 0      |
| Guest checkout              | 5     | 4      | 0       | 1      |
| Find a booking by reference | 4     | 1      | 3       | 0      |
| Language                    | 3     | 3      | 0       | 0      |
| Navigation                  | 4     | 1      | 3       | 0      |
| Contact                     | 1     | 0      | 0       | 1      |
| Total                       | 21    | 13     | 6       | 2      |

---

## 4️⃣ Key Gaps / Risks

**1. Checkout never says which field is wrong. High, confirmed.**
The form is noValidate and defers entirely to the API, so every validation failure
collapses into one sentence in the summary panel. TestSprite's agent became stuck on
this screen and spent its whole budget there; a customer would abandon the booking.
Needs per-field messages, aria-invalid, and focus moved to the first bad field.

**2. A badly formatted reference is reported as a system failure. High, confirmed manually.**
`GET /reservations/ABC123` returns 400, but the lookup only maps 404 to "not found", so
everything else becomes "the lookup failed, try again". The visitor retypes the same
wrong value indefinitely. The 400 case should read as "that does not look like a booking
reference".

**3. No required-field marking, and missing placeholders in checkout. Medium.**
The lookup inputs do have placeholders (GB-7K3M2Q, ornek@eposta.com) and required=true —
the agent confirmed this. Checkout has neither: no asterisks, no "required" text, and
most inputs have no placeholder, so nothing is knowable before submitting.

**4. A lost reference is unrecoverable. Medium.**
Three tests blocked because there is no path to a reference except finishing a booking.
No e-mail is sent and there is no "send me my reference" flow.

**5. Weaker affordances worth revisiting. Low.**

- The hero quick search looks like a search box, filters nothing and gives no feedback.
- Dates and traveller counts are native selects, not a calendar.
- "Soru sor" is a bare mailto, which the agent could not resolve and a visitor without a
  configured mail client cannot either.
- Favourites vanish on reload.

**6. Not covered by this run.**
Mobile layout and the mobile menu (the tool cannot resize the viewport), keyboard tab
order, declined-card recovery, and the sold-out path. These need a viewport-capable
runner or manual checks.

---

## 5. Fixed after the run

Two of the findings above were defects, not tool limitations, and were fixed and
re-verified against a production build on the same URLs the agent used.

### Checkout now validates on the client and points at the broken field

`src/features/reservations/lib/validate-checkout.ts` (new) mirrors the API's zod schema,
so submitting the agent's exact input (name `A`, e-mail `abc`, phone `letters`, country
`TUR`) no longer produces one flat sentence. Reproduced in the browser after the fix:

```
focused:          "fullName"
invalidInputs:    fullName, email, addressLine1, city, postalCode, country, cardHolder
perFieldErrors:   "Ad ve soyadını yaz", "Geçerli bir e-posta yaz, örneğin ad@eposta.com",
                  "Açık adres en az 3 karakter olmalı", "Şehir adı en az 2 karakter olmalı",
                  "Posta kodu en az 3 karakter olmalı",
                  "İki harfli ülke kodu yaz, örneğin TR", "Bu alan zorunlu"
requiredMarkers:  10
```

The first invalid field takes focus and is scrolled into view, each input carries
`aria-invalid` and `aria-describedby`, each message is a `role="alert"`, and an error
clears as soon as the visitor edits that field. Required fields now carry a visible
asterisk plus an `sr-only` "zorunlu" / "required". Fields keep their placeholders.

One gap the fix exposed: the API only checks phone _length_, so `letters` passed. The
client rule now also requires at least six digits — verified: submitting `letters`
returns `Enter a valid phone number` and blocks the request.

Card numbers are checked with Luhn in `src/features/reservations/lib/card.ts` before the
request leaves the browser, so a typo no longer costs a round trip.

### Lookup tells the visitor what is wrong

`reservation-lookup.tsx` now maps the failure instead of collapsing everything into
"try again". Verified:

| input                      | message                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `NOT-A-REF`                | Numara ya da e-posta doğru görünmüyor. Numara GB-XXXXXX biçiminde olmalı.           |
| `GB-ZZZZZZ` + real e-mail  | Bu numara ve e-posta ile bir rezervasyon bulunamadı. İkisini de kontrol eder misin? |
| valid ref + `not-an-email` | Numara ya da e-posta doğru görünmüyor. Numara GB-XXXXXX biçiminde olmalı.           |
| API down                   | Rezervasyon servisine ulaşılamadı. API çalışıyor mu?                                |

### Not fixed

Findings 4, 5 and 6 are unchanged: there is still no way to recover a lost reference, the
hero quick search is still decorative, favourites still vanish on reload, and mobile and
keyboard paths still need a viewport-capable runner.

### Regression check after the fixes

`npm run lint`, `npm run typecheck`, `npm run format:check` and `npm run build` are clean
on the web app; `npm run typecheck` and `npm run smoke` (50 checks) are green in `api/`.
A full booking still completes end to end — reference `GB-HH9PPH`, Confirmed / Paid.
