const POOL_MARKERS = [
  "EMAXCONNSESSION",
  "max clients reached",
  "session mode",
  "pool_size",
  "PrismaClientUnknownRequestError",
];

function textOf(value: unknown, depth = 0): string {
  if (value == null || depth > 5) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Error) {
    const extra = value as Error & { cause?: unknown };
    return `${value.name} ${value.message} ${value.stack ?? ""} ${textOf(extra.cause, depth + 1)}`;
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export function isPoolExhaustedText(text: string): boolean {
  return POOL_MARKERS.some((marker) => text.includes(marker));
}

const g = globalThis as unknown as { __alwerashSilencedPoolErrors?: boolean };

/** Keep this filter on console.error even after Next.js replaces the function. */
export function silencePoolErrors(): void {
  if (g.__alwerashSilencedPoolErrors) return;
  g.__alwerashSilencedPoolErrors = true;

  let errorSink: typeof console.error = console.error.bind(console);
  const filteredError: typeof console.error = (...args: Parameters<typeof console.error>) => {
    const text = args.map((arg) => textOf(arg)).join(" ");
    if (isPoolExhaustedText(text)) return;
    errorSink(...args);
  };

  Object.defineProperty(console, "error", {
    configurable: true,
    enumerable: true,
    get() {
      return filteredError;
    },
    set(next: typeof console.error) {
      errorSink = next.bind(console);
    },
  });

  const stderrWrite = process.stderr.write.bind(process.stderr);
  process.stderr.write = ((chunk: unknown, ...rest: unknown[]) => {
    const text = typeof chunk === "string" ? chunk : textOf(chunk);
    if (isPoolExhaustedText(text)) return true;
    return (stderrWrite as (chunk: unknown, ...rest: unknown[]) => boolean)(chunk, ...rest);
  }) as typeof process.stderr.write;
}
