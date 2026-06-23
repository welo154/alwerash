import type { ReactNode } from "react";
import { ChoosePlanForm } from "@/components/subscription/ChoosePlanForm";
import { pangeaFontFamily } from "@/lib/fonts/pangea";
import type { SubscriptionPlanId } from "@/lib/subscription-plans";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans";
const CARD_W = 390;
const CARD_H = 602;
const INNER_CARD_H = 379;
const OUTER_PADDING = 33;
const OUTER_TOP_H = CARD_H - INNER_CARD_H;
const INNER_PADDING_X = 41;
const INNER_PADDING_TOP = 40;
const FEATURE_GAP = 15;
const FEATURE_ICON_TEXT_GAP = 27;

const cardShellStyle = {
  width: CARD_W,
  height: CARD_H,
  borderRadius: 50,
  border: "1px solid var(--Black, #000)",
  background: "#FFF",
} as const;

const innerCardStyle = {
  height: INNER_CARD_H,
  borderRadius: 50,
  borderTop: "1px solid #000",
  borderRight: "1px solid #000",
  borderBottom: "1px solid #000",
  borderLeft: "1px solid rgba(0, 0, 0, 0.5)",
  background: "#FFF",
} as const;

const featureTextStyle = {
  width: 240,
  color: "#000",
  fontFamily: pangeaFontFamily,
  fontSize: 18,
  fontStyle: "normal" as const,
  fontWeight: 400,
  lineHeight: "127%",
};

const FEATURE_ACCENT_COLOR = "#EA83F0";
const FEATURE_DEFAULT_COLOR = "#000";

function FeatureCheckIcon({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      className="shrink-0"
      aria-hidden
    >
      <circle cx="20" cy="20" r="19" stroke={color} strokeWidth="2" />
      <path
        d="M30 14L15.5625 28L9 21.6364"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PricingCardFeatures({
  features,
  accentFeatureCount,
  planId,
  accentChooseButton = false,
}: {
  features: string[];
  accentFeatureCount: number;
  planId: SubscriptionPlanId;
  accentChooseButton?: boolean;
}) {  return (
    <div
      style={{
        padding: `${INNER_PADDING_TOP}px ${INNER_PADDING_X}px 0`,
      }}
    >
      <ul
        className="m-0 list-none p-0"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: FEATURE_GAP,
        }}
      >
        {features.map((feature, index) => (
          <li key={feature} className="flex items-start">
            <FeatureCheckIcon
              color={index < accentFeatureCount ? FEATURE_ACCENT_COLOR : FEATURE_DEFAULT_COLOR}
            />
            <span style={{ ...featureTextStyle, marginLeft: FEATURE_ICON_TEXT_GAP }}>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center" style={{ marginTop: 36 }}>
        <p
          className="m-0 text-center"
          style={{
            color: "#000",
            fontFamily: pangeaFontFamily,
            fontSize: 18,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "127%",
            opacity: 0.6,
          }}
        >
          All the essentials to build a portfolio
        </p>

        <ChoosePlanForm planId={planId} accentChooseButton={accentChooseButton} />      </div>
    </div>
  );
}
function PricingCardHeader({
  title,
  price,
  popular = false,
}: {
  title: string;
  price: number;
  popular?: boolean;
}) {
  return (
    <>
      <div className={`m-0 flex items-center ${popular ? "justify-between" : ""}`}>
        <h3
          className="m-0"
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFontFamily,
            fontSize: 32,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          {title}
        </h3>
        {popular ? (
          <span
            className="inline-flex shrink-0 items-center justify-center"
            style={{
              height: 36,
              padding: "0 16px",
              borderRadius: "var(--Radius-MD, 8px)",
              border: "1px solid var(--Black, #000)",
              background: "#EA83F0",
              color: "var(--Text-Primary, #141413)",
              textAlign: "center",
              fontFamily: pangeaFontFamily,
              fontSize: 18,
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "var(--Line-height-Heading-sm, 19.6px)",
            }}
          >
            Popular
          </span>
        ) : null}
      </div>
      <p
        className="m-0"
        style={{
          marginTop: 8,
          color: "#000",
          fontFamily: pangeaFontFamily,
          fontSize: 18,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "127%",
          opacity: 0.6,
        }}
      >
        Perfect to get started
      </p>
      <div className="m-0 flex items-start" style={{ marginTop: 16 }}>
        <span
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFontFamily,
            fontSize: 70,
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "normal",
          }}
        >
          {price}
        </span>
        <span
          style={{
            color: "var(--Black, #000)",
            fontFamily: pangeaFontFamily,
            fontSize: 70,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          EGP
        </span>
        <span
          style={{
            marginLeft: 7,
            marginTop: 20,
            color: "var(--Black, #000)",
            fontFamily: pangeaFontFamily,
            fontSize: 24,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          /month
        </span>
      </div>
    </>
  );
}

export function SubscriptionPricingCard({
  header,
  features,
  planId,
  accentFeatureCount,
  accentChooseButton = false,
}: {
  header?: ReactNode;
  features: string[];
  planId: SubscriptionPlanId;
  accentFeatureCount: number;
  accentChooseButton?: boolean;
}) {  return (
    <article className="relative shrink-0 box-border" style={cardShellStyle}>
      <div
        className="relative z-1 box-border overflow-visible"
        style={{
          height: OUTER_TOP_H,
          padding: OUTER_PADDING,
        }}
      >
        {header}
      </div>

      <div
        className="absolute -bottom-px -left-px -right-px z-1 box-border"
        style={innerCardStyle}
      >
        <PricingCardFeatures
          features={features}
          planId={planId}
          accentFeatureCount={accentFeatureCount}
          accentChooseButton={accentChooseButton}
        />      </div>
    </article>
  );
}

const PRICING_FEATURES = [
  "Thousands of creative classes. Beginner to pro.",
  "Curated, sequential classes to help you meet a goal.",
  "Book time for personalized feedback with a teacher.",
];

export function SubscriptionPricingCards() {
  return (
    <div className="flex gap-[25px]">
      {SUBSCRIPTION_PLANS.map((plan) => (
        <SubscriptionPricingCard
          key={plan.id}
          planId={plan.id}
          header={
            <PricingCardHeader title={plan.name} price={plan.price} popular={plan.popular} />
          }
          features={PRICING_FEATURES}
          accentFeatureCount={plan.accentFeatureCount}
          accentChooseButton={plan.accentChooseButton}
        />
      ))}
    </div>
  );
}