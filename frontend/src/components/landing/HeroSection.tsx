import Link from "next/link";

export function HeroSection() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Subscription education for design & creative
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Learn from industry experts. Master your craft with courses across tracks,
          modules, and hands-on projects.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/tracks"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Browse tracks
          </Link>
          <Link
            href="/subscription"
            className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            View plans
          </Link>
        </div>
      </div>
    </section>
  );
}
