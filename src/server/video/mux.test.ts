/**
 * Token lifetime resolution. A misconfigured env var must not be able to mint
 * effectively permanent playback URLs.
 */
import { describe, expect, it, vi, beforeEach } from "vitest";

const { playbackTTLSeconds, playbackTTL, playbackUrl } = await import("./mux");

function setTtlEnv(seconds?: string, duration?: string) {
  vi.stubEnv("MUX_SIGNED_PLAYBACK_TTL_SECONDS", seconds ?? "");
  vi.stubEnv("MUX_PLAYBACK_TOKEN_TTL", duration ?? "");
}

beforeEach(() => {
  setTtlEnv();
});

describe("playbackTTLSeconds", () => {
  it("defaults to 30 minutes when nothing is configured", () => {
    expect(playbackTTLSeconds()).toBe(1800);
  });

  it("honours an explicit seconds value", () => {
    setTtlEnv("600");
    expect(playbackTTLSeconds()).toBe(600);
  });

  it("parses Mux-style duration strings", () => {
    setTtlEnv(undefined, "90s");
    expect(playbackTTLSeconds()).toBe(90);
    setTtlEnv(undefined, "15m");
    expect(playbackTTLSeconds()).toBe(900);
    setTtlEnv(undefined, "2h");
    expect(playbackTTLSeconds()).toBe(7200);
  });

  it("prefers the seconds value over the duration string", () => {
    setTtlEnv("300", "8h");
    expect(playbackTTLSeconds()).toBe(300);
  });

  it("clamps an excessive lifetime to 12 hours", () => {
    setTtlEnv(undefined, "30d");
    expect(playbackTTLSeconds()).toBe(43200);
  });

  it("raises an implausibly short lifetime to 60 seconds", () => {
    setTtlEnv("5");
    expect(playbackTTLSeconds()).toBe(60);
  });

  it("falls back to the default for unparseable or non-positive input", () => {
    setTtlEnv(undefined, "soon");
    expect(playbackTTLSeconds()).toBe(1800);
    setTtlEnv(undefined, "0h");
    expect(playbackTTLSeconds()).toBe(1800);
  });

  it("formats the duration string Mux expects", () => {
    setTtlEnv("600");
    expect(playbackTTL()).toBe("600s");
  });
});

describe("playbackUrl", () => {
  it("builds a signed stream URL with the token as a query parameter", () => {
    const url = new URL(playbackUrl("abc123", "signed.jwt.value"));
    expect(url.origin).toBe("https://stream.mux.com");
    expect(url.pathname).toBe("/abc123.m3u8");
    expect(url.searchParams.get("token")).toBe("signed.jwt.value");
  });
});
