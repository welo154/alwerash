import Link from "next/link";
import Image from "next/image";

// Workspace / learning scene — no people
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1471&auto=format&fit=crop";

export function HeroSection() {
  return (
    <section className="relative border-b border-slate-200 overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          className="object-cover opacity-35"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/85 via-slate-900/60 to-slate-900/90" />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24 animate-fade-in-up" data-gsap-hero>
        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md sm:text-4xl lg:text-5xl lg:leading-tight">
          Subscription education for design & creative
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-200/95 drop-shadow-sm max-w-2xl mx-auto">
          Learn from industry experts. Master your craft with courses across tracks,
          modules, and hands-on projects.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/tracks"
            className="btn-primary rounded-xl bg-blue-600 px-6 py-3.5 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            data-gsap-btn
          >
            Browse tracks
          </Link>
          <Link
            href="/subscription"
            className="rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-slate-900"
            data-gsap-btn
          >
            View plans
          </Link>
        </div>
      </div>
    </section>
  );
}
