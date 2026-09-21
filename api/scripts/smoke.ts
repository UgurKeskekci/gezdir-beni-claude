/**
 * End-to-end check against a running API:  npm run smoke
 *
 * Covers the booking path the website depends on, including the cases that are easy
 * to get wrong: overbooking, server-side pricing, card data retention and the admin
 * session guard. Exits non-zero on the first failed expectation.
 */
const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:4000/api";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "gezdirbeni-admin";

let passed = 0;
const failures: string[] = [];

function check(label: string, condition: boolean, detail?: unknown) {
  if (condition) {
    passed += 1;
    console.log(`  PASS  ${label}`);
  } else {
    failures.push(label);
    console.log(
      `  FAIL  ${label}${detail === undefined ? "" : ` → ${JSON.stringify(detail)}`}`,
    );
  }
}

type Json = Record<string, any>;

async function call(
  path: string,
  init: RequestInit & { cookie?: string } = {},
): Promise<{ status: number; body: Json; setCookie: string | null }> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set("content-type", "application/json");
  if (init.cookie) headers.set("cookie", init.cookie);

  const response = await fetch(`${BASE}${path}`, { ...init, headers });
  const text = await response.text();
  return {
    status: response.status,
    body: text ? JSON.parse(text) : {},
    setCookie: response.headers.get("set-cookie"),
  };
}

function guest(overrides: Json = {}) {
  return {
    guest: {
      fullName: "Elif Kaya",
      email: "elif@example.com",
      phone: "+90 555 000 00 00",
      ...overrides.guest,
    },
    address: {
      line1: "Bağdat Caddesi 1",
      city: "İstanbul",
      postalCode: "34710",
      country: "tr",
      ...overrides.address,
    },
  };
}

const VALID_CARD = {
  number: "4242 4242 4242 4242",
  holder: "ELIF KAYA",
  expiryMonth: 12,
  expiryYear: new Date().getFullYear() + 2,
  cvc: "123",
};

console.log("\n1. Katalog");
const health = await call("/health");
check("health 200", health.status === 200, health.body);

const tours = await call("/tours?locale=tr");
check(
  "tur listesi doluyor",
  tours.status === 200 && tours.body.data.length === 6,
);
check(
  "liste hafif (itinerary yok)",
  tours.body.data[0]?.itinerary === undefined,
);
check(
  "fiyat minor birimde",
  Number.isInteger(tours.body.data[0]?.price?.amountMinor) &&
    tours.body.data[0].price.amountMinor > 10000,
  tours.body.data[0]?.price,
);

const slug = tours.body.data[0].slug as string;
const detail = await call(`/tours/${slug}?locale=en`);
check(
  "detay tam (itinerary + galeri + dahil)",
  detail.body.data.itinerary.length > 0 &&
    detail.body.data.included.length > 0 &&
    detail.body.data.cover.credit.author.length > 0,
);
check(
  "ingilizce ceviri geliyor",
  /^[\x20-\x7E]+$/.test(detail.body.data.title),
);

const departures = await call(`/tours/${slug}/departures`);
check("kalkis listesi var", departures.body.data.length > 0);
check(
  "kalkislar gelecekte",
  departures.body.data.every((d: Json) => new Date(d.departsOn) > new Date()),
);

console.log("\n2. Rezervasyon — ödemesiz");
// This run books 4 seats on one departure (2 + 1 paid + 1 declined) and then expects
// the card-validation cases to reach the card check. The seat check runs first, so the
// date needs headroom or those cases come back 409 instead of 400. Pick the emptiest
// departure and demand a margin, otherwise the run is state-dependent and flaky.
const SEATS_NEEDED = 6;
const open = [...departures.body.data].sort(
  (a: Json, b: Json) => b.seatsLeft - a.seatsLeft,
)[0];
check(
  `uygun kalkis bulundu (>= ${SEATS_NEEDED} yer)`,
  Boolean(open) && open.seatsLeft >= SEATS_NEEDED,
  open
    ? { seatsLeft: open.seatsLeft, hint: "npm run db:reset && npm run db:seed" }
    : departures.body.data,
);
if (!open || open.seatsLeft < SEATS_NEEDED) {
  console.log(
    "Yeterli bos koltuk yok. Once veritabanini tazele: npm run db:reset && npm run db:seed",
  );
  process.exit(1);
}

