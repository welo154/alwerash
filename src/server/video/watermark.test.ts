/**
 * The watermark marker must be stable, opaque, and free of personal data.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";

const { viewerWatermarkMarker, matchesWatermarkMarker } = await import("./watermark");

beforeEach(() => {
  vi.stubEnv("WATERMARK_SECRET", "test-watermark-secret");
});

describe("viewerWatermarkMarker", () => {
  it("is stable for the same user", () => {
    expect(viewerWatermarkMarker("user-1")).toBe(viewerWatermarkMarker("user-1"));
  });

  it("differs between users", () => {
    expect(viewerWatermarkMarker("user-1")).not.toBe(viewerWatermarkMarker("user-2"));
  });

  it("uses the unambiguous alphabet and fixed shape", () => {
    expect(viewerWatermarkMarker("user-1")).toMatch(/^[0-9A-HJKMNP-TV-Z]{5}-[0-9A-HJKMNP-TV-Z]{5}$/);
  });

  it("does not leak the user id or an email", () => {
    const marker = viewerWatermarkMarker("clx123abc");
    expect(marker.toLowerCase()).not.toContain("clx123abc");
    expect(marker).not.toContain("@");
  });

  it("changes when the secret changes, so markers are not guessable", () => {
    const withFirst = viewerWatermarkMarker("user-1");
    vi.stubEnv("WATERMARK_SECRET", "a-different-secret");
    expect(viewerWatermarkMarker("user-1")).not.toBe(withFirst);
  });

  it("refuses to derive a marker with no secret configured", () => {
    vi.stubEnv("WATERMARK_SECRET", "");
    vi.stubEnv("AUTH_SECRET", "");
    vi.stubEnv("NEXTAUTH_SECRET", "");
    expect(() => viewerWatermarkMarker("user-1")).toThrow();
  });
});

describe("matchesWatermarkMarker", () => {
  it("matches a marker taken from a leaked recording, case-insensitively", () => {
    const marker = viewerWatermarkMarker("user-7");
    expect(matchesWatermarkMarker("user-7", marker.toLowerCase())).toBe(true);
    expect(matchesWatermarkMarker("user-7", ` ${marker} `)).toBe(true);
  });

  it("rejects a marker belonging to another user", () => {
    expect(matchesWatermarkMarker("user-7", viewerWatermarkMarker("user-8"))).toBe(false);
  });

  it("rejects a malformed marker without throwing", () => {
    expect(matchesWatermarkMarker("user-7", "nope")).toBe(false);
  });
});
