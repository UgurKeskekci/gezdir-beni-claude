import type { NextConfig } from "next";

import { env } from "./src/config/env";

const nextConfig: NextConfig = {
  // The browser talks to the booking API through this same-origin path, so the admin
  // session cookie is first-party even when the API is hosted on another domain.
  // Server-side fetches skip the hop and call NEXT_PUBLIC_API_URL directly.
  rewrites: async () => ({
    beforeFiles: [
      {
        source: "/api/:path*",
        destination: `${env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ],
    afterFiles: [],
    fallback: [],
  }),
};

export default nextConfig;