const seatsBefore = open.seatsLeft as number;
const pending = await call("/reservations", {
  method: "POST",
  body: JSON.stringify({ departureId: open.id, travellers: 2, ...guest() }),
});
check("201 dondu", pending.status === 201, pending.body);
check("durum pending", pending.body.data?.status === "pending");
check("odeme unpaid", pending.body.data?.payment?.status === "unpaid");
check(
  "toplam = birim x kisi",
  pending.body.data?.price.totalAmountMinor ===
    pending.body.data?.price.unitAmountMinor * 2,
  pending.body.data?.price,
);
check(
  "referans formati GB-XXXXXX",
  /^GB-[234679ACDEFGHJKMNPQRTUVWXYZ]{6}$/.test(
    pending.body.data?.reference ?? "",
  ),
  pending.body.data?.reference,
);
check(
  "eposta kucuk harfe indi",
  pending.body.data?.guest.email === "elif@example.com",
);
check("ulke kodu buyuk harf", pending.body.data?.address.country === "TR");

const afterTwo = await call(`/tours/${slug}/departures`);
const openAfter = afterTwo.body.data.find((d: Json) => d.id === open.id);
check("koltuk sayisi 2 azaldi", openAfter.seatsLeft === seatsBefore - 2, {
  before: seatsBefore,
  after: openAfter.seatsLeft,
});

console.log("\n3. Rezervasyon — ödemeli");
const paid = await call("/reservations", {
  method: "POST",
  body: JSON.stringify({
    departureId: open.id,
    travellers: 1,
    ...guest(),
    payment: { method: "card", card: VALID_CARD },
  }),
});
check("odeme ile confirmed", paid.body.data?.status === "confirmed", paid.body);
check("odeme paid", paid.body.data?.payment.status === "paid");
check("marka tespit edildi", paid.body.data?.payment.cardBrand === "visa");
check("son 4 hane saklandi", paid.body.data?.payment.cardLast4 === "4242");
check(
  "kart numarasi yanitta yok",
  !JSON.stringify(paid.body).includes("4242424242424242") &&
    !JSON.stringify(paid.body).includes("123456"),
);
check(
  "cvc yanitta yok",
  !JSON.stringify(paid.body).toLowerCase().includes("cvc"),
);

console.log("\n4. Ödeme hataları");
const declined = await call("/reservations", {
  method: "POST",
  body: JSON.stringify({
    departureId: open.id,
    travellers: 1,
    ...guest(),
    payment: {
      method: "card",
      card: { ...VALID_CARD, number: "4000000000000002" },
    },
  }),
});
check(
  "reddedilen kart failed",
  declined.body.data?.payment.status === "failed",
  declined.body,
);
check("reddedilince pending kalir", declined.body.data?.status === "pending");

const badCard = await call("/reservations", {
  method: "POST",
  body: JSON.stringify({
    departureId: open.id,
    travellers: 1,
    ...guest(),
    payment: {
      method: "card",
      card: { ...VALID_CARD, number: "4242424242424241" },
    },
  }),
});
check("gecersiz kart 400", badCard.status === 400, badCard.body);

const expired = await call("/reservations", {
  method: "POST",
  body: JSON.stringify({
    departureId: open.id,
    travellers: 1,
    ...guest(),
    payment: {
      method: "card",
      card: { ...VALID_CARD, expiryMonth: 1, expiryYear: 2020 },
    },
  }),
});
check("suresi gecmis kart 400", expired.status === 400, expired.body);

console.log("\n5. Doğrulama ve aşırı rezervasyon");
const invalid = await call("/reservations", {
  method: "POST",
  body: JSON.stringify({
    departureId: open.id,
    travellers: 0,
    guest: {},
    address: {},
  }),
});
check("eksik alanlar 400", invalid.status === 400);
check("hata detaylari var", Array.isArray(invalid.body.error?.details));

const tooMany = await call("/reservations", {
  method: "POST",
  body: JSON.stringify({ departureId: open.id, travellers: 20, ...guest() }),
});
check("kapasiteyi asan istek 409", tooMany.status === 409, tooMany.body);
check(
  "kalan koltuk bilgisi donuyor",
  typeof tooMany.body.error?.details?.seatsLeft === "number",
);

