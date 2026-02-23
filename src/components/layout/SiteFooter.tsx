import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-lg font-semibold text-white hover:text-blue-400">
              Alwerash
            </Link>
            <p className="mt-3 text-sm">
              Subscription education for design & creative. Learn from industry experts.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Learn
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/tracks" className="text-sm hover:text-white">
                  Tracks
                </Link>
              </li>
              <li>
                <Link href="/subscription" className="text-sm hover:text-white">
                  Subscription
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm hover:text-white">
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
                <Link href="/login" className="text-sm hover:text-white">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm hover:text-white">
                  Sign up
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm hover:text-white">
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
                <Link href="/" className="text-sm hover:text-white">
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
