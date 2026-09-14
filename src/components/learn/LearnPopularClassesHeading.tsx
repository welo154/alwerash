"use client";

import { LearnClassesCarouselHeading } from "@/components/learn/LearnClassesCarouselHeading";

export function LearnPopularClassesHeading({
  onNext,
  atEnd = false,
}: {
  onNext?: () => void;
  atEnd?: boolean;
}) {
  return (
    <LearnClassesCarouselHeading
      primary="POPULAR"
      secondary="CLASSES"
      onNext={onNext}
      atEnd={atEnd}
      nextAriaLabel="Next popular class"
      arrowGapPx={25}
      arrowSize={47}
      className="max-[743px]:-ml-6 max-[743px]:pl-[30px] sm:max-[743px]:-ml-8 min-[744px]:max-lg:-ml-8 min-[744px]:max-lg:pl-[61px]"
      pillClassName="max-lg:bg-transparent max-lg:px-0 lg:px-[22px]"
      arrowGapClassName="max-[743px]:gap-[17px] min-[744px]:max-lg:gap-[23px] lg:gap-[25px]"
      tabletArrowSize={41}
    />
  );
}
