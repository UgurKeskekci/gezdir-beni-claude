import type { Locale } from "@/config/i18n";

const LOCALE_TAGS: Record<Locale, string> = { tr: "tr-TR", en: "en-GB" };

/**
 * The API sends money in minor units (kuruş); this is the only place that divides.
 * Fractions are dropped because every price in the catalogue is a whole lira.
 */
export function formatPrice(
  amountMinor: number,
  currency: string,
  locale: Locale,
): string {
  return new Intl.NumberFormat(LOCALE_TAGS[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100);
}

/** `decimals` pins the fraction digits, which keeps counters from jittering. */
export function formatNumber(
  value: number,
  locale: Locale,
  decimals?: number,
): string {
  return new Intl.NumberFormat(
    LOCALE_TAGS[locale],
    decimals === undefined
      ? {}
      : { minimumFractionDigits: decimals, maximumFractionDigits: decimals },
  ).format(value);
}

/** "12 Ekim 2026" / "12 October 2026" — used for departure dates. */
export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

/** "12 Eki" / "12 Oct" — the compact form for cards and chips. */
export function formatDateShort(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(iso));
}
