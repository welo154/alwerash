import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const pangeaFont = pangeaFontFamily;

const MOBILE_FOOTER_SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    src: "/social/footer-instagram.png",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    src: "/social/footer-linkedin.png",
  },
  {
    label: "X",
    href: "https://x.com",
    src: "/social/footer-x.png",
  },
] as const;

export function LandingMobileFooter() {
  return (
    <footer
      className="mx-auto mt-[44px] mb-[-32px] box-border overflow-hidden rounded-[55px] px-[24px] pt-[25px]"
      style={{
        width: 382,
        height: 884,
        background: "var(--Bright-Green, #89F496)",
      }}
      aria-label="Site footer"
    >
      <div className="flex items-center justify-between gap-3">
        <p
          className="m-0 shrink-0"
          style={{
            color: "#000",
            textAlign: "center",
            fontFamily: pangeaFont,
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "120%",
          }}
        >
          How can we help?
        </p>

        <div className="flex shrink-0 items-center">
          <div className="flex items-center gap-[3px]">
            {MOBILE_FOOTER_SOCIALS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center justify-center transition-opacity hover:opacity-70"
                aria-label={item.label}
              >
                <Image
                  src={item.src}
                  alt=""
                  width={25}
                  height={27}
                  className="block object-contain"
                  style={{ width: 25, height: 27 }}
                  unoptimized
                />
              </a>
            ))}
          </div>

          <button
            type="button"
            className="ml-[10px] inline-flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[8px] border border-black bg-transparent p-0 text-black"
            aria-label="Language"
            suppressHydrationWarning
          >
            <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
          </button>
        </div>
      </div>

      <hr className="mt-[15px] border-0 bg-black" style={{ height: "0.3px" }} />
    </footer>
  );
}
