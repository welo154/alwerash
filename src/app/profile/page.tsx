import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSubscriptionStatus } from "@/server/subscription/subscribe.service";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/profile");

  const subscription = await getSubscriptionStatus(session.user.id);

  return (
    <ProfileForm
      user={{
        id: session.user.id,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: (session.user as { image?: string | null }).image ?? null,
        country: (session.user as { country?: string | null }).country ?? null,
      }}
      subscription={{
        active: subscription.active,
        expiresAt: subscription.expiresAt ?? null,
      }}
    />
  );
}
