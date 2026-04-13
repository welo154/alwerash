import Image from "next/image";
import Link from "next/link";

const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

const CTA_GREEN = "#A2FF86";
const CTA_BUTTON_TEXT = "#141413";
/** Inline headline logo — 104:31, larger than previous 208×62 */
const CTA_INLINE_LOGO_W = 260;
const CTA_INLINE_LOGO_H = 78;

/**
 * Bottom-of-landing CTA: headline with inline logo, primary button, social row.
 * Social icons match `HeroSection` (same assets as the guest hero strip).
 */
export function LandingGetStartedCtaSection() {
  return (
    <section
      className="bg-white pt-[170px] pb-[120px]"
      aria-labelledby="landing-get-started-heading"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col items-center px-4 sm:px-8">
        <h2
          id="landing-get-started-heading"
          className="w-full max-w-[894px] text-center font-normal uppercase tracking-[0]"
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
        </h2>

        <Link
          href="/register"
          className="mt-[50px] flex h-[123px] w-[390px] max-w-full shrink-0 items-center justify-center rounded-2xl border border-black px-[16px] py-0 text-center font-bold uppercase tracking-[0] transition-opacity hover:opacity-90"
          style={{
            backgroundColor: CTA_GREEN,
            fontFamily: pangeaFont,
            color: CTA_BUTTON_TEXT,
            fontSize: "48px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "19.6px",
            fontVariationSettings: '"wght" 700',
            textAlign: "center",
          }}
        >
          Get started
        </Link>

        <p
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
          Or continue with
        </p>

        <div className="mt-[40px] flex items-center justify-center gap-[18.5px]">
          <Image
            src="/social/google.png"
            alt="Google"
            width={64}
            height={64}
            className="h-[64px] w-[64px]"
            unoptimized
          />
          <Image
            src="/social/apple.png"
            alt="Apple"
            width={64}
            height={64}
            className="h-[64px] w-[64px]"
            unoptimized
          />
          <Image
            src="/social/facebook.png"
            alt="Facebook"
            width={64}
            height={64}
            className="h-[64px] w-[64px]"
            unoptimized
          />
          <Image
            src="/social/email.png"
            alt="Email"
            width={64}
            height={64}
            className="h-[64px] w-[64px]"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
