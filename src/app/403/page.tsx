// file: src/app/403/page.tsx
export default function ForbiddenPage() {
    return (
      <div className="p-6 space-y-2">
        <h1 className="text-2xl font-semibold">403</h1>
        <p>Forbidden</p>
        <a className="underline" href="/dashboard">Go back</a>
      </div>
    );
  }
  