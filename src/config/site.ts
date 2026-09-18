import { env } from "@/config/env";

export const siteConfig = {
  name: "Gezdir Beni",
  url: env.NEXT_PUBLIC_SITE_URL,
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
