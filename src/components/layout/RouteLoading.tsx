/** Shown by route `loading.tsx` files so a click swaps pages before the server data arrives. */
export function RouteLoading({ variant = "page" }: { variant?: "page" | "cards" }) {
  return (
    <div className="min-h-screen bg-white px-6 pt-10 lg:px-[120px]" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-100" />
      <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-slate-100" />
      {variant === "cards" ? (
        <div className="mt-10 flex flex-wrap gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[300px] w-[315px] animate-pulse rounded-[50px] bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="mt-10 aspect-video w-full max-w-5xl animate-pulse rounded-3xl bg-slate-100" />
      )}
    </div>
  );
}
