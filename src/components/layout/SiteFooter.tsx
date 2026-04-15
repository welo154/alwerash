import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const FOOTER_BG = "#89F496";

/** Matches hero / Figma: FwTRIAL Pangea VAR with DM Sans fallback */
const pangeaFont =
  '"FwTRIAL Pangea VAR", var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif';

const footerColumnLinkClassName =
  "text-[18px] font-normal leading-[161%] tracking-[0] text-black underline-offset-2 transition-opacity hover:opacity-70 whitespace-normal sm:whitespace-nowrap";

const categoriesLinks: { label: string; href: string }[] = [
  { label: "Illustration courses", href: "/learn" },
  { label: "Craft courses", href: "/learn" },
  { label: "Marketing & Business courses", href: "/learn" },
  { label: "Photography & Video courses", href: "/learn" },
  { label: "Design courses", href: "/learn" },
  { label: "3D & Animation courses", href: "/learn" },
  { label: "Architecture & Spaces courses", href: "/learn" },
  { label: "Writing courses", href: "/learn" },
  { label: "Fashion courses", href: "/learn" },
  { label: "Web & App Design courses", href: "/learn" },
  { label: "Calligraphy & Typography courses", href: "/learn" },
  { label: "Music & Audio courses", href: "/learn" },
  { label: "Culinary courses", href: "/learn" },
  { label: "Artificial Intelligence courses", href: "/learn" },
  { label: "Wellness courses", href: "/learn" },
  { label: "How to become courses", href: "/learn" },
];

const softwareLinks: { label: string; href: string }[] = [
  { label: "Adobe Photoshop courses", href: "/learn" },
  { label: "Adobe Illustrator courses", href: "/learn" },
  { label: "Procreate courses", href: "/learn" },
  { label: "Adobe After Effects courses", href: "/learn" },
  { label: "Adobe Lightroom courses", href: "/learn" },
  { label: "Cinema 4D courses", href: "/learn" },
  { label: "Adobe InDesign courses", href: "/learn" },
  { label: "ChatGPT courses", href: "/learn" },
  { label: "Adobe Premiere courses", href: "/learn" },
];

const discoverLinks: { label: string; href: string }[] = [
  { label: "Teach on ElWerash", href: "/register" },
  { label: "Plans and Pricing", href: "/subscription" },
  { label: "Help and Support", href: "/subscription" },
];

const sectionLinks: { label: string; href: string }[] = [
  { label: "About Us", href: "/" },
  { label: "Courses", href: "/learn" },
  { label: "Projects", href: "/tracks" },
  { label: "Creatives", href: "/mentors" },
  { label: "Schools", href: "/tracks" },
  { label: "Blog", href: "/" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="w-full min-w-0 max-w-full sm:w-max sm:min-w-max sm:max-w-none">
      <h3
        className="text-[18px] font-bold uppercase leading-[120%] tracking-[0] text-black sm:whitespace-nowrap"
        style={{ fontFamily: pangeaFont }}
      >
        {title}
      </h3>
      {/* 4px vertical gap between rows (Figma line-height 4px on list items) */}
      <ul className="mt-4 space-y-1">
        {links.map((item) => (
          <li key={item.label}>
            <Link href={item.href} className={footerColumnLinkClassName} style={{ fontFamily: pangeaFont }}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <div
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
              How can we help?
            </span>
            <Link
              href="/subscription"
              className="text-center text-[18px] font-normal leading-[120%] tracking-[0] text-[#000000] underline-offset-2 hover:opacity-70"
              style={{ fontFamily: pangeaFont }}
            >
              Contact Us
            </Link>
            <Link
              href="/subscription"
              className="text-center text-[18px] font-normal leading-[120%] tracking-[0] text-[#000000] underline-offset-2 hover:opacity-70"
              style={{ fontFamily: pangeaFont }}
            >
              Help Center
            </Link>
          </div>
          <div className="flex shrink-0 flex-row flex-nowrap items-center gap-[40px]">
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
              className="inline-flex h-[40px] w-[131px] shrink-0 items-center justify-center gap-[10px] rounded-[8px] border border-black bg-transparent px-[12px] text-sm font-normal text-black opacity-100"
              suppressHydrationWarning
            >
              English
              <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
            </button>
          </div>
        </div>

        <hr className="mt-[15px] mb-[38px] border-t border-black" />

        {/* Four columns — max-content widths + 100px gaps so labels stay one line (scroll on narrow viewports) */}
        <div className="overflow-x-auto overflow-y-visible [-webkit-overflow-scrolling:touch]">
          <div className="grid w-max min-w-full max-w-full grid-cols-1 gap-y-10 sm:grid-cols-[repeat(2,max-content)] sm:gap-x-[100px] sm:gap-y-10 lg:grid-cols-[repeat(4,max-content)] lg:gap-x-[100px]">
            <FooterColumn title="Categories" links={categoriesLinks} />
            <FooterColumn title="Software" links={softwareLinks} />
            <FooterColumn title="Discover" links={discoverLinks} />
            <FooterColumn title="Sections" links={sectionLinks} />
          </div>
        </div>

        {/* Large wordmark — native <a>+<img> matches SSR/CSR exactly; multiply drops baked-in white */}
        <div className="bg-transparent  -mb-9 -mt-5">
          <Link
            href="/"
            className="-ml-[31px] inline-block max-w-[calc(100%+31px)] bg-transparent max-sm:max-w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static public asset; blend matches SSR/CSR */}
            <img
              src="/brand/alwerash-logo.png"
              alt="Alwerash"
              width={325}
              height={116}
              className="block h-auto w-[677px] max-w-full bg-transparent object-contain object-left opacity-100 mix-blend-multiply"
            />
          </Link>
        </div>

        {/* Legal — Pangea 18 / 400 / 120% / center; no border-top */}
        <div
          className="mt-4 flex flex-col gap-4 pt-6 text-center text-[18px] font-normal leading-[120%] tracking-[0] text-black sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6"
          style={{ fontFamily: pangeaFont }}
        >
          <span suppressHydrationWarning>© {year} AlWerash</span>
          <Link href="/" className="text-center hover:opacity-70">
            Terms of use
          </Link>
          <Link href="/" className="text-center hover:opacity-70">
            Privacy policy
          </Link>
          <Link href="/" className="text-center hover:opacity-70">
            Cookies policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
