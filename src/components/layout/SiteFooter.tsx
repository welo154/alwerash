import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-[var(--color-header-bg)] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="font-logo text-lg font-medium italic text-white transition-colors hover:text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-black rounded">
              alwerash<span className="text-[var(--color-primary)]">.</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed">
              Subscription education for design & creative. Learn from industry experts.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Learn
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/subscription" className="text-sm transition-colors hover:text-white">
                  Plans
                </Link>
              </li>
              <li>
                <Link href="/tracks" className="text-sm transition-colors hover:text-white">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-sm transition-colors hover:text-white">
                  Courses
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Account
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/login" className="text-sm transition-colors hover:text-white">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm transition-colors hover:text-white">
                  Sign up
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm transition-colors hover:text-white">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm transition-colors hover:text-white">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-700 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Alwerash. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
