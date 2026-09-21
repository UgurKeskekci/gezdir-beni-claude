import { z } from "zod";

export const LOCALES = ["tr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "tr";

export const localeSchema = z.enum(LOCALES).default(DEFAULT_LOCALE);

/** Picks the right column out of a `…Tr` / `…En` pair. */
export function pick(
  locale: Locale,
  values: { tr: string; en: string },
): string {
  return locale === "en" ? values.en : values.tr;
}

export function pickOptional(
  locale: Locale,
  values: { tr: string | null; en: string | null },
): string | undefined {
  const value = locale === "en" ? values.en : values.tr;
  return value ?? undefined;
}
