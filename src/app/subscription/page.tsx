"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { BUNDLES } from "@/lib/subscription-plans";
import { subscribeWithBundle } from "./actions";

function SubscriptionContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const error = searchParams.get("error");

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with soul */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
      <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />
      <div className="absolute bottom-40 left-0 h-72 w-72 rounded-full bg-indigo-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-20">
        {/* Hero block */}
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-blue-600">
            One subscription, all courses
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Learn without limits
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Get full access to every track and course. Pick the plan that fits your pace — 
            you can switch or cancel anytime.
          </p>
        </div>

        {message === "subscribe" && (
          <div className="mx-auto mt-8 max-w-xl rounded-xl border border-blue-200 bg-blue-50/90 p-4 text-sm text-blue-800 shadow-sm backdrop-blur-sm">
            Sign in and subscribe to access all courses.
          </div>
        )}

        {error === "invalid" && (
          <div className="mx-auto mt-8 max-w-xl rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-800 shadow-sm">
            Invalid bundle. Please try again.
          </div>
        )}

        {/* Bundle cards */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {BUNDLES.map((bundle) => (
            <div
              key={bundle.id}
              className={`card-hover relative flex flex-col rounded-2xl border-2 p-6 shadow-lg transition-all duration-300 ${
                bundle.popular
                  ? "border-blue-500 bg-white shadow-blue-200/30 ring-2 ring-blue-500/20"
                  : "border-slate-200/80 bg-white/90 backdrop-blur-sm"
              }`}
            >
              {bundle.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white shadow-md">
                  Most popular
                </span>
            )}
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl">
                  {bundle.durationMonths >= 12 ? "🎯" : bundle.durationMonths >= 6 ? "⚡" : "✨"}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {bundle.name}
                </h3>
              </div>
              <div className="mt-6 rounded-xl bg-slate-50/80 p-4">
                <span className="text-3xl font-bold text-slate-900">
                  {bundle.price.toLocaleString()}
                </span>
                <span className="text-slate-500">
                  {" "}{bundle.currency}
                  {" "}/ {bundle.durationMonths} month{bundle.durationMonths > 1 ? "s" : ""}
                </span>
                <p className="mt-1 text-sm text-slate-600">
                  {bundle.pricePerMonth} EGP/month
                </p>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {bundle.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <form action={subscribeWithBundle} className="mt-6">
                <input type="hidden" name="bundleId" value={bundle.id} />
                <button
                  type="submit"
                  className={`w-full rounded-xl py-3.5 font-semibold shadow-md transition-all duration-200 hover:shadow-lg ${
                    bundle.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border-2 border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  Subscribe now
                </button>
              </form>
              <p className="mt-3 text-center text-xs text-slate-500">
                Free access for now — payment later
              </p>
            </div>
          ))}
        </div>

        {/* Promo + What you get */}
        <div className="mt-16 grid gap-8 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Promo code
            </h3>
            <div className="mt-3 flex gap-2">
              <input
                id="promo"
                type="text"
                placeholder="Enter code"
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                className="rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-300"
              >
                Apply
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              What you get
            </h3>
            <p className="mt-3 text-slate-700">
              Full access to all tracks and courses. No single-course purchase.
              Cancel anytime — access until period end.
            </p>
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-slate-500">
          Questions?{" "}
          <Link href="/" className="font-medium text-blue-600 hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <SubscriptionContent />
    </Suspense>
  );
}
