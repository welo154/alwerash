import Link from "next/link";
import { requirePageSession } from "@/server/auth/live-session";
import { getSubscriptionStatus } from "@/server/subscription/subscribe.service";
import { pangeaFontFamily, pangeaVar } from "@/lib/fonts/pangea";
import { RefreshUntilActive } from "./RefreshUntilActive";

export const dynamic = "force-dynamic";

/**
 * Polar returns here after checkout. The redirect is not proof of payment:
 * access appears only once the verified `order.paid` webhook has been applied.
 */
export default async function SubscriptionSuccessPage() {
  const session = await requirePageSession("/subscription/success");
  const status = await getSubscriptionStatus(session.user.id);

  return (
    <div className={`${pangeaVar.className} flex min-h-screen items-center justify-center bg-white px-4 py-10`}>
      <div
        className="w-full max-w-[560px] px-6 py-10 text-center text-black sm:px-10"
        style={{ borderRadius: 32, background: "#89F496", fontFamily: pangeaFontFamily }}
      >
        {status.active ? (
          <>
            <h1 className="m-0 text-[32px] font-medium leading-[120%]">You&apos;re in!</h1>
            <p className="m-0 mt-4 text-[18px] leading-[140%]">
              Your membership is active
              {status.expiresAt
                ? ` until ${status.expiresAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
                : ""}
              . Every course is open to you now.
            </p>
            <Link
              href="/course"
              className="mt-8 inline-flex h-[56px] items-center justify-center rounded-[8px] bg-black px-8 text-[18px] text-white no-underline"
            >
              Start learning
            </Link>
          </>
        ) : (
          <>
            <h1 className="m-0 text-[32px] font-medium leading-[120%]">Confirming your payment…</h1>
            <p className="m-0 mt-4 text-[18px] leading-[140%]">
              This usually takes a few seconds. The page updates on its own once your membership is
              active.
            </p>
            <p className="m-0 mt-6 text-[14px] opacity-75">
              Paid but still waiting after a few minutes? Email us with your receipt and we will
              activate it by hand.
            </p>
            <RefreshUntilActive />
          </>
        )}
      </div>
    </div>
  );
}
