"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type SiteLocale = "en" | "ar";

const STORAGE_KEY = "alwerash-locale";

type LocaleContextValue = {
  locale: SiteLocale;
  toggleLocale: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<SiteLocale>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "ar" || stored === "en") {
      setLocale(stored);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale, ready]);

  const toggleLocale = useCallback(() => {
    setLocale((current) => (current === "en" ? "ar" : "en"));
  }, []);

  const value = useMemo(() => ({ locale, toggleLocale }), [locale, toggleLocale]);

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
