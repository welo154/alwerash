const PRODUCTION_SITE_URL = "https://www.alwerash.com";

/** Public origin used for absolute URLs in the sitemap and robots.txt. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_ENV === "production" ? PRODUCTION_SITE_URL : "") ||
    process.env.AUTH_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim() ||
    "http://localhost:3070";
  return raw.replace(/\/$/, "");
}
