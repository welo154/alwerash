import { GuestLanding } from "@/components/landing/GuestLanding";

/**
 * Guest marketing home (`/`). Middleware sends every request that carries a
 * session cookie to `/home`, `/admin`, `/mentor`, or `/instructor`, so this page
 * only ever renders for signed-out visitors.
 *
 * Rendered per request because the root layout reads the language cookie; every
 * data source on the page is cached for 60s under the public-catalog tag.
 */
export default function GuestLandingPage() {
  return <GuestLanding />;
}
