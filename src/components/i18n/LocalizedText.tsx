"use client";

import { useArabicLayout } from "@/components/providers/LocaleProvider";

export function localizedText(isArabic: boolean, english: string, arabic?: string | null) {
  const translated = arabic?.trim();
  return isArabic && translated ? translated : english;
}

export function useLocalizedText(english: string, arabic?: string | null) {
  return localizedText(useArabicLayout(), english, arabic);
}

export function LocalizedText({
  en,
  ar,
  uppercase = false,
  className,
}: {
  en: string;
  ar?: string | null;
  uppercase?: boolean;
  className?: string;
}) {
  const isArabic = useArabicLayout();
  const text = localizedText(isArabic, en, ar);
  return <span className={className}>{!isArabic && uppercase ? text.toUpperCase() : text}</span>;
}
