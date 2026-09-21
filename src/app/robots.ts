import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // The panel holds guest names and addresses; it has no business in an index.
    rules: { userAgent: "*", allow: "/", disallow: "/*/admin" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
