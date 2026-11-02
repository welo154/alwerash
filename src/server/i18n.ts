import { cache } from "react";
import { cookies } from "next/headers";
import { translateUi } from "@/lib/i18n/dictionary";
import { LOCALE_COOKIE, parseLocale, type SiteLocale } from "@/lib/i18n/locale";

/** The visitor's language for this request, from the locale cookie. */
export const getLocale = cache(async (): Promise<SiteLocale> => {
  const store = await cookies();
  return parseLocale(store.get(LOCALE_COOKIE)?.value);
});

/**
 * Translate UI strings in server components:
 *   const t = await getServerT();
 *   <h1>{t("CONTINUE LEARNING")}</h1>
 */
export async function getServerT(): Promise<(text: string) => string> {
  const locale = await getLocale();
  return (text: string) => translateUi(locale, text);
}

/** Pick authored Arabic content when Arabic is selected and a translation exists. */
export async function getServerLocalizedText(): Promise<
  (english: string, arabic?: string | null) => string
> {
  const arabic = (await getLocale()) === "ar";
  return (english, translated) => {
    const value = translated?.trim();
    return arabic && value ? value : english;
  };
}
