import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Optimize images for production
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Enable experimental features if needed
  experimental: {
    // Enable server actions if needed
    serverActions: true,
  },
};

export default nextConfig;
