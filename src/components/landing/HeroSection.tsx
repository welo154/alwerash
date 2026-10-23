"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LandingSocialSignInRow } from "./LandingSocialSignInRow";
import { CoursesMegaMenuPanel } from "@/components/layout/CoursesMegaMenu";
import { MobileSiteNavActions, MobileSiteNavLogo } from "@/components/layout/MobileSiteNavBar";
import { HeaderLanguageToggle } from "@/components/layout/HeaderLanguageToggle";
import { useArabicLayout } from "@/components/providers/LocaleProvider";
import { useT } from "@/components/i18n/Tr";
import { pangeaFontFamily, pangeaVar } from "@/lib/fonts/pangea";
import { SUBSCRIPTION_PRICING_PATH } from "@/lib/subscription-routes";

export type HeroTrack = { id: string; title: string; slug: string };

const GUEST_SHELL_GREEN = "#8AF396";
const LOGO_W = 220;
const pangeaFont = pangeaFontFamily;

/** Desktop header shell — viewBox 1360×780. */
const HERO_SHELL_PATH =
  "M1305 0C1335.38 0 1360 24.6243 1360 55V725C1360 755.376 1335.38 780 1305 780H55C24.6243 780 1.36923e-06 755.376 0 725V132.636C0 105.022 22.3858 82.6357 50 82.6357H186.002C210.302 82.6356 230.002 62.9361 230.002 38.6357C230.002 17.2978 247.3 0 268.638 0H1305Z";

const HERO_SHELL = { width: 1360, height: 780 } as const;
const HERO_SHELL_MOBILE = { width: 382, height: 801 } as const;
const HERO_SHELL_TABLET = { width: 732, height: 1049 } as const;

/** Rest mosaic: TL 282×357, TR 197×272, BL 282×224, BR 197×308; gaps 18×16. */
const HERO_MOSAIC_FRAME = { width: 497, height: 597 } as const;
const mosaicAnim = (name: string) => `${name} 8000ms linear infinite`;
/** Photos cover the largest size each frame reaches while the mosaic moves. */
const HERO_MOSAIC_PHOTOS = [
  { anim: "alwerash-hero-mosaic-tl", src: "/hero/mosaic-tl.jpg" },
  { anim: "alwerash-hero-mosaic-tr", src: "/hero/mosaic-tr.jpg" },
  { anim: "alwerash-hero-mosaic-br", src: "/hero/mosaic-br.jpg" },
  { anim: "alwerash-hero-mosaic-bl", src: "/hero/mosaic-bl.jpg" },
] as const;

const HERO_SHELL_MOBILE_PATH =
  "M320 0C324.564 5.83965e-07 324.08 4 319.516 4H296C291.582 4 288 7.58172 288 12V34C288 38.4183 291.582 42 296 42H358.341C370.516 42 382 49.8245 382 62V739C382 773.242 354.242 801 320 801H62C27.7584 801 6.12127e-07 773.242 0 739V62C2.17657e-07 49.8245 11.4839 42 23.6594 42H102.338C113.107 42 121.838 33.2696 121.838 22.5V13.7569C121.838 7.81601 117.022 3 111.081 3H62.3134C58.8228 3 58.5094 1.32994e-07 62 0H320Z";

/** iPad / 744px viewport — viewBox 732×1049. */
const HERO_SHELL_TABLET_PATH =
  "M670 0C673.491 0 673.177 3 669.687 3H645C632.85 3 623 12.8497 623 25V41C623 56.464 635.536 69 651 69H682C709.614 69 732 91.3858 732 119V987C732 1021.24 704.242 1049 670 1049H62C27.7583 1049 0 1021.24 0 987V118C0 90.3857 22.3858 68 50 68H129.5C147.449 68 162 53.4493 162 35.5V19.2294C162 10.2662 154.734 3 145.771 3H62.3134C58.8228 3 58.5094 0 62 0H670Z";

