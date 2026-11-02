import { EVENT } from "@/lib/event";
import { Reveal } from "./Reveal";

export function Venue() {
  const q = encodeURIComponent(EVENT.mapQuery);
  return (
    <section id="venue" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Reveal className="card-pop flex flex-col rounded-[2rem] bg-ink p-8 text-cream sm:p-10">
          <p className="eyebrow text-lime">Venue</p>
          <h2 className="display mt-3 text-5xl">{EVENT.venue}</h2>
          <p className="mt-2 text-lg text-cream/80">{EVENT.area}</p>
          <dl className="mt-8 space-y-5">
            {[
              ["Shuttles", "Free buses from central Cairo meeting points. Routes are sent to registered guests a week before."],
              ["By car", "Parking on site. Follow signs for Busla from the school's main gate."],
              ["Access", "Step-free routes to every zone. Tell us in advance if you need help on the day."],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-bold text-saffron">{k}</dt>
                <dd className="mt-1 text-cream/85">{v}</dd>
              </div>
            ))}
          </dl>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${q}`}
            target="_blank"
            rel="noreferrer"
            className="btn mt-auto self-start bg-lime text-ink"
            style={{ marginTop: "2rem" }}
          >
            Get directions ↗
          </a>
        </Reveal>
        <Reveal delay={0.1} className="card-pop relative min-h-[22rem] overflow-hidden rounded-[2rem] bg-sky">
          <iframe
            title={`Map of ${EVENT.venue}`}
            src={`https://www.google.com/maps?q=${q}&output=embed`}
            className="absolute inset-0 h-full w-full grayscale-[0.4] contrast-[1.05]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </section>
  );
}
