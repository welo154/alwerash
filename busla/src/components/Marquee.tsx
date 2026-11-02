const TOP = ["New Capital", "Limited seats", "Free to register", "13 Feb 2027", "Seven Pillars School", "Grades 9–12"];
const BOTTOM = ["Taster labs", "Simulations", "Mentoring", "University fair", "Talks", "Maker yard", "Compass AI"];

function Tape({ words, reverse, className }: { words: string[]; reverse?: boolean; className: string }) {
  const items = [...words, ...words, ...words, ...words];
  return (
    <div className={`border-y-4 border-ink py-4 ${className}`}>
      <div className={`flex w-max ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}>
        {items.map((w, i) => (
          <span key={i} className="display flex items-center gap-7 pr-7 pt-1 text-4xl sm:text-6xl">
            {w}
            <span aria-hidden className="text-[0.55em]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Two crossing hazard-tape banners, straight from the mood board. */
export function Marquee() {
  return (
    <section aria-label="Event highlights" className="relative z-10 overflow-hidden border-y-4 border-ink bg-rose py-14 sm:py-20">
      <Tape words={TOP} className="-mx-10 -rotate-[4deg] bg-ink text-saffron" />
      <Tape words={BOTTOM} reverse className="-mx-10 -mt-2 rotate-[2.5deg] bg-lime text-ink" />
    </section>
  );
}
