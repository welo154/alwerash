/**
 * Test Mux configuration.
 * Run: npx tsx scripts/test-mux-config.ts
 */
import { config } from "dotenv";
import { resolve } from "path";

// Load .env and .env.local (Next.js style)
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

const tokenId = process.env.MUX_TOKEN_ID?.trim() ?? "";
const tokenSecret = process.env.MUX_TOKEN_SECRET?.trim() ?? "";

console.log("Mux configuration check:");
console.log("  MUX_TOKEN_ID:", tokenId ? `${tokenId.slice(0, 8)}...` : "(missing)");
console.log("  MUX_TOKEN_SECRET:", tokenSecret ? "***" : "(missing)");

if (!tokenId || !tokenSecret) {
  console.error("\n❌ Missing MUX_TOKEN_ID or MUX_TOKEN_SECRET in .env");
  process.exit(1);
}

async function testMuxApi() {
  const Mux = (await import("@mux/mux-node")).default;
  const mux = new Mux({ tokenId, tokenSecret });

  try {
    const assets = await mux.video.assets.list({ limit: 1 });
    console.log("\n✅ Mux API connected. Assets endpoint OK.");
    return;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("401") || msg.includes("Unauthorized")) {
      console.error("\n❌ Invalid Mux credentials (401). Check MUX_TOKEN_ID and MUX_TOKEN_SECRET.");
    } else {
      console.error("\n❌ Mux API error:", msg);
    }
    process.exit(1);
  }
}

testMuxApi();
