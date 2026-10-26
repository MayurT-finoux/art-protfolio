import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    serverActions: {
      // Admin saves from a GitHub Codespace: the browser's address (…app.github.dev)
      // differs from the host the dev server sees (localhost:3000).
      allowedOrigins: ["*.app.github.dev"],
      // Admin forms send whole artworks; default limit is 1 MB.
      bodySizeLimit: "2mb",
    },
  },
  images: {
    // Media uploaded to Cloudflare R2: r2.dev for now, media.yurix.art once the domain exists.
    remotePatterns: [{ protocol: "https", hostname: "*.r2.dev" }],
  },
};

export default nextConfig;
