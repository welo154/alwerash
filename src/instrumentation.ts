export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { silencePoolErrors } = await import("@/server/db/silence-pool-errors");
    silencePoolErrors();
    await import("@/server/db/prisma");
  }
}
