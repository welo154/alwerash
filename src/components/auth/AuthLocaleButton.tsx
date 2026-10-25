"use client";

import type { CSSProperties, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export function AuthLocaleButton({
  className,
  style,
  chevron,
}: {
  className?: string;
  style?: CSSProperties;
  chevron?: ReactNode;
}) {
  const { locale, toggleLocale } = useLocale();
  const label = locale === "en" ? "العربية" : "English";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={locale === "en" ? "Switch to Arabic" : "Switch to English"}
      className={className}
      style={{ borderRadius: 30, ...style }}
      suppressHydrationWarning
    >
      {label}
      {chevron ?? <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />}
    </button>
  );
}
