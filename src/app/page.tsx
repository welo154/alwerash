import { GuestLanding } from "@/components/landing/GuestLanding";

/**
 * Guest marketing home (`/`). Middleware sends every request that carries a
 * session cookie to `/home`, `/admin`, `/mentor`, or `/instructor`, so this page
 * only ever renders for signed-out visitors and can be cached.
 */
export const revalidate = 60;

export default function GuestLandingPage() {
  return <GuestLanding />;
}
