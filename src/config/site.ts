import { env } from "@/config/env";

export const siteConfig = {
  name: "Gezdir Beni",
  url: env.NEXT_PUBLIC_SITE_URL,
  /**
   * Every price in the catalogue carries its own currency. This is the fallback for
   * the one place that has none: `GET /admin/stats` totals the revenue as a bare
   * number in minor units.
   */
  currency: "TRY",
  /** Demo contact details — replace before going live. */
  contact: {
    email: "merhaba@gezdirbeni.example",
    phone: "+90 212 000 00 00",
  },
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ],
};
