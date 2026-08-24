import Link from "next/link";
import Image from "next/image";
import { AuthBrandingAside } from "./AuthBrandingAside";
import { AuthGreenPanel } from "./AuthGreenPanel";
import {
  AUTH_GREEN_PANEL,
  AUTH_MAX_WIDTH,
  AUTH_PAGE_PADDING,
  AUTH_PANEL_GREEN,
  AUTH_SOCIAL_LINKS,
  pangeaFont,
  pangeaVar,
} from "./auth-theme";

const AUTH_LOGO_IMAGE = "/auth/alwerash-logo.png";


function AuthLoginMobileBrand() {
  return (
    <div className="flex w-full shrink-0 flex-col items-center lg:hidden">
      <Link
        href="/"
        aria-label="Alwerash home"
        className="block shrink-0"
        style={{ width: 121, height: 36 }}
      >
        <Image
          src={AUTH_LOGO_IMAGE}
          alt="alwerash."
          width={121}
          height={36}
          className="h-[36px] w-[121px] object-contain"
          priority
          unoptimized
        />
      </Link>
      <p
        className="m-0 mt-[20px] w-[334px] max-w-full text-center text-black"
        style={{
          fontFamily: pangeaFont,
          fontSize: 20,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "120%",
        }}
      >
        Master new skills, build a professional portfolio, and learn from the best in the
        industry. Only at Al
        <span
          style={{
            color: "#000",
            fontFamily: pangeaFont,
            fontSize: 20,
            fontStyle: "italic",
            fontWeight: 700,
            lineHeight: "120%",
          }}
        >
          Werash
        </span>
      </p>
    </div>
  );
}

function AuthLoginMobileSocialRow() {
  return (
    <div className="mt-[22px] mb-[18px] flex shrink-0 items-center justify-center lg:hidden">
      <div className="flex items-center" style={{ gap: 8 }}>
        {AUTH_SOCIAL_LINKS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="shrink-0"
            style={{
              width: 35,
              height: 37,
              background: `url(${item.image}) transparent 50% / contain no-repeat`,
            }}
          />
        ))}
      </div>
      <button
        type="button"
        className="flex shrink-0 items-center justify-center bg-white text-black"
        style={{
          marginLeft: 37,
          width: 121,
          height: 34,
          padding: "0 12px",
          gap: 10,
          borderRadius: 8,
          border: "0.3px solid #000",
          fontFamily: pangeaFont,
          fontSize: 14,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "19.6px",
        }}
        suppressHydrationWarning
      >
        English
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={15}
          height={7}
          viewBox="0 0 16 8"
          fill="none"
          aria-hidden
          className="shrink-0"
        >
          <path
            d="M0.5 0.5L8 7.5L15.5 0.5"
            stroke="#1E1E1E"
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

export function AuthPageShell({
  panel,
  mobileLayout,
}: {
  panel?: React.ReactNode;
  mobileLayout?: "login" | "register";
}) {
  const mobileChrome = Boolean(mobileLayout);
  const mobileGreenHeightClass =
    mobileLayout === "register"
      ? "max-lg:max-h-[902px]"
      : "max-lg:max-h-[534px]";
  const desktopGreenClass = "lg:mt-0 lg:h-[676px] lg:w-[790px] lg:shrink-0 lg:p-0";
  const desktopInnerPadClass =
    mobileLayout === "login"
      ? "lg:box-border lg:pt-[39px] lg:pr-[94px] lg:pb-[40px] lg:pl-[93px]"
      : "lg:box-border lg:pt-[46px] lg:pr-[94px] lg:pb-[71px] lg:pl-[93px]";

  return (
    <div
      className={`${pangeaVar.className} auth-page h-full bg-white ${
        mobileChrome
          ? "max-lg:flex max-lg:h-full max-lg:flex-col max-lg:items-center max-lg:overflow-hidden max-lg:pt-[56px] max-lg:px-0"
          : ""
      }`}
      style={mobileChrome ? undefined : { padding: AUTH_PAGE_PADDING }}
    >
      <div
        className={`mx-auto h-full w-full ${
          mobileChrome ? "max-lg:flex max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col max-lg:items-center" : "lg:flex lg:h-full lg:min-h-0 lg:items-center"
        }`}
        style={{ maxWidth: AUTH_MAX_WIDTH }}
      >
        {mobileChrome ? <AuthLoginMobileBrand /> : null}

        <div
          className={`flex w-full items-center justify-between ${
            mobileChrome ? "max-lg:flex-1 max-lg:flex-col max-lg:justify-start" : ""
          }`}
        >
          <div className={mobileChrome ? "hidden lg:block" : ""}>
            <AuthBrandingAside />
          </div>
          <AuthGreenPanel
            autoScroll={mobileLayout === "register"}
            className={`box-border ${
              mobileChrome
                ? `auth-green-panel max-lg:mt-[22px] max-lg:min-h-0 max-lg:flex-1 max-lg:w-[382px] max-lg:max-w-full max-lg:p-0 ${mobileGreenHeightClass} ${desktopGreenClass}`
                : ""
            }`}
            innerClassName={mobileChrome ? desktopInnerPadClass : undefined}
            style={
              mobileChrome
                ? {
                    borderRadius: AUTH_GREEN_PANEL.borderRadius,
                    background: AUTH_PANEL_GREEN,
                  }
                : {
                    width: AUTH_GREEN_PANEL.width,
                    height: AUTH_GREEN_PANEL.height,
                    borderRadius: AUTH_GREEN_PANEL.borderRadius,
                    background: AUTH_PANEL_GREEN,
                    padding: AUTH_GREEN_PANEL.padding,
                  }
            }
          >
            {panel}
          </AuthGreenPanel>
        </div>

        {mobileChrome ? (
          <p
            className="m-0 mt-[21px] w-[293px] shrink-0 text-center text-black lg:hidden"
            style={{
              fontFamily: pangeaFont,
              fontSize: 14,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "127%",
              opacity: 0.6,
            }}
          >
            Thousands of creative classes. Beginner to pro, watch at your pace and even
            offline.
          </p>
        ) : null}
        {mobileChrome ? <AuthLoginMobileSocialRow /> : null}
      </div>
    </div>
  );
}
