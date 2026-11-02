/**
 * Site language, shared by server and client.
 *
 * The choice lives in a cookie so the server renders the right language on the
 * first request: no English flash for Arabic readers, and <html lang> is right
 * from the start.
 */
export type SiteLocale = "en" | "ar";

export const DEFAULT_LOCALE: SiteLocale = "en";

export const LOCALE_COOKIE = "alwerash-locale";

/** Previous storage location, read once to move existing choices to the cookie. */
export const LEGACY_LOCALE_STORAGE_KEY = "alwerash-locale";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function parseLocale(value: string | null | undefined): SiteLocale {
  return value === "ar" ? "ar" : DEFAULT_LOCALE;
}

export function isSiteLocale(value: unknown): value is SiteLocale {
  return value === "en" || value === "ar";
}

export function localeDirection(locale: SiteLocale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** `document.cookie` assignment string for the chosen locale. */
export function localeCookieString(locale: SiteLocale, secure: boolean): string {
  return `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax${secure ? "; Secure" : ""}`;
}

/** Read the locale cookie from a raw `Cookie` header or `document.cookie`. */
export function readLocaleCookie(cookieHeader: string | null | undefined): SiteLocale | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === LOCALE_COOKIE) {
      const value = rest.join("=");
      return isSiteLocale(value) ? value : null;
    }
  }
  return null;
}
