import type { NextConfig } from "next";

// Report-only until violations have been reviewed on a real deployment: an
// enforced policy that misses a host silently breaks playback or uploads.
// 'unsafe-inline' scripts are needed because Next.js inlines its bootstrap
// script and no nonce is plumbed through.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.clarity.ms https://*.clarity.ms",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://image.mux.com https://*.googleusercontent.com https://*.supabase.co https://*.clarity.ms",
  "media-src 'self' blob: https://stream.mux.com https://*.mux.com",
  "connect-src 'self' https://stream.mux.com https://*.mux.com https://storage.googleapis.com https://*.clarity.ms",
  "font-src 'self' data:",
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://accounts.google.com",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  experimental: {
    instrumentationHook: true,
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
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
