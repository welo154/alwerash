import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin",
        "/mentor$",
        "/mentor/",
        "/instructor",
        "/dashboard",
        "/home",
        "/profile",
        "/settings",
        "/course-access/",
        "/lessons/",
        "/subscription/checkout",
        "/subscription/success",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
