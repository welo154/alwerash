"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  LEGACY_LOCALE_STORAGE_KEY,
  isSiteLocale,
  localeCookieString,
  readLocaleCookie,
  type SiteLocale,
} from "@/lib/i18n/locale";

export type { SiteLocale };

type LocaleContextValue = {
  locale: SiteLocale;
  setLocale: (locale: SiteLocale) => void;
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function persistLocale(locale: SiteLocale) {
  document.cookie = localeCookieString(locale, window.location.protocol === "https:");
  document.documentElement.lang = locale;
}

/**
 * Client view of the site language. `initialLocale` comes from the cookie the
 * root layout read, so server and client render the same language.
 */
export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: SiteLocale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<SiteLocale>(initialLocale);
  const [, startTransition] = useTransition();

  const setLocale = useCallback(
    (next: SiteLocale) => {
      setLocaleState(next);
      persistLocale(next);
      // Re-render server components (and <html lang>) in the new language.
      startTransition(() => router.refresh());
    },
    [router]
  );

  // One-time move of a choice saved before the cookie existed.
  useEffect(() => {
    if (readLocaleCookie(document.cookie)) return;
    let legacy: string | null = null;
    try {
      legacy = window.localStorage.getItem(LEGACY_LOCALE_STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_LOCALE_STORAGE_KEY);
    } catch {
      /* Storage can be blocked; the default language is fine then. */
    }
    if (isSiteLocale(legacy) && legacy !== initialLocale) setLocale(legacy);
  }, [initialLocale, setLocale]);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "ar" : "en");
  }, [locale, setLocale]);

  const value = useMemo(() => ({ locale, setLocale, toggleLocale }), [locale, setLocale, toggleLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

export function useArabicLayout() {
  return useLocale().locale === "ar";
}

/** Mirrors a page region only while Arabic is selected. */
export function LocaleMirror({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const arabic = useArabicLayout();
  return (
    <div dir={arabic ? "rtl" : "ltr"} className={className}>
      {children}
    </div>
  );
}
