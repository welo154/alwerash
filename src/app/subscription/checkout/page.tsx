import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePageSession } from "@/server/auth/live-session";
import { getSubscriptionPlan, isSubscriptionPlanId } from "@/lib/subscription-plans";
import { CHECKOUT_PROVIDERS, isCheckoutProviderKey } from "@/server/subscription/checkout-attempt";
import { requestCheckout } from "./actions";
import { RATE_LIMITED_MESSAGE } from "@/server/security/rate-limit";
import { pangeaFontFamily, pangeaVar } from "@/lib/fonts/pangea";

export const dynamic = "force-dynamic";

const LOGO = "/auth/alwerash-logo.png";

function one(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function CheckoutPlaceholderPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requirePageSession("/subscription/checkout");
  const params = await searchParams;
  const planId = one(params.plan);
  if (!isSubscriptionPlanId(planId)) notFound();
  const plan = getSubscriptionPlan(planId);
  if (!plan) notFound();

  const saved = one(params.saved) === "1";
  const providerKey = one(params.provider);
  const chosen = isCheckoutProviderKey(providerKey) ? CHECKOUT_PROVIDERS[providerKey] : null;
  const rateLimited = one(params.error) === "rate_limited";

  return (
    <div className={`${pangeaVar.className} flex min-h-screen flex-col items-center bg-white px-4 py-10`}>
      <Link href="/subscription" aria-label="Back to pricing" className="mb-8 block h-[48px] w-[140px]">
        <Image src={LOGO} alt="alwerash." width={140} height={48} className="h-full w-full object-contain" unoptimized />
      </Link>
      <div
        className="w-full max-w-[640px] px-6 py-10 text-black sm:px-10"
        style={{ borderRadius: 32, background: "#89F496" }}
      >
        <h1
          className="m-0 text-center"
          style={{ fontFamily: pangeaFontFamily, fontSize: 36, fontWeight: 500, lineHeight: "120%" }}
        >
          Checkout
        </h1>
        <p className="m-0 mt-4 text-center" style={{ fontFamily: pangeaFontFamily, fontSize: 18, lineHeight: "140%" }}>
          {plan.name} · {plan.price} EGP or {plan.priceUsd} USD · 1 year
        </p>
        <p
          className="m-0 mt-4 text-center"
          style={{ fontFamily: pangeaFontFamily, fontSize: 16, lineHeight: "140%", opacity: 0.75 }}
        >
          Paymob will take Egyptian pounds and Stripe will take US dollars. Neither is connected
          yet, so this page only saves your choice. Your card is not charged and your subscription
          does not start.
        </p>

        {rateLimited ? (
          <p role="alert" className="m-0 mt-6 text-center" style={{ fontFamily: pangeaFontFamily, fontSize: 16 }}>
            {RATE_LIMITED_MESSAGE}
          </p>
        ) : null}

        {saved && chosen ? (
          <p role="status" className="m-0 mt-8 text-center" style={{ fontFamily: pangeaFontFamily, fontSize: 18, lineHeight: "140%" }}>
            Saved. {chosen.label} ({chosen.currency}) is not taking payments yet. We will use this
            choice when checkout opens.
          </p>
        ) : (
          <div className="mt-8 flex flex-col items-center gap-4">
            <form action={requestCheckout}>
              <input type="hidden" name="planId" value={plan.id} />
              <input type="hidden" name="provider" value="paymob" />
              <PlaceholderButton>Continue with Paymob · {plan.price} EGP</PlaceholderButton>
            </form>
            <form action={requestCheckout}>
              <input type="hidden" name="planId" value={plan.id} />
              <input type="hidden" name="provider" value="stripe" />
              <PlaceholderButton>Continue with Stripe · {plan.priceUsd} USD</PlaceholderButton>
            </form>
          </div>
        )}

        <p className="m-0 mt-8 text-center">
          <Link href="/subscription" className="text-black underline" style={{ fontFamily: pangeaFontFamily, fontSize: 16 }}>
            Back to plans
          </Link>
        </p>
      </div>
    </div>
  );
}

function PlaceholderButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="cursor-pointer border-2 border-black bg-white px-6"
      style={{
        minWidth: 280,
        height: 56,
        borderRadius: 8,
        fontFamily: pangeaFontFamily,
        fontSize: 18,
        fontWeight: 400,
      }}
    >
      {children}
    </button>
  );
}
