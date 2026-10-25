"use client";

import {
  CatalogShowcaseCard,
  CATALOG_SHOWCASE_CARD_H,
  CATALOG_SHOWCASE_CARD_W,
  type CatalogShowcaseCardProps,
} from "@/components/cards";
import { useArabicLayout } from "@/components/providers/LocaleProvider";
type ScaledCatalogShowcaseCardProps = CatalogShowcaseCardProps & {
  cardW: number;
  cardH: number;
};

export function ScaledCatalogShowcaseCard({
  cardW,
  cardH,
  className = "",
  expandCardOnHover = false,
  ...cardProps
}: ScaledCatalogShowcaseCardProps) {
  const scale = cardW / CATALOG_SHOWCASE_CARD_W;
  const arabic = useArabicLayout();
  const growLeft = expandCardOnHover && arabic;

  return (
    <div
      className="relative h-full shrink-0"
      style={{ width: expandCardOnHover ? "100%" : cardW, height: cardH }}
    >
      <div
        className={expandCardOnHover ? "featured-card-scaler absolute top-0" : "absolute top-0 left-0"}
        style={{
          left: growLeft ? "auto" : 0,
          right: growLeft ? 0 : undefined,
          width: expandCardOnHover ? undefined : CATALOG_SHOWCASE_CARD_W,
          height: CATALOG_SHOWCASE_CARD_H,
          transform: `scale(${scale})`,
          transformOrigin: growLeft ? "top right" : "top left",
        }}
      >
        <CatalogShowcaseCard {...cardProps} expandCardOnHover={expandCardOnHover} className={className} />
      </div>
    </div>
  );
}
