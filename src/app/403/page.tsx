// file: src/app/403/page.tsx
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-semibold">403</h1>
      <p>Forbidden</p>
      <Link className="underline" href="/">
        Go to home
      </Link>
    </div>
  );
}
