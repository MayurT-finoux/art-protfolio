import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Media uploaded to Cloudflare R2: r2.dev for now, media.yurix.art once the domain exists.
    remotePatterns: [{ protocol: "https", hostname: "*.r2.dev" }],
  },
};

export default nextConfig;
