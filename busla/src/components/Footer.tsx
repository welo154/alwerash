import { EVENT } from "@/lib/event";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-20 text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-3">
        <div>
          <p className="display text-3xl">Busla</p>
          <p className="mt-2 max-w-xs text-cream/70">{EVENT.tagline}</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-2 text-cream/85">
          {[
            ["About", "#about"],
            ["Activities", "#activities"],
            ["AI Mentor", "#mentor"],
            ["Schedule", "#schedule"],
            ["Register", "#register"],
            ["Contact", "#contact"],
          ].map(([l, h]) => (
            <a key={h} href={h} className="hover:text-saffron">
              {l}
            </a>
          ))}
        </nav>
        <div className="flex gap-3 md:justify-end">
          {[
            ["IG", EVENT.instagram, "bg-rose"],
            ["IN", EVENT.linkedin, "bg-sky"],
            ["TT", EVENT.tiktok, "bg-lime"],
          ].map(([l, h, c]) => (
            <a
              key={l}
              href={h}
              target="_blank"
              rel="noreferrer"
              className={`grid h-12 w-12 place-items-center rounded-full border-2 border-cream font-bold text-ink transition-transform hover:-translate-y-1 hover:rotate-12 ${c}`}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
      <div className="relative mt-16 select-none" aria-hidden>
        <p className="display whitespace-nowrap text-center text-[25vw] leading-[0.8] text-saffron">
          Busla<span className="text-brick">.</span>
        </p>
        <p className="absolute right-[6%] top-[8%] -rotate-6 rounded-full bg-rose px-4 py-1 font-[family-name:var(--font-arabic)] text-2xl text-ink sm:text-4xl">
          بوصلة
        </p>
      </div>
      <div className="border-t border-cream/15 py-5 text-center text-sm text-cream/60">
        © {new Date().getFullYear()} Busla · Hosted at {EVENT.venue}, {EVENT.area}
      </div>
    </footer>
  );
}
