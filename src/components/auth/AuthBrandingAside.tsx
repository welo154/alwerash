"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useArabicLayout, useLocale } from "@/components/providers/LocaleProvider";
import { AUTH_SOCIAL_LINKS, pangeaFont } from "./auth-theme";

const AUTH_LOGO_IMAGE = "/auth/alwerash-logo.png";

/** Figma 260-1737 — logo lockup */
function AuthLogoBlock() {
  const arabic = useArabicLayout();

  return (
    <Link
      href="/"
      aria-label="Alwerash home"
      className="block shrink-0 transition-opacity hover:opacity-80"
      style={{
        width: 200,
        height: 60,
        aspectRatio: "10 / 3",
        marginLeft: arabic ? 215 : 0,
      }}
    >
      <Image
        src={AUTH_LOGO_IMAGE}
        alt="alwerash."
        width={200}
        height={60}
        className="h-[60px] w-[200px] object-contain object-left"
        priority
        unoptimized
      />
    </Link>
  );
}

/** Figma 260-1744 — hero headline */
function AuthHeadlineBlock() {
  const arabic = useArabicLayout();

  return (
    <p
      dir={arabic ? "rtl" : "ltr"}
      className="m-0 w-[415px] max-w-full text-black"
      style={{
        color: "#000",
        textAlign: arabic ? "right" : "left",
        fontFamily: pangeaFont,
        fontSize: 36,
        fontStyle: "normal",
        fontWeight: 400,
        fontVariationSettings: '"wght" 400',
        lineHeight: "120%",
      }}
    >
      {arabic ? (
        "تعلم مهارات جديدة، وابنِ محفظة مهنية، وتعلم من الأفضل في الصناعة. فقط في AlWerash"
      ) : (
        <>
          Master new skills, build a professional portfolio, and learn from the best in the industry. Only at Al
          <span
            style={{
              color: "#000",
              fontFamily: pangeaFont,
              fontSize: 36,
              fontStyle: "italic",
              fontWeight: 700,
              fontVariationSettings: '"wght" 700',
              lineHeight: "120%",
            }}
          >
            Werash
          </span>
        </>
      )}
    </p>
  );
}

/** Figma 260-1745 — supporting copy */
function AuthSupportingCopy() {
  const arabic = useArabicLayout();

  return (
    <p
      dir={arabic ? "rtl" : "ltr"}
      className="m-0 w-[409px] max-w-full text-black"
      style={{
        color: "#000",
        textAlign: arabic ? "right" : "left",
        fontFamily: pangeaFont,
        fontSize: 24,
        fontStyle: "normal",
        fontWeight: 400,
        fontVariationSettings: '"wght" 400',
        lineHeight: "127%",
        opacity: 0.6,
      }}
    >
      {arabic
        ? "آلاف الدروس الإبداعية. من مبتدئ إلى محترف، شاهد بالوتيرة التي تناسبك وحتى بدون اتصال بالإنترنت."
        : "Thousands of creative classes. Beginner to pro, watch at your pace and even offline."}
    </p>
  );
}

function AuthLanguageSelector() {
  const { locale, toggleLocale } = useLocale();
  const arabic = locale === "ar";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={arabic ? "Switch to English" : "Switch to Arabic"}
      className="flex shrink-0 items-center justify-center gap-[10px] bg-white text-[18px] font-normal text-black"
      style={{
        fontFamily: pangeaFont,
        width: 153,
        height: 47,
        padding: "0 12px",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        borderRadius: 23,
        border: "0.3px solid rgb(0 0 0 / 40%)",
      }}
      suppressHydrationWarning
    >
      {arabic ? "English" : "العربيه"}
      <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
    </button>
  );
}

/** Left auth column — logo, copy, language, social icons */
export function AuthBrandingAside() {
  const arabic = useArabicLayout();

  return (
    <aside className="flex w-full max-w-[435px] shrink-0 flex-col">
      <AuthLogoBlock />
      <div className="h-[64px] shrink-0" aria-hidden />
      <AuthHeadlineBlock />
      <div className={`${arabic ? "h-[72px]" : "h-[35px]"} shrink-0`} aria-hidden />
      <AuthSupportingCopy />
      <div className="h-[67px] shrink-0" aria-hidden />
      <div className="flex w-[425px] max-w-full items-center gap-[37px]">
        <div className="flex items-center gap-[11px]">
          {AUTH_SOCIAL_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="shrink-0 border border-white"
              style={{
                width: 56,
                height: 56,
                background: `url(${item.image}) #fff 50% / contain no-repeat`,
              }}
            />
          ))}
        </div>
        <AuthLanguageSelector />
      </div>
    </aside>
  );
}
