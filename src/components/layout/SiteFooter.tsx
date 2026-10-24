"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Tr } from "@/components/i18n/Tr";
import { useArabicLayout, useLocale } from "@/components/providers/LocaleProvider";
import { pangeaFontFamily } from "@/lib/fonts/pangea";

const FOOTER_BG = "#89F496";

/** Loaded Pangea from public/fonts/FwTRIAL-PangeaVAR.woff2 */
const pangeaFont = pangeaFontFamily;

const footerColumnLinkClassName =
  "text-[18px] font-normal leading-[161%] tracking-[0] text-black underline-offset-2 transition-opacity hover:opacity-70 whitespace-normal sm:whitespace-nowrap";

const categoriesLinks: { label: string; href: string }[] = [
  { label: "Illustration courses", href: "/course" },
  { label: "Craft courses", href: "/course" },
  { label: "Marketing & Business courses", href: "/course" },
  { label: "Photography & Video courses", href: "/course" },
  { label: "Design courses", href: "/course" },
  { label: "3D & Animation courses", href: "/course" },
  { label: "Architecture & Spaces courses", href: "/course" },
  { label: "Writing courses", href: "/course" },
  { label: "Fashion courses", href: "/course" },
  { label: "Web & App design courses", href: "/course" },
];

const softwareLinks: { label: string; href: string }[] = [
  { label: "Adobe Photoshop courses", href: "/course" },
  { label: "Adobe Illustrator courses", href: "/course" },
  { label: "Procreate courses", href: "/course" },
  { label: "Adobe After Effects courses", href: "/course" },
  { label: "Adobe Lightroom courses", href: "/course" },
  { label: "Cinema 4D courses", href: "/course" },
  { label: "Adobe InDesign courses", href: "/course" },
  { label: "ChatGPT courses", href: "/course" },
  { label: "Adobe Premiere courses", href: "/course" },
];

const discoverLinks: { label: string; href: string }[] = [
  { label: "Teach on ElWerash", href: "/register" },
  { label: "Plans and Pricing", href: "/subscription" },
  { label: "Help and Support", href: "/subscription" },
];

const sectionLinks: { label: string; href: string }[] = [
  { label: "About Us", href: "/" },
  { label: "Courses", href: "/course" },
  { label: "Library", href: "/library" },
  { label: "Events", href: "/events" },
  { label: "Creatives", href: "/mentors" },
  { label: "Tracks", href: "/course" },
  { label: "Blog", href: "/" },
];

