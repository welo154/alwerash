"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { BUNDLES } from "@/lib/subscription-plans";
import { subscribeWithBundle } from "./actions";

function SubscriptionContent() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const message = searchParams.get("message");
  const error = searchParams.get("error");
  const isLoggedIn = status === "authenticated" && !!session?.user;

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-20">
        {/* Hero block */}
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">
            One subscription, all courses
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-5xl">
            Learn without limits
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--color-text-muted)]">
            Get full access to every track and course. Pick the plan that fits your pace —
            you can switch or cancel anytime.
          </p>
        </div>

        {message === "subscribe" && (
          <div className="mx-auto mt-8 max-w-xl rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary-light)] p-4 text-sm text-black">
            Sign in and subscribe to access all courses.
          </div>
        )}

        {error === "invalid" && (
          <div className="mx-auto mt-8 max-w-xl rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
            Invalid bundle. Please try again.
          </div>
        )}

        {/* Bundle cards */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {BUNDLES.map((bundle) => (
            <div
              key={bundle.id}
              className={`relative flex flex-col rounded-[24px] border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                bundle.popular
                  ? "border-[var(--color-primary)] bg-gray-200 ring-2 ring-[var(--color-primary)]/30"
                  : "border-gray-100 bg-gray-200"
              }`}
            >
              {bundle.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-black px-4 py-1 text-xs font-semibold text-white shadow-md">
                  Most popular
                </span>
              )}
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-400/80 text-xl text-white">
                  {bundle.durationMonths >= 12 ? "🎯" : bundle.durationMonths >= 6 ? "⚡" : "✨"}
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight text-black">
                  {bundle.name}
                </h3>
              </div>
              <div className="mt-6 rounded-xl bg-gray-200 p-4">
                <span className="text-3xl font-bold text-black">
                  {bundle.price.toLocaleString()}
                </span>
                <span className="text-[var(--color-text-muted)]">
                  {" "}{bundle.currency}
                  {" "}/ {bundle.durationMonths} month{bundle.durationMonths > 1 ? "s" : ""}
                </span>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {bundle.pricePerMonth} EGP/month
                </p>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {bundle.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-black">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-black">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {isLoggedIn ? (
                <>
                  <form action={subscribeWithBundle} className="mt-6">
                    <input type="hidden" name="bundleId" value={bundle.id} />
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-black py-3.5 font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                    >
                      Subscribe now
                    </button>
                  </form>
                  <p className="mt-3 text-center text-xs text-[var(--color-text-muted)]">
                    Free access for now — payment later
                  </p>
                </>
              ) : (
                <>
                  <Link
                    href={`/login?next=${encodeURIComponent("/subscription")}`}
                    className="mt-6 block w-full rounded-xl bg-black py-3.5 text-center font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                  >
                    Sign in to subscribe
                  </Link>
                  <p className="mt-3 text-center text-xs text-[var(--color-text-muted)]">
                    You need to sign in to subscribe
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Promo + What you get */}
        <div className="mt-16 grid gap-8 lg:grid-cols-5">
          <div className="rounded-[24px] border border-gray-100 bg-gray-200 p-6 shadow-sm lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-black">
              Promo code
            </h3>
            <div className="mt-3 flex gap-2">
              <input
                id="promo"
                type="text"
                placeholder="Enter code"
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-black outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
              />
              <button
                type="button"
                className="rounded-xl border border-black bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-slate-100"
              >
                Apply
              </button>
            </div>
          </div>
          <div className="rounded-[24px] border border-gray-100 bg-gray-200 p-6 shadow-sm lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-black">
              What you get
            </h3>
            <p className="mt-3 text-black">
              Full access to all tracks and courses. No single-course purchase.
              Cancel anytime — access until period end.
            </p>
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-[var(--color-text-muted)]">
          Questions?{" "}
          <Link href="/" className="font-medium text-black underline decoration-[var(--color-primary)] underline-offset-2 hover:text-[var(--color-primary)]">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-500">Loading...</div>}>
      <SubscriptionContent />
    </Suspense>
  );
}
