import Image from "next/image";
import Link from "next/link";
import { SubscriptionPricingCards } from "@/components/subscription/SubscriptionPricingCard";
import { pangeaFontFamily, pangeaVar } from "@/lib/fonts/pangea";

const SUBSCRIPTION_LOGO = "/auth/alwerash-logo.png";

export default function SubscriptionPage() {
  return (
    <div
      className={`${pangeaVar.className} flex min-h-screen flex-col bg-white`}
      style={{ padding: "35px 48px 35px 48px" }}
    >
      <Link
        href="/"
        aria-label="Alwerash home"
        className="mx-auto block shrink-0"
        style={{ width: 198, height: 87, aspectRatio: "66 / 29" }}
      >
        <Image
          src={SUBSCRIPTION_LOGO}
          alt="alwerash."
          width={198}
          height={87}
          className="h-[87px] w-[198px] object-contain"
          priority
          unoptimized
        />
      </Link>
      <h1
        className="m-0 mx-auto text-center text-black"
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
      <div className="h-[18px] shrink-0" aria-hidden />
      <p
        className="m-0 mx-auto w-[485px] max-w-full text-center text-black"
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
      <div className="h-[41px] shrink-0" aria-hidden />
      <div
        className="mx-auto flex w-[1343px] max-w-full shrink-0 items-stretch"
        style={{
          height: 720,
          borderRadius: 50,
          background: "#89F496",
          padding: "59px 61px",
        }}
      >
        <SubscriptionPricingCards />
      </div>
    </div>
  );
}
