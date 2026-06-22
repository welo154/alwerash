import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
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

/** Figma 260-1744 — hero headline */
function AuthHeadlineBlock() {
  return (
    <p
      className="m-0 w-[430px] max-w-full text-black"
      style={{
        fontFamily: pangeaFont,
        fontSize: 48,
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "120%",
      }}
    >
      Master new skills, build a professional portfolio, and learn from the best in the industry. Only at Al
      <span
        style={{
          color: "#000",
          fontFamily: pangeaFont,
          fontSize: 48,
          fontStyle: "italic",
          fontWeight: 700,
          lineHeight: "120%",
        }}
      >
        Werash
      </span>
    </p>
  );
}

/** Figma 260-1745 — supporting copy */
function AuthSupportingCopy() {
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
      Thousands of creative classes. Beginner to pro, watch at your pace and even offline.
    </p>
  );
}

function AuthLanguageSelector() {
  return (
    <button
      type="button"
      className="flex shrink-0 items-center justify-center gap-[10px] rounded-[8px] border border-black bg-white text-[18px] font-normal text-black"
      style={{
        fontFamily: pangeaFont,
        width: 153,
        height: 47,
        padding: "0 12px",
      }}
      suppressHydrationWarning
    >
      English
      <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
    </button>
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
