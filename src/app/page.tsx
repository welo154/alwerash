import { redirect } from "next/navigation";
import { readLiveSession } from "@/server/auth/live-session";
import { GuestLanding } from "@/components/landing/GuestLanding";
import { markPage } from "@/server/observability/query-timing";

export const dynamic = "force-dynamic";

/**
 * Guest marketing home (`/`). Signed-in members use `/home` instead.
 */
export default async function GuestLandingPage() {
  markPage("/");
  const live = await readLiveSession();
  if (live.state === "revoked") redirect("/login?error=device_revoked");
  const session = live.state === "active" ? live.session : null;
  if (session?.user) {
    const roles = (session.user.roles as string[]) ?? [];
    if (roles.includes("ADMIN")) redirect("/admin");
    if (roles.includes("MENTOR")) redirect("/mentor");
    if (roles.includes("INSTRUCTOR")) redirect("/instructor");
    redirect("/home");
  }

  return <GuestLanding />;
}

