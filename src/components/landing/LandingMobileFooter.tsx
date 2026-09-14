import Image from "next/image";
import Link from "next/link";
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

const mobileFooterSubtitleStyle = {
  color: "#000",
  fontFamily: pangeaFont,
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "161%",
} as const;

const mobileFooterViewMoreStyle = {
  ...mobileFooterSubtitleStyle,
  textDecorationLine: "underline",
  textDecorationStyle: "solid",
  textDecorationSkipInk: "auto",
} as const;

function MobileFooterLegalDot() {
  return (
    <span
      className="inline-block size-[3px] shrink-0 rounded-full bg-black opacity-60 min-[744px]:hidden"
      aria-hidden
    />
  );
}

const MAX_FOOTER_COLUMN_LINKS = 4;

function MobileFooterColumn({
  title,
  links,
  viewMoreHref = "/course",
  viewMoreLabel = "View more",
}: {
  title: string;
  links: { label: string; href: string }[];
  viewMoreHref?: string;
  viewMoreLabel?: string;
}) {
  const showViewMore = links.length > MAX_FOOTER_COLUMN_LINKS;

  return (
    <div className="min-w-0">
      <h3
        className="m-0 text-[14px] font-bold uppercase leading-[120%] min-[744px]:text-[18px]"
        style={{
          color: "#000",
          fontFamily: pangeaFont,
          fontStyle: "normal",
          fontWeight: 700,
        }}
      >
        {title}
      </h3>
      <ul className="mt-3 space-y-0">
        {links.map((item, index) => (
          <li
            key={item.label}
            className={index >= MAX_FOOTER_COLUMN_LINKS ? "hidden min-[744px]:block" : undefined}
          >
            <Link
              href={item.href}
              className="text-[14px] font-normal leading-[161%] transition-opacity hover:opacity-70 min-[744px]:text-[18px]"
              style={{
                color: "#000",
                fontFamily: pangeaFont,
                fontStyle: "normal",
                fontWeight: 400,
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
        {showViewMore ? (
          <li className="min-[744px]:hidden">
            <Link
              href={viewMoreHref}
              className="transition-opacity hover:opacity-70"
              style={mobileFooterViewMoreStyle}
            >
              {viewMoreLabel}
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export function LandingMobileFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="site-mobile-footer relative z-10 mx-auto mt-[44px] box-border flex w-[382px] translate-y-[35px] flex-col overflow-hidden rounded-[55px] pb-[28px] pt-[25px] max-[743px]:px-[24px] min-[744px]:w-[732px] min-[744px]:translate-y-0 min-[744px]:rounded-t-[55px] min-[744px]:rounded-b-none min-[744px]:pl-[55px] min-[744px]:pr-[55px] min-[744px]:pt-[50px] min-[744px]:pb-[24px]"
      style={{
        background: "var(--Bright-Green, #89F496)",
      }}
      aria-label="Site footer"
    >
      <div
        className="pointer-events-none absolute left-0 top-0 hidden w-full min-[744px]:block"
        style={{
          height: 1145.999,
          borderRadius: 55,
          background: "var(--Bright-Green, #89F496)",
        }}
        aria-hidden
      />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center">
          <p
            className="m-0 shrink-0 text-[16px] font-bold leading-[120%] min-[744px]:text-[20px]"
            style={{
              color: "#000",
              textAlign: "center",
              fontFamily: pangeaFont,
              fontStyle: "normal",
              fontWeight: 700,
            }}
          >
            How can we help?
          </p>
          <Link
            href="/subscription"
            className="ml-[16px] hidden shrink-0 text-[16px] font-normal leading-[120%] text-black transition-opacity hover:opacity-70 min-[744px]:inline"
            style={{
              color: "#000",
              textAlign: "center",
              fontFamily: pangeaFont,
              fontStyle: "normal",
              fontWeight: 400,
            }}
          >
            Contact Us
          </Link>
          <Link
            href="/subscription"
            className="ml-[20px] hidden shrink-0 text-[16px] font-normal leading-[120%] text-black transition-opacity hover:opacity-70 min-[744px]:inline"
            style={{
              color: "#000",
              textAlign: "center",
              fontFamily: pangeaFont,
              fontStyle: "normal",
              fontWeight: 400,
            }}
          >
            Help Center
          </Link>
        </div>

        <div className="flex shrink-0 items-center">
          <div className="flex items-center gap-[3px] min-[744px]:gap-[4px]">
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
                  width={30}
                  height={31}
                  className="block h-[27px] w-[25px] object-contain min-[744px]:h-[31px] min-[744px]:w-[30px]"
                  unoptimized
                />
              </a>
            ))}
          </div>

          <button
            type="button"
            className="relative ml-[10px] inline-flex h-[28px] w-[28px] shrink-0 items-center justify-center bg-transparent p-0 min-[744px]:h-[32px] min-[744px]:w-[32px]"
            aria-label="Language"
            suppressHydrationWarning
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={32}
              height={32}
              viewBox="0 0 29 29"
              fill="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden
            >
              <path
                d="M14.1504 28.1504C21.8824 28.1504 28.1504 21.8824 28.1504 14.1504C28.1504 6.4184 21.8824 0.150391 14.1504 0.150391C6.4184 0.150391 0.150391 6.4184 0.150391 14.1504C0.150391 21.8824 6.4184 28.1504 14.1504 28.1504Z"
                stroke="var(--Black, #000)"
                strokeWidth={0.3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="relative z-10 text-center text-[14px] font-normal leading-[120%] text-black"
              style={{ fontFamily: pangeaFont }}
            >
              EN
            </span>
          </button>
        </div>
      </div>

      <hr
        className="relative left-1/2 mt-[15px] w-[356px] -translate-x-1/2 border-0 bg-black min-[744px]:w-[622px]"
        style={{ height: "0.3px" }}
      />

      <div className="mt-[22px] flex flex-col gap-[20px] min-[744px]:mt-[32px] min-[744px]:grid min-[744px]:grid-cols-2 min-[744px]:gap-x-[108px] min-[744px]:gap-y-[65px]">
        <MobileFooterColumn title="Categories" links={categoriesLinks} />
        <MobileFooterColumn title="Software" links={softwareLinks} />
        <MobileFooterColumn title="Discover" links={discoverLinks} />
        <MobileFooterColumn title="Sections" links={sectionLinks} viewMoreHref="/" />
      </div>

      <div className="mt-[16px] -translate-y-[40px] pt-0 min-[744px]:translate-y-0">
        <Link href="/" className="-ml-[24px] inline-block max-w-[calc(100%+24px)] min-[744px]:ml-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/alwerash-logo-hero.png"
            alt="Alwerash"
            width={677}
            height={240}
            className="block h-auto w-[382px] max-w-none object-contain object-left min-[744px]:w-[622px]"
          />
        </Link>

        <div className="-mt-[10px] flex flex-col items-center gap-[8px] text-center min-[744px]:mt-[3px] min-[744px]:w-full min-[744px]:flex-row min-[744px]:items-center min-[744px]:justify-between min-[744px]:gap-0">
          <p
            className="m-0 whitespace-nowrap text-[12px] font-normal leading-[120%] text-black min-[744px]:text-[18px]"
            style={{
              fontFamily: pangeaFont,
              opacity: 0.6,
            }}
            suppressHydrationWarning
          >
            <span className="min-[744px]:hidden">© {year} AlWerash. All rights reserved.</span>
            <span className="hidden min-[744px]:inline">© {year} AlWerash</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-[8px] gap-y-1 min-[744px]:contents">
            <Link
              href="/"
              className="whitespace-nowrap text-[12px] font-normal leading-[120%] text-black transition-opacity hover:opacity-80 min-[744px]:text-[18px]"
              style={{ fontFamily: pangeaFont, opacity: 0.6 }}
            >
              Terms of use
            </Link>
            <MobileFooterLegalDot />
            <Link
              href="/"
              className="whitespace-nowrap text-[12px] font-normal leading-[120%] text-black transition-opacity hover:opacity-80 min-[744px]:text-[18px]"
              style={{ fontFamily: pangeaFont, opacity: 0.6 }}
            >
              Privacy policy
            </Link>
            <MobileFooterLegalDot />
            <Link
              href="/"
              className="whitespace-nowrap text-[12px] font-normal leading-[120%] text-black transition-opacity hover:opacity-80 min-[744px]:text-[18px]"
              style={{ fontFamily: pangeaFont, opacity: 0.6 }}
            >
              Cookies policy
            </Link>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
