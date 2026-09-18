import type { MetadataRoute } from "next";

import { locales } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { getTourSlugs } from "@/features/tours";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getTourSlugs();
  const paths = ["", ...slugs.map((slug) => `/tours/${slug}`)];

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${siteConfig.url}/${locale}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((item) => [item, `${siteConfig.url}/${item}${path}`]),
        ),
      },
    })),
  );
}