const ghost = await call("/reservations", {
  method: "POST",
  body: JSON.stringify({
    departureId: "yok-boyle-kalkis",
    travellers: 1,
    ...guest(),
  }),
});
check("olmayan kalkis 404", ghost.status === 404);

console.log("\n6. Misafir rezervasyonunu bulma");
const reference = pending.body.data.reference as string;
const found = await call(`/reservations/${reference}?email=elif@example.com`);
check(
  "dogru eposta ile bulunuyor",
  found.status === 200 && found.body.data.reference === reference,
);

const wrongEmail = await call(
  `/reservations/${reference}?email=baskasi@example.com`,
);
check("yanlis eposta 404", wrongEmail.status === 404);

const noEmail = await call(`/reservations/${reference}`);
check("epostasiz istek 400", noEmail.status === 400);

console.log("\n7. Admin oturumu");
const noSession = await call("/admin/reservations");
check("oturumsuz 401", noSession.status === 401, noSession.body);

const wrongPassword = await call("/admin/login", {
  method: "POST",
  body: JSON.stringify({ password: "yanlis-sifre" }),
});
check("yanlis sifre 401", wrongPassword.status === 401);

const login = await call("/admin/login", {
  method: "POST",
  body: JSON.stringify({ password: ADMIN_PASSWORD }),
});
check("dogru sifre 200", login.status === 200, login.body);
check(
  "cerez httpOnly",
  (login.setCookie ?? "").toLowerCase().includes("httponly"),
);
check(
  "cerez sameSite=Lax",
  (login.setCookie ?? "").toLowerCase().includes("samesite=lax"),
);

const cookie = (login.setCookie ?? "").split(";")[0] ?? "";
const forged = cookie.replace(/.$/, (c) => (c === "0" ? "1" : "0"));

const withForged = await call("/admin/reservations", { cookie: forged });
check("kurcalanmis cerez 401", withForged.status === 401);

console.log("\n8. Admin uçları");
const list = await call("/admin/reservations", { cookie });
check(
  "liste geliyor",
  list.status === 200 && list.body.data.length > 0,
  list.body,
);
check("sayfalama bilgisi var", typeof list.body.meta?.total === "number");

const filtered = await call("/admin/reservations?status=confirmed", { cookie });
check(
  "duruma gore filtre",
  filtered.body.data.every((r: Json) => r.status === "confirmed"),
);

const searched = await call(`/admin/reservations?q=${reference}`, { cookie });
check("referansa gore arama", searched.body.data.length === 1);

const stats = await call("/admin/stats", { cookie });
check(
  "istatistikler",
  stats.body.data?.reservations.total > 0 &&
    stats.body.data.paidRevenueMinor > 0,
  stats.body,
);

console.log("\n9. Durum değişikliği koltukları geri veriyor");
const beforeCancel = await call(`/tours/${slug}/departures`);
const seatsNow = beforeCancel.body.data.find(
  (d: Json) => d.id === open.id,
).seatsLeft;

const cancelled = await call(`/admin/reservations/${reference}`, {
  method: "PATCH",
  cookie,
  body: JSON.stringify({ status: "cancelled" }),
});
check(
  "iptal 200",
  cancelled.status === 200 && cancelled.body.data.status === "cancelled",
  cancelled.body,
);

const afterCancel = await call(`/tours/${slug}/departures`);
const seatsBack = afterCancel.body.data.find(
  (d: Json) => d.id === open.id,
).seatsLeft;
check("2 koltuk geri geldi", seatsBack === seatsNow + 2, {
  seatsNow,
  seatsBack,
});

const repeat = await call(`/admin/reservations/${reference}`, {
  method: "PATCH",
  cookie,
  body: JSON.stringify({ status: "cancelled" }),
});
check("ayni duruma tekrar 409", repeat.status === 409);

const logout = await call("/admin/logout", { method: "POST", cookie });
check("cikis 200", logout.status === 200);

console.log(
  `\n${failures.length === 0 ? "TÜMÜ GEÇTİ" : "BAŞARISIZ"} — ${passed} geçti, ${failures.length} kaldı`,
);
if (failures.length > 0) {
  console.log(failures.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}
