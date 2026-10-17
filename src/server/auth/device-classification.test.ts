/**
 * Device classification decides which slot a sign-in occupies, so a phone must
 * never be misread as a computer (that would let one student hold both slots on
 * two phones).
 */
import { describe, expect, it } from "vitest";
import {
  classifyDeviceKind,
  clientIpFromHeaders,
  describeDevice,
  hashClientIp,
} from "./device-classification";

const UA = {
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  androidPhone:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
  androidTablet:
    "Mozilla/5.0 (Linux; Android 13; SM-X900) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Tablet",
  ipad:
    "Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  windowsChrome:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  macSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  linuxFirefox: "Mozilla/5.0 (X11; Linux x86_64; rv:127.0) Gecko/20100101 Firefox/127.0",
  chromebook:
    "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  edge:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
  curl: "curl/8.4.0",
};

describe("classifyDeviceKind", () => {
  it("classifies phones as MOBILE", () => {
    expect(classifyDeviceKind(UA.iphone)).toBe("MOBILE");
    expect(classifyDeviceKind(UA.androidPhone)).toBe("MOBILE");
  });

  it("counts tablets as MOBILE so a phone plus a tablet cannot take both slots", () => {
    expect(classifyDeviceKind(UA.ipad)).toBe("MOBILE");
    expect(classifyDeviceKind(UA.androidTablet)).toBe("MOBILE");
  });

  it("classifies desktops and laptops as COMPUTER", () => {
    expect(classifyDeviceKind(UA.windowsChrome)).toBe("COMPUTER");
    expect(classifyDeviceKind(UA.macSafari)).toBe("COMPUTER");
    expect(classifyDeviceKind(UA.linuxFirefox)).toBe("COMPUTER");
    expect(classifyDeviceKind(UA.chromebook)).toBe("COMPUTER");
    expect(classifyDeviceKind(UA.edge)).toBe("COMPUTER");
  });

  it("defaults unknown or missing agents to COMPUTER", () => {
    // Defaulting to MOBILE would let a scripted client squat the more commonly
    // shared slot.
    expect(classifyDeviceKind(UA.curl)).toBe("COMPUTER");
    expect(classifyDeviceKind(null)).toBe("COMPUTER");
    expect(classifyDeviceKind("")).toBe("COMPUTER");
    expect(classifyDeviceKind("   ")).toBe("COMPUTER");
  });
});

describe("describeDevice", () => {
  it("summarizes browser and platform", () => {
    expect(describeDevice(UA.windowsChrome)).toBe("Chrome on Windows");
    expect(describeDevice(UA.iphone)).toBe("Safari on iPhone");
    expect(describeDevice(UA.androidPhone)).toBe("Chrome on Android");
  });

  it("prefers Edge over the Chrome token it also contains", () => {
    expect(describeDevice(UA.edge)).toBe("Edge on Windows");
  });

  it("falls back without throwing on unknown input", () => {
    expect(describeDevice(UA.curl)).toBe("Unknown device");
    expect(describeDevice(null)).toBe("Unknown device");
  });
});

describe("hashClientIp", () => {
  it("never returns the raw address", () => {
    const hashed = hashClientIp("203.0.113.7", "secret");
    expect(hashed).not.toContain("203.0.113.7");
    expect(hashed).toMatch(/^[0-9a-f]{32}$/);
  });

  it("is stable for the same address and differs across addresses", () => {
    expect(hashClientIp("203.0.113.7", "s")).toBe(hashClientIp("203.0.113.7", "s"));
    expect(hashClientIp("203.0.113.7", "s")).not.toBe(hashClientIp("203.0.113.8", "s"));
  });

  it("differs when the secret differs", () => {
    expect(hashClientIp("203.0.113.7", "a")).not.toBe(hashClientIp("203.0.113.7", "b"));
  });

  it("returns null for a missing address", () => {
    expect(hashClientIp(null, "s")).toBeNull();
    expect(hashClientIp("  ", "s")).toBeNull();
  });
});

describe("clientIpFromHeaders", () => {
  it("takes the first entry of an X-Forwarded-For chain", () => {
    expect(clientIpFromHeaders("203.0.113.7, 70.41.3.18, 150.172.238.178", null)).toBe("203.0.113.7");
  });

  it("falls back to X-Real-IP", () => {
    expect(clientIpFromHeaders(null, "198.51.100.4")).toBe("198.51.100.4");
    expect(clientIpFromHeaders("", "198.51.100.4")).toBe("198.51.100.4");
  });

  it("returns null when neither header is present", () => {
    expect(clientIpFromHeaders(null, null)).toBeNull();
  });
});
