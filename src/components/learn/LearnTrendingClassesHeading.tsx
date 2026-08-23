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
      className="max-lg:-ml-6 max-lg:pl-[30px] sm:max-lg:-ml-8"
      pillClassName="max-lg:bg-transparent max-lg:px-0 lg:px-[22px]"
      arrowGapClassName="gap-[17px] lg:gap-[25px]"
    />
  );
}
