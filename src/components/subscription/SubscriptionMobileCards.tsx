"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { ChoosePlanForm } from "@/components/subscription/ChoosePlanForm";
import { PRICING_FEATURES } from "@/components/subscription/SubscriptionPricingCard";
import { pangeaFontFamily } from "@/lib/fonts/pangea";
import type { SubscriptionPlanId } from "@/lib/subscription-plans";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans";

const CARD_W = 319;
const CARD_H = 579;
const PRICE_TOP = 95;
const PRICE_SIZE = 48;
const INNER_TOP = PRICE_TOP + PRICE_SIZE + 18;
const INNER_H = CARD_H - INNER_TOP;

const FEATURE_ACCENT = "#EA83F0";

function MobileFeatureIcon({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={38.83}
      height={38.83}
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

function MobilePricingCard({
  name,
  price,
  planId,
  accentFeatureCount,
}: {
  name: string;
  price: number;
  planId: SubscriptionPlanId;
  accentFeatureCount: number;
}) {
  return (
    <article
      className="subscription-mobile-card relative bg-white"
      style={{
        width: CARD_W,
        height: CARD_H,
        borderRadius: 50,
        border: "1px solid #000",
        boxSizing: "border-box",
      }}
    >
      <h3
        className="m-0"
        style={{
          position: "absolute",
          left: 24,
          top: 33,
          color: "#000",
          fontFamily: pangeaFontFamily,
          fontSize: 24,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        }}
      >
        {name}
      </h3>
      <p
        className="m-0"
        style={{
          position: "absolute",
          left: 24,
          top: 66,
          color: "#000",
          fontFamily: pangeaFontFamily,
          fontSize: 16,
          fontStyle: "normal",
          fontWeight: 400,
          opacity: 0.6,
        }}
      >
        Perfect to get started
      </p>
      <div
        className="m-0 flex items-start"
        style={{
          position: "absolute",
          left: 24,
          top: 95,
        }}
      >
        <span
          style={{
            color: "#000",
            fontFamily: pangeaFontFamily,
            fontSize: 48,
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "normal",
          }}
        >
          {price}
        </span>
        <span
          style={{
            color: "#000",
            fontFamily: pangeaFontFamily,
            fontSize: 48,
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          }}
        >
          EGP
        </span>
      </div>
      <span
        style={{
          position: "absolute",
          left: 197,
          top: 124,
          color: "#000",
          fontFamily: pangeaFontFamily,
          fontSize: 20,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        }}
      >
        /month
      </span>

      <div
        className="absolute bg-white"
        style={{
          left: 0,
          right: 0,
          bottom: 0,
          height: INNER_H,
          boxSizing: "border-box",
          borderRadius: 50,
          borderTop: "1px solid #000",
          borderRight: "1px solid #000",
          borderBottom: "1px solid #000",
          borderLeft: "1px solid rgba(0, 0, 0, 0.5)",
        }}
      />

      <div
        className="absolute"
        style={{
          left: 31,
          top: 216,
          display: "flex",
          flexDirection: "column",
          gap: 27,
        }}
      >
        {PRICING_FEATURES.map((feature, index) => (
          <div key={feature} className="flex items-start">
            <MobileFeatureIcon
              color={index < accentFeatureCount ? FEATURE_ACCENT : "#000"}
            />
            <p
              className="m-0"
              style={{
                marginLeft: 27.58,
                width: 191,
                color: "#000",
                fontFamily: pangeaFontFamily,
                fontSize: 16,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "127%",
              }}
            >
              {feature}
            </p>
          </div>
        ))}
      </div>

      <p
        className="m-0"
        style={{
          position: "absolute",
          left: 45.414,
          bottom: 96,
          color: "#000",
          fontFamily: pangeaFontFamily,
          fontSize: 16,
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "127%",
          opacity: 0.6,
        }}
      >
        All the essentials to build a portfolio
      </p>

      <div
        className="subscription-mobile-choose"
        style={{
          position: "absolute",
          left: 77.414,
          bottom: 28,
          width: 178,
          height: 53,
        }}
      >
        <ChoosePlanForm planId={planId} accentChooseButton={false} />
      </div>
    </article>
  );
}

export function SubscriptionMobileCards() {
  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={15}
      slidesPerGroup={1}
      centeredSlides
      speed={400}
      grabCursor
      allowTouchMove
      simulateTouch
      className="subscription-mobile-swiper w-full"
    >
      {SUBSCRIPTION_PLANS.map((plan) => (
        <SwiperSlide key={plan.id} className="!w-[319px] self-center">
          <MobilePricingCard
            name={plan.name}
            price={plan.price}
            planId={plan.id}
            accentFeatureCount={plan.accentFeatureCount}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
