import type { Locale } from "@/config/i18n";

/** Every internal link goes through here, so a locale is never forgotten. */
export const routes = {
  home: (locale: Locale) => `/${locale}`,
  tours: (locale: Locale) => `/${locale}/tours`,
  toursAnchor: (locale: Locale) => `/${locale}#tours`,
  why: (locale: Locale) => `/${locale}#why`,
  contact: (locale: Locale) => `/${locale}#contact`,
  tour: (locale: Locale, slug: string) => `/${locale}/tours/${slug}`,
};
