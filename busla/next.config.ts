import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // This app lives in a subfolder of a larger repo; keep tracing scoped to it.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