export function HeroSection({ tracks: _tracks }: { tracks: HeroTrack[] }) {
  const arabic = useArabicLayout();
  const t = useT();
  return (
    <section className={`${pangeaVar.className} bg-white px-0 pb-0 pt-[37px] max-[743px]:sm:px-6 min-[744px]:pt-[7px] lg:px-8 lg:pt-[32px]`}>
      {/* Mobile shell — 382px centered in ~393 viewport */}
      <div className="relative w-full min-[744px]:hidden">
        <div
          className="relative mx-auto overflow-visible"
          style={{ width: HERO_SHELL_MOBILE.width, height: HERO_SHELL_MOBILE.height }}
        >
          <svg
            className="pointer-events-none absolute inset-0 z-0"
            xmlns="http://www.w3.org/2000/svg"
            width={HERO_SHELL_MOBILE.width}
            height={HERO_SHELL_MOBILE.height}
            viewBox="0 0 382 801"
            fill="none"
            aria-hidden
          >
            <path d={HERO_SHELL_MOBILE_PATH} fill={GUEST_SHELL_GREEN} />
          </svg>

          <MobileSiteNavLogo homeHref="/" />
          <MobileSiteNavActions />
          <GuestHeroMobileCopy />
        </div>
      </div>

      {/* iPad shell — 732px centered, 7px from page top */}
      <div className="relative hidden w-full min-[744px]:flex min-[744px]:justify-center lg:hidden">
        <div
          className="relative shrink-0 overflow-visible"
          style={{ width: HERO_SHELL_TABLET.width, height: HERO_SHELL_TABLET.height }}
        >
          <svg
            className="pointer-events-none absolute inset-0 z-0"
            xmlns="http://www.w3.org/2000/svg"
            width={HERO_SHELL_TABLET.width}
            height={HERO_SHELL_TABLET.height}
            viewBox={`0 0 ${HERO_SHELL_TABLET.width} ${HERO_SHELL_TABLET.height}`}
            fill="none"
            aria-hidden
          >
            <path d={HERO_SHELL_TABLET_PATH} fill="var(--Green, #8AF396)" />
          </svg>

          <MobileSiteNavLogo homeHref="/" variant="tablet" />
          <MobileSiteNavActions variant="tablet" />
          <GuestHeroMobileCopy variant="tablet" />
        </div>
      </div>

      {/* Desktop shell */}
      <div
        className="relative mx-auto hidden max-w-full flex-col overflow-visible lg:flex"
        style={{ width: HERO_SHELL.width, height: HERO_SHELL.height }}
      >
        <svg
          className="pointer-events-none absolute inset-0 z-0"
          xmlns="http://www.w3.org/2000/svg"
          width={HERO_SHELL.width}
          height={HERO_SHELL.height}
          viewBox={`0 0 ${HERO_SHELL.width} ${HERO_SHELL.height}`}
          fill="none"
          aria-hidden
        >
          <path d={HERO_SHELL_PATH} fill="var(--Green, #8AF396)" />
        </svg>

        <Link
          href="/"
          className="absolute left-0 top-[-8px] z-40 block"
          style={{ width: LOGO_W }}
        >
          <Image
            src="/brand/alwerash-logo-hero.png"
            alt="Alwerash"
            width={LOGO_W}
            height={LOGO_W}
            className="block h-auto w-[220px] max-w-none"
            unoptimized
          />
        </Link>

        <div className="relative z-30 h-full overflow-hidden">
          <div className="relative z-[3000] flex items-stretch">
            <div className="relative z-30 flex flex-1 items-center justify-end pb-5 pl-0 pr-8 pt-[28px]">
              <nav
                className="hidden items-center gap-[30px] text-[18px] font-normal text-black lg:flex"
                style={{ fontFamily: pangeaFont }}
              >
                <div className="group relative">
                  <Link
                    href="/course"
                    className="inline-flex w-[82px] min-w-[82px] max-w-[82px] shrink-0 items-center gap-0 whitespace-nowrap text-[18px] font-normal leading-[33px] text-black transition-opacity hover:opacity-75"
                  >
                    {t("Courses")}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-4 w-4 transition-transform duration-150 group-hover:rotate-180"
                      aria-hidden
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>

                  <div
                    className="absolute top-full left-0 z-2000 h-3 w-[min(100%,220px)] max-w-full"
                    aria-hidden
                  />

                  <div className="absolute top-full left-0 z-2000 mt-1 opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100">
                    <CoursesMegaMenuPanel />
                  </div>
                </div>
                <Link href="/library" className="inline-flex w-[54px] min-w-[54px] max-w-[54px] shrink-0 items-center whitespace-nowrap transition-opacity hover:opacity-75">{t("Library")}</Link>
                <Link href="/events" className="inline-flex w-[53px] min-w-[53px] max-w-[53px] shrink-0 items-center whitespace-nowrap transition-opacity hover:opacity-75">{t("Events")}</Link>
              </nav>

              <div className="ml-[30px] hidden flex-wrap items-center lg:flex">
                <div className="flex items-center gap-[15px]">
                  <div
                    className="flex shrink-0 items-center justify-center bg-white"
                    style={{
                      width: 350,
                      height: 40,
                      padding: "0 12px",
                      gap: 10,
                      borderRadius: 20,
                      border: "0.3px solid rgb(0 0 0 / 40%)",
                      background: "#FFF",
                      boxSizing: "border-box",
                    }}
                  >
                    <input
                      type="text"
                      placeholder={t("Search for courses")}
                      className="min-w-0 flex-1 bg-transparent text-[18px] text-[#73726C] placeholder:text-[#73726C] focus:outline-none"
                      style={{ fontFamily: pangeaFont }}
                      suppressHydrationWarning
                    />
                  </div>

                  <button
                    type="button"
                    aria-label="Search"
                    className="flex h-10 w-10 shrink-0 items-center justify-center"
                    suppressHydrationWarning
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 41 41"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M20.25 12.25L28.25 20.25L20.25 28.25M28.25 20.25H12.25M40.25 20.25C40.25 31.2957 31.2957 40.25 20.25 40.25C9.2043 40.25 0.25 31.2957 0.25 20.25C0.25 9.2043 9.2043 0.25 20.25 0.25C31.2957 0.25 40.25 9.2043 40.25 20.25Z"
                        stroke="var(--Black, #000)"
                        strokeWidth="0.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className="ml-[75px] flex w-[238px] min-w-[238px] max-w-[238px] shrink-0 items-center justify-end gap-[15px] overflow-visible">
                  <Link
                    href="/login"
                    className="inline-flex shrink-0 items-center justify-center whitespace-nowrap bg-white text-center text-[18px] font-bold leading-none tracking-[0] text-[#141413]"
                    style={{
                      fontFamily: pangeaFont,
                      display: "inline-flex",
                      height: 36,
                      padding: "0 16px",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 25,
                      border: "0.3px solid rgb(0 0 0 / 40%)",
                    }}
                  >
                    {t("Log in")}
                  </Link>
                  <Link
                    href={SUBSCRIPTION_PRICING_PATH}
                    className="shrink-0 items-center justify-center whitespace-nowrap text-center text-[18px] font-bold leading-none tracking-[0] text-[#141413]"
                    style={{
                      fontFamily: pangeaFont,
                      display: "flex",
                      width: 85,
                      height: 36,
                      padding: "0 16px",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 25,
                      border: "0.3px solid rgb(0 0 0 / 40%)",
                      background: "var(--Purple, #EA83F0)",
                      boxSizing: "border-box",
                    }}
                  >
                    {t("Sign up")}
                  </Link>
                  <HeaderLanguageToggle />
                </div>
              </div>
            </div>
          </div>

          <div
            className="z-20"
            dir={arabic ? "rtl" : undefined}
            style={{
              position: "absolute",
              top: 124,
              ...(arabic ? { right: 50 } : { left: 50 }),
              width: arabic ? 678 : 612,
              maxWidth: "calc(100% - 50px)",
            }}
          >
            <div
              style={{
                display: "flex",
                width: arabic ? 165 : 234,
                height: 25,
                padding: "0 16px",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
                borderRadius: 15,
                border: "0.2px solid rgb(0 0 0 / 40%)",
                background: "var(--Green, #8AF396)",
                boxSizing: "border-box",
                color: "#141413",
                textAlign: "center",
                fontFamily: pangeaFont,
                fontSize: 14,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "19.6px",
              }}
            >
              <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-black" aria-hidden />
              <span className="whitespace-nowrap" style={{ marginInlineStart: 8 }}>
                {arabic ? "تبـدأ الإبـداع هنـا" : "CREATIVITY STARTS HERE"}
              </span>
            </div>
            <h1
              className={`m-0 mt-[28px] max-w-full tracking-[0] text-black ${arabic ? "" : "uppercase"}`}
              style={{
                width: arabic ? 678 : 610,
                marginTop: 28,
                color: "#000",
                ...(arabic ? { textAlign: "right" as const } : {}),
                fontFamily: pangeaFont,
                fontSize: arabic ? "64px" : "48px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "120%",
              }}
            >
              {arabic ? (
                <>
                  اكتشف هوسك{" "}
                  <span
                    style={{
                      color: "#000",
                      fontFamily: pangeaFont,
                      fontSize: "64px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "120%",
                    }}
                  >
                    الإبداعي
                  </span>{" "}
                  التالي. من مبتدئ إلى محترف في وقتك الخاص.
                </>
              ) : (
                <>
                  Discover your next{" "}
                  <em
                    style={{
                      color: "#000",
                      fontFamily: pangeaFont,
                      fontSize: "48px",
                      fontStyle: "italic",
                      fontWeight: 700,
                      lineHeight: "120%",
                    }}
                  >
                    creative
                  </em>{" "}
                  obsession.
                  <br />
                  From beginner to pro at your own time.
                </>
              )}
            </h1>
            <p
              className={`${arabic ? "mt-[33px]" : "mt-[25px]"} max-w-full tracking-[0] text-black`}
              style={{
                width: 612,
                color: "#000",
                ...(arabic ? { textAlign: "right" as const } : {}),
                fontFamily: pangeaFont,
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "127%",
              }}
            >
              {arabic
                ? "استكشف الآلاف من الدروس عبر الإنترنت في التصميم، والطباعة، والرسم، والتصوير، والمزيد. تُدرس بواسطة محترفين في الصناعة."
                : "Explore thousands of online classes in design, typography, illustration, photography, and more. Taught by industry professionals."}
            </p>
            <Link
              href={SUBSCRIPTION_PRICING_PATH}
              className={arabic ? "mt-[50px]" : "mt-[30px]"}
              style={{
                display: "flex",
                width: 270,
                height: 78,
                padding: "0 16px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 30,
                border: "0.3px solid rgb(0 0 0 / 40%)",
                background: "var(--White, #FFF)",
                color: arabic ? "var(--Black, #000)" : "var(--Text-Primary, #141413)",
                textAlign: "center",
                fontFamily: pangeaFont,
                fontSize: arabic ? 40 : 36,
                fontStyle: "normal",
                fontWeight: arabic ? 500 : 400,
                lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
                boxSizing: "border-box",
              }}
            >
              {arabic ? "ابدأ الان" : "GET STARTED"}
            </Link>
            <p
              className={`mt-6 w-[270px] text-center tracking-[0] text-black ${arabic ? "" : "text-[24px] font-normal leading-[120%]"}`}
              style={
                arabic
                  ? {
                      color: "#000",
                      textAlign: "center",
                      fontFamily: pangeaFont,
                      fontSize: 20,
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "120%",
                    }
                  : { fontFamily: pangeaFont }
              }
            >
              {arabic ? "أو تابع مع" : "Or continue with"}
            </p>
            <div className="mt-[24px] w-[270px]" dir="ltr">
              <LandingSocialSignInRow variant="hero" />
            </div>
          </div>

          <div
            className="z-20"
            style={{
              position: "absolute",
              ...(arabic ? { left: 39 } : { right: 39 }),
              bottom: 31,
            }}
            aria-hidden
          >
            <div
              className="relative"
              style={{
                width: HERO_MOSAIC_FRAME.width,
                height: HERO_MOSAIC_FRAME.height,
                animation: "alwerash-hero-grid-float 5000ms ease-in-out infinite",
              }}
            >
              {HERO_MOSAIC_PHOTOS.map((frame) => (
                <div
                  key={frame.anim}
                  className="absolute overflow-hidden rounded-[50px] border border-black bg-white"
                  style={{ animation: mosaicAnim(frame.anim) }}
                >
                  {/* Decorative; the hero copy next to the mosaic is the accessible name. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={frame.src} alt="" className="h-full w-full object-cover" draggable={false} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GuestHeroMobileCopy({ variant = "mobile" }: { variant?: "mobile" | "tablet" }) {
  const arabic = useArabicLayout();
  const isTablet = variant === "tablet";
  /** Badge: 55px from SVG left, 166px from page top (header is 7px from page). */
  const tabletTop = 166 - 7;

  return (
    <div
      dir={arabic ? "rtl" : undefined}
      className={`absolute z-20 ${isTablet ? "w-[601px]" : "left-[25px] top-[110px] w-[323px]"}`}
      style={{
        fontFamily: pangeaFont,
        ...(isTablet ? { left: 55, top: tabletTop } : {}),
      }}
    >
      <div className="inline-flex items-center justify-center gap-[8px] overflow-hidden rounded-[6px] border-[0.2px] border-black bg-[#8AF396] px-4">
        <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-black" aria-hidden />
        <span className="text-center text-[14px] font-normal leading-[19.6px] text-[#141413] whitespace-nowrap">
          {arabic ? "تبـدأ الإبـداع هنـا" : "CREATIVITY STARTS HERE"}
        </span>
      </div>

      <h1
        className={`m-0 mt-[30px] text-black ${arabic ? "" : "uppercase"} ${isTablet ? "" : "w-[323px]"}`}
        style={{
          color: "#000",
          ...(arabic ? { textAlign: "right" as const } : {}),
          fontFamily: pangeaFont,
          fontSize: isTablet ? "60px" : "40px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "120%",
          ...(isTablet ? { width: 601, maxWidth: 601 } : {}),
        }}
      >
        {arabic ? (
          <>
            اكتشف هوسك{" "}
            <span
              style={{
                color: "#000",
                fontFamily: pangeaFont,
                fontSize: isTablet ? "60px" : "40px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "120%",
              }}
            >
              الإبداعي
            </span>{" "}
            التالي. من مبتدئ إلى محترف في وقتك الخاص.
          </>
        ) : (
          <>
            Discover your next{" "}
            <em
              style={{
                color: "#000",
                fontFamily: pangeaFont,
                fontSize: isTablet ? "60px" : "40px",
                fontStyle: "italic",
                fontWeight: 700,
                lineHeight: "120%",
              }}
            >
              creative
            </em>{" "}
            obsession.
            {isTablet ? " " : <br />}
            From beginner to pro at your own time.
          </>
        )}
      </h1>

      <p
        className={`m-0 ${arabic ? "mt-[33px]" : "mt-[30px]"} text-black ${isTablet ? "w-[554px]" : "w-[284px]"}`}
        style={{
          color: "#000",
          ...(arabic ? { textAlign: "right" as const } : {}),
          fontFamily: pangeaFont,
          fontSize: isTablet ? "24px" : "18px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "127%",
        }}
      >
        {arabic
          ? "استكشف الآلاف من الدروس عبر الإنترنت في التصميم، والطباعة، والرسم، والتصوير، والمزيد. تُدرس بواسطة محترفين في الصناعة."
          : "Explore thousands of online classes in design, typography, illustration, photography, and more. Taught by industry professionals."}
      </p>

      <Link
        href={SUBSCRIPTION_PRICING_PATH}
        className={
          isTablet
            ? `${arabic ? "mt-[50px]" : "mt-[61px]"} flex h-[91px] w-[300px] items-center justify-center rounded-[8px] bg-white px-4 text-center text-[36px] font-normal text-[#141413]`
            : "mt-[50px] inline-flex h-[44px] items-center rounded-[8px] border-[0.2px] bg-white px-4 text-[24px] font-normal leading-[19.6px] text-[#141413]"
        }
        style={{
          fontFamily: pangeaFont,
          ...(isTablet
            ? {
                borderRadius: "var(--Radius-MD, 8px)",
                border: "0.3px solid rgb(0 0 0 / 40%)",
                background: "var(--White, #FFF)",
                lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
                padding: "0 16px",
              }
            : {
                borderColor: "rgb(0 0 0 / 40%)",
              }),
        }}
      >
        {arabic ? "ابدأ الان" : "GET STARTED"}
      </Link>

      {isTablet ? (
        <>
          <p
            className={`m-0 mt-[19px] w-[300px] text-center text-black ${arabic ? "" : "text-[24px] font-normal leading-[120%]"}`}
            style={
              arabic
                ? {
                    color: "#000",
                    textAlign: "center",
                    fontFamily: pangeaFont,
                    fontSize: 20,
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "120%",
                  }
                : { fontFamily: pangeaFont }
            }
          >
            {arabic ? "أو تابع مع" : "Or continue with"}
          </p>
          <div className="w-[300px]" dir="ltr">
            <LandingSocialSignInRow variant="tabletHero" className="mt-[23px] w-[300px]" />
          </div>
        </>
      ) : (
        <div className={`mt-[17px] flex items-center ${arabic ? "justify-end" : ""}`} dir="ltr">
          <p
            className={`m-0 text-center text-black ${arabic ? "" : "text-[18px] font-normal leading-[120%]"}`}
            style={
              arabic
                ? {
                    color: "#000",
                    textAlign: "center",
                    fontFamily: pangeaFont,
                    fontSize: 20,
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "120%",
                  }
                : { fontFamily: pangeaFont }
            }
          >
            {arabic ? "أو تابع مع" : "Or continue with"}
          </p>
          <LandingSocialSignInRow variant="mobileHero" className="ml-[8px]" />
        </div>
      )}
    </div>
  );
}
