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
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white drop-shadow-sm sm:text-4xl lg:text-5xl">
          Subscription education for design & creative
        </h1>
        <p className="mt-5 text-lg text-slate-200 drop-shadow-sm">
          Learn from industry experts. Master your craft with courses across tracks,
          modules, and hands-on projects.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/tracks"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl"
          >
            Browse tracks
          </Link>
          <Link
            href="/subscription"
            className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
          >
            View plans
          </Link>
        </div>
      </div>
    </section>
  );
}