function FooterColumn({
  title,
  links,
  viewMoreHref,
  viewMoreLabel = "View more",
  arabicLinksAt120 = false,
}: {
  title: string;
  links: { label: string; href: string }[];
  viewMoreHref?: string;
  viewMoreLabel?: string;
  /** Arabic categories column: links are 18px / 400 / 120%. */
  arabicLinksAt120?: boolean;
}) {
  const arabic = useArabicLayout();
  const arabicLinkStyle =
    arabic && arabicLinksAt120
      ? {
          color: "#000",
          fontFamily: pangeaFont,
          fontSize: "18px",
          fontStyle: "normal" as const,
          fontWeight: 400,
          fontVariationSettings: '"wght" 400',
          lineHeight: "120%",
          textAlign: "right" as const,
        }
      : { fontFamily: pangeaFont };

  return (
    <div className={`w-full min-w-0 max-w-full sm:w-max sm:min-w-max sm:max-w-none ${arabic ? "text-right" : ""}`}>
      <h3
        className={`text-[18px] font-bold leading-[120%] tracking-[0] text-black sm:whitespace-nowrap ${arabic ? "text-right" : "uppercase"}`}
        style={
          arabic
            ? {
                color: "#000",
                textAlign: "right",
                fontFamily: pangeaFont,
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 700,
                fontVariationSettings: '"wght" 700',
                lineHeight: "120%",
              }
            : { fontFamily: pangeaFont }
        }
      >
        <Tr>{title}</Tr>
      </h3>
      {/* 4px vertical gap between rows (Figma line-height 4px on list items) */}
      <ul className="mt-4 space-y-1">
        {links.map((item) => (
          <li key={item.label}>
            <Link href={item.href} className={footerColumnLinkClassName} style={arabicLinkStyle}>
              <Tr>{item.label}</Tr>
            </Link>
          </li>
        ))}
        {viewMoreHref ? (
          <li>
            <Link
              href={viewMoreHref}
              className={`${footerColumnLinkClassName}${arabic && arabicLinksAt120 ? "" : " underline"} transition-opacity hover:opacity-70`}
              style={arabicLinkStyle}
            >
              <Tr>{viewMoreLabel}</Tr>
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { locale, toggleLocale } = useLocale();
  const arabic = locale === "ar";

  return (
    <footer className="bg-white px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <div
        dir={arabic ? "rtl" : "ltr"}
        className="mx-auto max-w-[1600px] overflow-hidden rounded-[32px] px-[76px] pb-[20px] pt-[45px] sm:rounded-[36px] lg:rounded-[40px]"
        style={{ backgroundColor: FOOTER_BG }}
      >
        {/* Top bar — one row: left cluster | space-between | icons + English */}
        <div className="flex w-full min-w-0 flex-row flex-nowrap items-center justify-between gap-0 overflow-x-auto">
          <div className="flex shrink-0 flex-row flex-nowrap items-baseline gap-x-[25px] text-black">
            <span
              className="text-center text-[24px] font-bold leading-[120%] tracking-[0] text-[#000000]"
              style={{ fontFamily: pangeaFont }}
            >
              <Tr>How can we help?</Tr>
            </span>
            <Link
              href="/subscription"
              className="text-center text-[18px] font-normal leading-[120%] tracking-[0] text-[#000000] underline-offset-2 hover:opacity-70"
              style={{ fontFamily: pangeaFont }}
            >
              <Tr>Contact Us</Tr>
            </Link>
            <Link
              href="/subscription"
              className="text-center text-[18px] font-normal leading-[120%] tracking-[0] text-[#000000] underline-offset-2 hover:opacity-70"
              style={{ fontFamily: pangeaFont }}
            >
              <Tr>Help Center</Tr>
            </Link>
          </div>
          <div
            dir="ltr"
            className={`flex shrink-0 flex-row flex-nowrap items-center gap-[40px] ${arabic ? "flex-row-reverse" : ""}`}
          >
            <div className="flex items-center gap-[3px] text-black">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-[39px] shrink-0 items-center justify-center transition-opacity hover:opacity-70"
                aria-label="Instagram"
              >
                <Image
                  src="/social/footer-instagram.png"
                  alt=""
                  width={39}
                  height={39}
                  className="size-[39px] object-contain"
                />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-[39px] shrink-0 items-center justify-center transition-opacity hover:opacity-70"
                aria-label="LinkedIn"
              >
                <Image
                  src="/social/footer-linkedin.png"
                  alt=""
                  width={39}
                  height={39}
                  className="size-[39px] object-contain"
                />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-[39px] shrink-0 items-center justify-center transition-opacity hover:opacity-70"
                aria-label="X"
              >
                <Image
                  src="/social/footer-x.png"
                  alt=""
                  width={39}
                  height={39}
                  className="size-[39px] object-contain"
                />
              </a>
            </div>
            <button
              type="button"
              onClick={toggleLocale}
              className="inline-flex h-[40px] w-[131px] shrink-0 cursor-pointer items-center justify-center gap-[10px] rounded-[8px] border border-black bg-transparent px-[12px] text-sm font-normal text-black opacity-100"
              aria-label={locale === "en" ? "Switch to Arabic" : "Switch to English"}
              suppressHydrationWarning
            >
              {locale === "en" ? "العربية" : "English"}
              <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
            </button>
          </div>
        </div>

        <hr className="mt-[15px] mb-[38px] border-t border-black" />

        {/* Four columns — max-content widths so labels stay one line (scroll on narrow viewports) */}
        <div className="overflow-x-auto overflow-y-visible [-webkit-overflow-scrolling:touch]">
          <div
            className={`grid w-max min-w-full grid-cols-[repeat(4,max-content)] ${arabic ? "gap-x-[115px]" : "gap-x-[100px]"}`}
          >
            <FooterColumn
              title="Categories"
              links={categoriesLinks}
              viewMoreHref="/course"
              viewMoreLabel={arabic ? "View all" : "View more"}
              arabicLinksAt120
            />
            <FooterColumn title="Software" links={softwareLinks} />
            <FooterColumn title="Discover" links={discoverLinks} />
            <FooterColumn title="Sections" links={sectionLinks} />
          </div>
        </div>

        {/* Wordmark stays on the left in both languages. */}
        <div dir="ltr" className="bg-transparent -mb-9 -mt-5">
          <Link
            href="/"
            className="-ml-[31px] inline-block max-w-[calc(100%+31px)] bg-transparent max-sm:max-w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static public asset; matches SSR/CSR */}
            <img
              src="/brand/alwerash-logo-hero.png"
              alt="Alwerash"
              width={677}
              height={240}
              className="block h-auto w-[677px] max-w-full object-contain object-left"
            />
          </Link>
        </div>

        {/* Legal — Pangea 18 / 400 / 120% / center; no border-top */}
        <div
          dir="ltr"
          className="mt-4 flex flex-col gap-4 pt-6 text-center text-[18px] font-normal leading-[120%] tracking-[0] text-black sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6"
          style={{ fontFamily: pangeaFont }}
        >
          <span
            suppressHydrationWarning
            style={
              arabic
                ? {
                    color: "#000",
                    textAlign: "center",
                    fontFamily: pangeaFont,
                    fontSize: "18px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontVariationSettings: '"wght" 400',
                    lineHeight: "120%",
                  }
                : undefined
            }
          >
            {arabic ? `© ${year} الورشة` : `© ${year} AlWerash`}
          </span>
          <Link href="/" className="text-center hover:opacity-70">
            <Tr>Terms of use</Tr>
          </Link>
          <Link href="/" className="text-center hover:opacity-70">
            <Tr>Privacy policy</Tr>
          </Link>
          <Link href="/" className="text-center hover:opacity-70">
            <Tr>Cookies policy</Tr>
          </Link>
        </div>
      </div>
    </footer>
  );
}
