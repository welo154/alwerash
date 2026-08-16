import localFont from "next/font/local";

export const pangeaVar = localFont({
  src: "../../../public/fonts/FwTRIAL-PangeaVAR.woff2",
  display: "swap",
  weight: "100 900",
  style: "normal",
  variable: "--font-dm-sans",
});

/** Loaded Pangea family with DM Sans fallback. */
export const pangeaFontFamily = `${pangeaVar.style.fontFamily}, var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif`;
