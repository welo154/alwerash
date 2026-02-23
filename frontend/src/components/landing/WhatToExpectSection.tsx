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
    <section className="border-b border-slate-200 bg-slate-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          What to expect from our courses
        </h2>
        <p className="mt-2 text-center text-slate-600">
          A learning experience designed for creative professionals
        </p>
        <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:gap-6">
          {items.map(({ title, description }) => (
            <div
              key={title}
              className="rounded-lg border border-slate-200 bg-white p-6"
            >
              <h3 className="font-semibold text-blue-600">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
