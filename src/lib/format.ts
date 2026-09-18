import type { Locale } from "@/config/i18n";

const LOCALE_TAGS: Record<Locale, string> = { tr: "tr-TR", en: "en-GB" };

export function formatPrice(
  amount: number,
  currency: string,
  locale: Locale,
): string {
  return new Intl.NumberFormat(LOCALE_TAGS[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
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
