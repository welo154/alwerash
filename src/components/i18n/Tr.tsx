"use client";

import { useCallback } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { translateUi } from "@/lib/i18n/dictionary";

export function useT() {
  const { locale } = useLocale();
  return useCallback((text: string) => translateUi(locale, text), [locale]);
}

/** Translates a UI string when Arabic is selected. */
export function Tr({ children }: { children: string }) {
  const t = useT();
  return t(children);
}
