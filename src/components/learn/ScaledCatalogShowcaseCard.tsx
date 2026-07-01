"use client";

import {
  CatalogShowcaseCard,
  CATALOG_SHOWCASE_CARD_H,
  CATALOG_SHOWCASE_CARD_W,
  type CatalogShowcaseCardProps,
} from "@/components/cards";

type ScaledCatalogShowcaseCardProps = CatalogShowcaseCardProps & {
  cardW: number;
  cardH: number;
};

export function ScaledCatalogShowcaseCard({
  cardW,
  cardH,
  className = "",
  ...cardProps
}: ScaledCatalogShowcaseCardProps) {
  const scale = cardW / CATALOG_SHOWCASE_CARD_W;

  return (
    <div className="relative shrink-0" style={{ width: cardW, height: cardH }}>
      <div
        className="absolute top-0 left-0"
        style={{
          width: CATALOG_SHOWCASE_CARD_W,
          height: CATALOG_SHOWCASE_CARD_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <CatalogShowcaseCard {...cardProps} className={className} />
      </div>
    </div>
  );
}
