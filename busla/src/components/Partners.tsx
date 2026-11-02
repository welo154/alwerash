import { Reveal } from "./Reveal";

const SLOTS = ["Public universities", "Private universities", "International branch campuses", "Tech & industry", "Medical schools", "Art & design schools"];
const COLORS = ["hover:bg-saffron", "hover:bg-sky", "hover:bg-lime", "hover:bg-rose", "hover:bg-brick hover:text-cream", "hover:bg-nile hover:text-cream"];

export function Partners() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="card-pop overflow-hidden rounded-[2.5rem] bg-cream">
        <div className="grid lg:grid-cols-[1fr_1.4fr]">
          <div className="border-b-2 border-ink bg-saffron p-8 sm:p-12 lg:border-b-0 lg:border-r-2">
            <Reveal>
              <p className="eyebrow">Universities & partners</p>
              <h2 className="display mt-4 text-4xl sm:text-6xl">Your booth is waiting.</h2>
              <p className="mt-5 text-lg">
                Meet 1,500 motivated students and their families in one room. Exhibitor packs, taster-lab slots and
                sponsorship tiers are open now.
              </p>
              <a href="#contact" className="btn mt-8 bg-ink text-cream">
                Partner with Busla <span aria-hidden>→</span>
              </a>
            </Reveal>
          </div>
          <ul className="-mb-[2px] -mr-[2px] grid grid-cols-2 sm:grid-cols-3">
            {SLOTS.map((s, i) => (
              <li
                key={s}
                className={`flex min-h-36 items-center justify-center border-b-2 border-r-2 border-ink p-6 text-center font-bold transition-colors duration-300 ${COLORS[i]}`}>
                <span>
                  <span className="mb-2 block text-2xl" aria-hidden>
                    ◎
                  </span>
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
