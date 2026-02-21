import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Workaround for Next.js 15 generated route types "is not a module" error
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
