import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GuestLanding } from "@/components/landing/GuestLanding";

/**
 * Guest marketing home (`/`). Signed-in members use `/home` instead.
 */
export default async function GuestLandingPage() {
  const session = await auth();
  if (session?.user) {
    const roles = (session.user.roles as string[]) ?? [];
    if (roles.includes("ADMIN")) redirect("/admin");
    if (roles.includes("INSTRUCTOR")) redirect("/instructor");
    redirect("/home");
  }

  return <GuestLanding />;
}

