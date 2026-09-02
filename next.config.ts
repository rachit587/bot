import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  // Image optimization — allow any remote image domain if needed
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Security headers at Next.js level (Netlify headers also applied)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
