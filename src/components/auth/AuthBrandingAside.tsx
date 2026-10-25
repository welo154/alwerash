"use client";

import Link from "next/link";
import Image from "next/image";
import { useT } from "@/components/i18n/Tr";
import { useLocale } from "@/components/providers/LocaleProvider";
import { AuthLocaleButton } from "./AuthLocaleButton";
import { AUTH_SOCIAL_LINKS, pangeaFont } from "./auth-theme";

const AUTH_LOGO_IMAGE = "/auth/alwerash-logo.png";

/** Figma 260-1737 — logo lockup */
function AuthLogoBlock() {
  return (
    <Link
      href="/"
      aria-label="Alwerash home"
      className="block shrink-0 transition-opacity hover:opacity-80"
      style={{ width: 200, height: 60, aspectRatio: "10 / 3" }}
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

export function AuthHeadlineSentence({ fontSize }: { fontSize: number }) {
  const { locale } = useLocale();
  const werashStyle = {
    color: "#000",
    fontFamily: pangeaFont,
    fontSize,
    fontStyle: "italic" as const,
    fontWeight: 700,
    lineHeight: "120%",
  };

  if (locale === "ar") {
    return (
      <>
        أتقن مهارات جديدة، وابنِ ملفاً احترافياً، وتعلّم من الأفضل في المجال. فقط على{" "}
        <span style={werashStyle}>الورَش</span>
      </>
    );
  }

  return (
    <>
      Master new skills, build a professional portfolio, and learn from the best in the industry. Only at Al
      <span style={werashStyle}>Werash</span>
    </>
  );
}

/** Figma 260-1744 — hero headline */
function AuthHeadlineBlock() {
  return (
    <p
      className="m-0 w-[415px] max-w-full text-black"
      style={{
        fontFamily: pangeaFont,
        fontSize: 36,
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "120%",
      }}
    >
      <AuthHeadlineSentence fontSize={36} />
    </p>
  );
}

/** Figma 260-1745 — supporting copy */
function AuthSupportingCopy() {
  const t = useT();
  return (
    <p
      className="m-0 w-[409px] max-w-full text-black"
      style={{
        fontFamily: pangeaFont,
        fontSize: 24,
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "127%",
        opacity: 0.6,
      }}
    >
      {t("Thousands of creative classes. Beginner to pro, watch at your pace and even offline.")}
    </p>
  );
}

function AuthLanguageSelector() {
  return (
    <AuthLocaleButton
      className="flex shrink-0 items-center justify-center gap-[10px] rounded-[30px] border border-black bg-white text-[18px] font-normal text-black"
      style={{
        fontFamily: pangeaFont,
        width: 153,
        height: 47,
        padding: "0 12px",
        borderRadius: 30,
      }}
    />
  );
}

/** Left auth column — logo, copy, language, social icons */
export function AuthBrandingAside() {
  return (
    <aside className="flex w-full max-w-[435px] shrink-0 flex-col">
      <AuthLogoBlock />
      <div className="h-[64px] shrink-0" aria-hidden />
      <AuthHeadlineBlock />
      <div className="h-[35px] shrink-0" aria-hidden />
      <AuthSupportingCopy />
      <div className="h-[67px] shrink-0" aria-hidden />
      <div className="flex w-full items-center gap-[16px]">
        <div className="flex items-center gap-[11px]">
          {AUTH_SOCIAL_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="shrink-0 overflow-hidden border border-white"
              style={{
                width: 56,
                height: 56,
                borderRadius: 30,
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
