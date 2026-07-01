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
    />
  );
}
