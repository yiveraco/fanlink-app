import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Yivera CDN — cover art, artist pictures, etc.
        protocol: "https",
        hostname: "yivera-cdn.fra1.digitaloceanspaces.com",
        pathname: "/**",
      },
      {
        // DigitalOcean Spaces direct URL (used in some older records)
        protocol: "https",
        hostname: "fra1.digitaloceanspaces.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
