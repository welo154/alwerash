import { describe, expect, it } from "vitest";
import { localeCookieString, localeDirection, parseLocale, readLocaleCookie } from "./locale";

describe("locale helpers", () => {
  it("defaults anything unknown to English", () => {
    expect(parseLocale("ar")).toBe("ar");
    expect(parseLocale("en")).toBe("en");
    expect(parseLocale("fr")).toBe("en");
    expect(parseLocale(undefined)).toBe("en");
  });

  it("reads the locale cookie among others", () => {
    expect(readLocaleCookie("a=1; alwerash-locale=ar; b=2")).toBe("ar");
    expect(readLocaleCookie("alwerash-locale=xx")).toBeNull();
    expect(readLocaleCookie("other=ar")).toBeNull();
    expect(readLocaleCookie(undefined)).toBeNull();
  });

  it("writes a site-wide, year-long cookie, secure on https", () => {
    expect(localeCookieString("ar", true)).toBe(
      "alwerash-locale=ar; Path=/; Max-Age=31536000; SameSite=Lax; Secure"
    );
    expect(localeCookieString("en", false)).not.toContain("Secure");
  });

  it("maps Arabic to right-to-left", () => {
    expect(localeDirection("ar")).toBe("rtl");
    expect(localeDirection("en")).toBe("ltr");
  });
});
