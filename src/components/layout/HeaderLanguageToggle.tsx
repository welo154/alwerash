"use client";

import { useLocale } from "@/components/providers/LocaleProvider";

export function HeaderLanguageToggle({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { locale, toggleLocale } = useLocale();
  const onGreenBar = tone === "light";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={locale === "en" ? "Switch to Arabic" : "Switch to English"}
      className="relative flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full border text-[20px] font-normal leading-[100%] tracking-[0]"
      style={{
        fontFamily: "Inter, var(--font-dm-sans), sans-serif",
        color: onGreenBar ? "#fff" : "#000",
        borderColor: onGreenBar ? "rgb(255 255 255 / 40%)" : "rgb(0 0 0 / 40%)",
      }}
    >
      {locale === "en" ? (
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{
            color: "var(--Black, #000)",
            fontFamily: "Inter",
            fontSize: 20,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          ع
        </span>
      ) : (
        "EN"
      )}
    </button>
  );
}
