import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  serverExternalPackages: ["@prisma/client", ".prisma/client", "prisma", "argon2", "bcrypt"],
  outputFileTracingIncludes: {
    "/": [
      "./node_modules/.prisma/client/**",
      "./node_modules/@prisma/client/**",
    ],
    "/*": [
      "./node_modules/.prisma/client/**",
      "./node_modules/@prisma/client/**",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
