"use client";

import { LearnClassesCarouselHeading } from "@/components/learn/LearnClassesCarouselHeading";

export function LearnTrendingClassesHeading({
  onNext,
  atEnd = false,
}: {
  onNext?: () => void;
  atEnd?: boolean;
}) {
  return (
    <LearnClassesCarouselHeading
      primary="RECENTLY"
      secondary="ADDED"
      onNext={onNext}
      atEnd={atEnd}
      nextAriaLabel="Next recently added class"
      arrowGapPx={25}
      arrowSize={47}
      className="max-[743px]:-ms-6 max-[743px]:ps-[30px] sm:max-[743px]:-ms-8 min-[744px]:max-lg:-ms-8 min-[744px]:max-lg:ps-[61px]"
      pillClassName="max-lg:bg-transparent max-lg:px-0 lg:px-[22px]"
      arrowGapClassName="max-[743px]:gap-[17px] min-[744px]:max-lg:gap-[23px] lg:gap-[25px]"
      tabletArrowSize={41}
    />
  );
}
