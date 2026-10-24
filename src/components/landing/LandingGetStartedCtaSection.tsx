"use client";

import Image from "next/image";
import Link from "next/link";
import { useArabicLayout } from "@/components/providers/LocaleProvider";
import { LandingSocialSignInRow } from "./LandingSocialSignInRow";
import { pangeaFontFamily } from "@/lib/fonts/pangea";
import { SUBSCRIPTION_PRICING_PATH } from "@/lib/subscription-routes";

const pangeaFont = pangeaFontFamily;

/** Inline headline logo — 104:31, larger than previous 208×62 */
const CTA_INLINE_LOGO_W = 260;
const CTA_INLINE_LOGO_H = 78;
/** Mobile stacked logo under the headline — matches hero wordmark width. */
const CTA_MOBILE_LOGO_W = 220;
const CTA_MOBILE_LOGO_H = 66;
const CTA_TABLET_LOGO_H = 72;
const CTA_TABLET_LOGO_W = Math.round((CTA_TABLET_LOGO_H * 104) / 31);

/**
 * Bottom-of-landing CTA: headline with inline logo, primary button, social row.
 * Social icons match `HeroSection` (same assets as the guest hero strip).
 */
export function LandingGetStartedCtaSection({
  variant = "desktop",
  className,
}: {
  variant?: "desktop" | "mobile";
  className?: string;
} = {}) {
  const arabic = useArabicLayout();

  if (variant === "mobile") {
    return (
      <section
        className={`overflow-hidden bg-white pb-0 min-[744px]:overflow-visible ${className ?? "mt-[96px]"}`}
        aria-labelledby="landing-get-started-heading-mobile landing-get-started-heading-tablet"
      >
        <div className="mx-auto flex w-full max-w-[393px] flex-col items-center overflow-x-hidden px-0 min-[744px]:max-w-none">
          <h2
            id="landing-get-started-heading-mobile"
            className={`m-0 w-[358px] max-w-full min-[744px]:hidden ${arabic ? "" : "uppercase"}`}
            style={{
              width: 358,
              color: "#000",
              textAlign: "center",
              fontFamily: pangeaFont,
              fontSize: 32,
              fontStyle: "normal",
              fontWeight: 400,
              fontVariationSettings: '"wght" 400',
              lineHeight: "120%",
            }}
          >
            {arabic ? (
              <>
                اكتسب مهارات جديدة،
                <br />
                قم ببناء محفظة مهنية، وتعلم من الأفضل في الصناعة. فقط في
              </>
            ) : (
              "MASTER NEW SKILLS, BUILD A PROFESSIONAL PORTFOLIO, AND LEARN FROM THE BEST IN THE INDUSTRY. ONLY AT"
            )}
          </h2>

          <div
            className={`shrink-0 min-[744px]:hidden ${arabic ? "mt-0" : "mt-[6px]"}`}
            style={{
              width: CTA_MOBILE_LOGO_W,
              height: CTA_MOBILE_LOGO_H,
              aspectRatio: "104 / 31",
            }}
          >
            <Image
              src="/brand/alwerash-logo.png"
              alt="Alwerash"
              width={CTA_MOBILE_LOGO_W}
              height={CTA_MOBILE_LOGO_H}
              className="block size-full object-contain object-center"
              unoptimized
            />
          </div>

          <h2
            id="landing-get-started-heading-tablet"
            className="m-0 hidden w-[594px] max-w-full uppercase min-[744px]:block lg:hidden"
            style={{
              color: "#000",
              textAlign: "center",
              fontFamily: pangeaFont,
              fontSize: 40,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "120%",
            }}
          >
            <span className="block">MASTER NEW SKILLS,</span>
            <span className="block">
              BUILD A PROFESSIONAL PORTFOLIO, AND LEARN FROM THE BEST IN THE INDUSTRY.
            </span>
            <span className="flex w-full items-center justify-center">
              <span className="relative z-[1]">ONLY AT</span>
              <span
                className="relative z-0 shrink-0"
                style={{
                  width: CTA_TABLET_LOGO_W,
                  height: CTA_TABLET_LOGO_H,
                  aspectRatio: "104 / 31",
                  marginLeft: -5,
                  transform: "translateY(-2px)",
                }}
              >
                <Image
                  src="/brand/alwerash-logo.png"
                  alt=""
                  width={CTA_TABLET_LOGO_W}
                  height={CTA_TABLET_LOGO_H}
                  className="block size-full object-contain object-left"
                  unoptimized
                  aria-hidden
                />
                <span className="sr-only">Alwerash</span>
              </span>
            </span>
          </h2>

          <Link
            href={SUBSCRIPTION_PRICING_PATH}
            className={`text-center text-[24px] font-normal no-underline transition-opacity hover:opacity-90 min-[744px]:mt-[58px] min-[744px]:!h-[91px] min-[744px]:!w-[300px] min-[744px]:!rounded-[8px] min-[744px]:!border-[0.3px] min-[744px]:!border-solid min-[744px]:!border-black min-[744px]:text-[36px] min-[744px]:!font-bold ${
              arabic ? "mt-[46px] min-[744px]:mt-[58px]" : "mt-[53px]"
            }`}
            style={{
              display: "inline-flex",
              height: 50,
              padding: "0 16px",
              alignItems: "center",
              borderRadius: 23,
              border: "0.2px solid rgb(0 0 0 / 40%)",
              background: "var(--Green, #8AF396)",
              color: "var(--Text-Primary, #141413)",
              fontFamily: pangeaFont,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
              boxSizing: "border-box",
            }}
          >
            {arabic ? (
              <>
                <span className="min-[744px]:hidden">ابدأ الآن</span>
                <span className="hidden min-[744px]:inline">GET STARTED</span>
              </>
            ) : (
              "GET STARTED"
            )}
          </Link>

          <p
            className={`m-0 text-center text-[18px] font-normal leading-[120%] min-[744px]:mt-[36px] min-[744px]:text-[24px] ${
              arabic ? "mt-[21px]" : "mt-[20px]"
            }`}
            style={{
              color: "#000",
              textAlign: "center",
              fontFamily: pangeaFont,
              fontStyle: "normal",
              fontWeight: 400,
              fontVariationSettings: '"wght" 400',
              lineHeight: "120%",
            }}
          >
            {arabic ? (
              <>
                <span className="min-[744px]:hidden">أو تابع مع</span>
                <span className="hidden min-[744px]:inline">Or continue with</span>
              </>
            ) : (
              "Or continue with"
            )}
          </p>

          <LandingSocialSignInRow variant="mobileCta" className="mt-[18px] min-[744px]:hidden" />
          <LandingSocialSignInRow
            variant="tabletCta"
            className="mt-[23px] hidden min-[744px]:flex lg:hidden"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      className="bg-white pt-[170px] pb-[120px]"
      aria-labelledby="landing-get-started-heading"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-center px-4 sm:px-8">
        <h2
          id="landing-get-started-heading"
          dir={arabic ? "rtl" : undefined}
          className={`text-center font-normal tracking-[0] ${arabic ? "w-[712px] max-w-full" : "w-full max-w-[894px] uppercase"}`}
          style={{
            color: "#000",
            fontFamily: pangeaFont,
            fontSize: "48px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
            fontVariationSettings: '"wght" 400',
            textAlign: "center",
          }}
        >
          {arabic ? (
            <>
              اكتسب مهارات جديدة،
              <br />
              قم ببناء محفظة مهنية، وتعلم من أفضل الخبراء في الصناعة. فقط في{" "}
              <span
                style={{
                  color: "#000",
                  fontFamily: pangeaFont,
                  fontSize: "48px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  fontVariationSettings: '"wght" 700',
                  lineHeight: "120%",
                }}
              >
                الـــورش
              </span>
            </>
          ) : (
            <>
              <span className="block">Master new skills,</span>
              <span className="block">build a professional portfolio,</span>
              <span className="block">and learn from the best in the</span>
              <span className="block">
                industry. Only at{" "}
                <span
                  className="-translate-x-[34px] -translate-y-[10px] inline-block max-w-full align-middle sm:-translate-x-[50px]"
                  style={{
                    width: `${CTA_INLINE_LOGO_W}px`,
                    height: `${CTA_INLINE_LOGO_H}px`,
                    aspectRatio: "104 / 31",
                  }}
                >
                  <Image
                    src="/brand/alwerash-logo.png"
                    alt=""
                    width={CTA_INLINE_LOGO_W}
                    height={CTA_INLINE_LOGO_H}
                    className="block size-full object-contain object-bottom"
                    unoptimized
                    aria-hidden
                  />
                  <span className="sr-only">Alwerash</span>
                </span>
              </span>
            </>
          )}
        </h2>

        <Link
          href={SUBSCRIPTION_PRICING_PATH}
          dir={arabic ? "rtl" : undefined}
          className={`mt-[50px] box-border flex max-w-full shrink-0 items-center justify-center text-center tracking-[0] no-underline transition-opacity hover:opacity-90 ${arabic ? "" : "uppercase"}`}
          style={{
            width: 390,
            height: 123,
            padding: "0 16px",
            borderRadius: 55,
            border: "0.3px solid var(--Black, #000)",
            background: "var(--Green, #8AF396)",
            color: "var(--Text-Primary, #141413)",
            fontFamily: pangeaFont,
            fontSize: arabic ? 64 : 48,
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
            fontVariationSettings: '"wght" 600',
            textAlign: "center",
          }}
        >
          {arabic ? "ابدأ الآن" : "Get started"}
        </Link>

        <p
          dir={arabic ? "rtl" : undefined}
          className="mt-[40px] text-center font-normal"
          style={{
            color: "#000",
            fontFamily: pangeaFont,
            fontSize: "36px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "120%",
            fontVariationSettings: '"wght" 400',
            textAlign: "center",
          }}
        >
          {arabic ? "أو تابع مع" : "Or continue with"}
        </p>

        <LandingSocialSignInRow variant="cta" className="mt-[40px]" />
      </div>
    </section>
  );
}
