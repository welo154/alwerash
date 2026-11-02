export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  // `next build` loads instrumentation while prerendering; production secrets
  // are only required once the server actually starts.
  if (process.env.NEXT_PHASE !== "phase-production-build") {
    const { assertServerEnv } = await import("@/server/env");
    assertServerEnv();
  }

  await import("@/server/db/prisma");
}
