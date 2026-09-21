import type { Locale } from "@/config/i18n";

/** Every internal link goes through here, so a locale is never forgotten. */
export const routes = {
  home: (locale: Locale) => `/${locale}`,
  tours: (locale: Locale) => `/${locale}/tours`,
  toursAnchor: (locale: Locale) => `/${locale}#tours`,
  why: (locale: Locale) => `/${locale}#why`,
  contact: (locale: Locale) => `/${locale}#contact`,
  lookup: (locale: Locale) => `/${locale}/reservations`,
  lookupAnchor: (locale: Locale) => `/${locale}#lookup`,
  tour: (locale: Locale, slug: string) => `/${locale}/tours/${slug}`,
  /** Single-page checkout; `departureId` preselects a date. */
  book: (locale: Locale, slug: string, departureId?: string) =>
    `/${locale}/tours/${slug}/book${departureId ? `?departure=${departureId}` : ""}`,

  // The panel sits under the locale segment like every other page, so the language
  // switcher and the dictionaries keep working inside it.
  admin: (locale: Locale) => `/${locale}/admin`,
  /** `expired` tells the login screen to explain why the visitor landed back there. */
  adminLogin: (locale: Locale, expired = false) =>
    `/${locale}/admin/login${expired ? "?expired=1" : ""}`,
  adminReservations: (locale: Locale, query?: Record<string, string>) => {
    const search = new URLSearchParams(query ?? {}).toString();
    return `/${locale}/admin/reservations${search ? `?${search}` : ""}`;
  },
  adminReservation: (locale: Locale, reference: string) =>
    `/${locale}/admin/reservations/${encodeURIComponent(reference)}`,
};
