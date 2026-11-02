const WORDS = [
  "Engineering",
  "Medicine",
  "Computer Science",
  "Law",
  "Architecture",
  "Business",
  "Design",
  "Media & Film",
  "Psychology",
  "Pharmacy",
  "AI & Data",
  "Economics",
];

function Row({ reverse = false, className = "" }: { reverse?: boolean; className?: string }) {
  const items = [...WORDS, ...WORDS];
  return (
    <div className={`flex w-max ${reverse ? "animate-marquee-rev" : "animate-marquee"} ${className}`}>
      {items.map((w, i) => (
        <span key={i} className="flex items-center gap-6 pr-6">
          <span className={i % 3 === 1 ? "serif-i" : "display"}>{w}</span>
          <span aria-hidden className="text-[0.6em]">✦</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <section aria-label="Majors you can explore" className="relative z-10 -my-6 overflow-hidden py-10">
      <div className="-rotate-2 border-y-2 border-ink bg-ink py-4 text-4xl text-saffron sm:text-5xl">
        <Row />
      </div>
      <div className="-mt-3 rotate-1 border-y-2 border-ink bg-rose py-3 text-2xl text-ink sm:text-3xl">
        <Row reverse />
      </div>
    </section>
  );
}
