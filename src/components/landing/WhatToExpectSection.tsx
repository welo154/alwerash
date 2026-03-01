export function WhatToExpectSection() {
  const items = [
    {
      title: "Structured learning",
      description:
        "Clear tracks, modules, and lessons. Progress at your own pace with a path designed by experts.",
    },
    {
      title: "Hands-on projects",
      description:
        "Apply what you learn with assignments and projects. Get feedback and build a portfolio.",
    },
    {
      title: "Expert instructors",
      description:
        "Learn from practitioners with real-world experience. Access instructor profiles and community.",
    },
  ];

  return (
    <section className="border-b border-slate-200/80 bg-slate-50 px-4 py-16 sm:px-6" data-gsap-reveal>
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          What to expect from our courses
        </h2>
        <p className="mt-2.5 text-center text-slate-600 leading-relaxed">
          A learning experience designed for creative professionals
        </p>
        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:gap-6" data-gsap-stagger-group>
          {items.map(({ title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]"
            >
              <h3 className="font-semibold text-[var(--color-primary)]">{title}</h3>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
