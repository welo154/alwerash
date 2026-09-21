import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { SubscriptionPricingCards } from "@/components/subscription/SubscriptionPricingCard";
import { SubscriptionMobileCards } from "@/components/subscription/SubscriptionMobileCards";
import { AUTH_SOCIAL_LINKS } from "@/components/auth/auth-theme";
import { pangeaFontFamily, pangeaVar } from "@/lib/fonts/pangea";

const SUBSCRIPTION_LOGO = "/auth/alwerash-logo.png";

const SUBSCRIPTION_ERRORS: Record<string, string> = {
  payment_required:
    "Checkout isn’t available yet, so this plan can’t be activated. Please contact support to complete your subscription.",
  invalid: "That plan is no longer available. Please choose another one.",
};

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  const homeHref = session?.user ? "/home" : "/";

  const params = (await searchParams) ?? {};
  const errorKey = Array.isArray(params.error) ? params.error[0] : params.error;
  const errorMessage = errorKey ? SUBSCRIPTION_ERRORS[errorKey] : undefined;

  return (
    <div
      className={`${pangeaVar.className} subscription-page flex min-h-screen flex-col items-center bg-white max-lg:pt-[64px] max-lg:px-0 lg:items-stretch lg:[padding:35px_48px]`}
    >
      <Link
        href={homeHref}
        aria-label="Alwerash home"
        className="subscription-logo mx-auto block shrink-0 max-lg:h-[36px] max-lg:w-[121px] lg:h-[87px] lg:w-[198px]"
      >
        <Image
          src={SUBSCRIPTION_LOGO}
          alt="alwerash."
          width={198}
          height={87}
          className="h-full w-full object-contain"
          priority
          unoptimized
        />
      </Link>
      <h1
        className="subscription-title m-0 mx-auto mt-[15px] text-center text-black lg:mt-0"
        style={{
          fontFamily: pangeaFontFamily,
          fontSize: 48,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "120%",
        }}
      >
        Subscription{" "}
        <span
          className="subscription-title-em"
          style={{
            fontFamily: pangeaFontFamily,
            fontSize: 48,
            fontStyle: "italic",
            fontWeight: 500,
            lineHeight: "120%",
          }}
        >
          Pricing
        </span>
      </h1>
      <div className="subscription-copy-gap h-[18px] shrink-0" aria-hidden />
      <p
        className="subscription-copy m-0 mx-auto w-[485px] max-w-full text-center text-black max-lg:w-[286px]"
        style={{
          fontFamily: pangeaFontFamily,
          fontSize: 24,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "127%",
          opacity: 0.6,
        }}
      >
        Thousands of creative classes. Beginner to pro, watch at your pace and even offline.
      </p>
      {errorMessage ? (
        <p
          role="alert"
          className="m-0 mx-auto mt-[24px] w-[485px] max-w-full rounded-[16px] px-[20px] py-[14px] text-center text-black max-lg:w-[320px]"
          style={{
            fontFamily: pangeaFontFamily,
            fontSize: 16,
            fontWeight: 400,
            lineHeight: "140%",
            background: "#FFE9E4",
            border: "1px solid #F0B8AA",
          }}
        >
          {errorMessage}
        </p>
      ) : null}
      <div className="subscription-panel-gap h-[41px] shrink-0" aria-hidden />
      <div
        className="subscription-panel mx-auto flex w-[1343px] max-w-full shrink-0 items-stretch overflow-hidden max-lg:h-[627px] max-lg:w-[382px] max-lg:p-0 lg:h-[720px] lg:p-[59px_61px]"
        style={{
          borderRadius: 50,
          background: "#89F496",
        }}
      >
        <div className="hidden lg:block">
          <SubscriptionPricingCards />
        </div>
        <div className="flex h-full w-full min-w-0 items-center lg:hidden">
          <SubscriptionMobileCards />
        </div>
      </div>

      <p
        className="m-0 mt-[30px] w-[293px] text-center text-black lg:hidden"
        style={{
          fontFamily: pangeaFontFamily,
          fontSize: 14,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "127%",
          opacity: 0.6,
        }}
      >
        Thousands of creative classes. Beginner to pro, watch at your pace and even offline.
      </p>
      <div className="mt-[22px] mb-[18px] flex shrink-0 items-center justify-center lg:hidden">
        <div className="flex items-center" style={{ gap: 8 }}>
          {AUTH_SOCIAL_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="shrink-0"
              style={{
                width: 35,
                height: 37,
                background: `url(${item.image}) transparent 50% / contain no-repeat`,
              }}
            />
          ))}
        </div>
        <button
          type="button"
          className="flex shrink-0 items-center justify-center bg-white text-black"
          style={{
            marginLeft: 37,
            width: 121,
            height: 34,
            padding: "0 12px",
            gap: 10,
            borderRadius: 8,
            border: "0.3px solid #000",
            fontFamily: pangeaFontFamily,
            fontSize: 14,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "19.6px",
          }}
          suppressHydrationWarning
        >
          English
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={15}
            height={7}
            viewBox="0 0 16 8"
            fill="none"
            aria-hidden
            className="shrink-0"
          >
            <path
              d="M0.5 0.5L8 7.5L15.5 0.5"
              stroke="#1E1E1E"
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
