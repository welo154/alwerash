export function ArabicNameField({
  name = "titleAr",
  label = "Arabic name",
  defaultValue = "",
  placeholder = "الاسم بالعربية",
}: {
  name?: string;
  label?: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        dir="rtl"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
      />
    </div>
  );
}
