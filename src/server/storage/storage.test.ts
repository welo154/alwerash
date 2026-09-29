import { describe, expect, it, vi, afterEach } from "vitest";
import { detectFileType } from "./file-signature";
import { assertSafeObjectKey, isAllowedProfileImage } from "./object-storage";
import { readValidatedUpload } from "./upload";

const bytes = (...values: (number | string)[]) =>
  new Uint8Array(values.flatMap((v) => (typeof v === "string" ? Array.from(v, (c) => c.charCodeAt(0)) : [v])));

const JPEG = bytes(0xff, 0xd8, 0xff, 0xe0, 0, 0);
const PNG = bytes(0x89, "PNG", 0x0d, 0x0a, 0x1a, 0x0a, 0);
const WEBP = bytes("RIFF", 0, 0, 0, 0, "WEBPVP8 ");
const PDF = bytes("%PDF-1.7\n");
const HTML = bytes("<!doctype html><script>alert(1)</script>");
const SVG = bytes('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>');

describe("detectFileType", () => {
  it("recognises each accepted format from its bytes", () => {
    expect(detectFileType(JPEG)?.mime).toBe("image/jpeg");
    expect(detectFileType(PNG)?.mime).toBe("image/png");
    expect(detectFileType(WEBP)?.mime).toBe("image/webp");
    expect(detectFileType(PDF)?.mime).toBe("application/pdf");
  });

  it("rejects HTML and SVG, which a browser would execute", () => {
    expect(detectFileType(HTML)).toBeNull();
    expect(detectFileType(SVG)).toBeNull();
    expect(detectFileType(new Uint8Array())).toBeNull();
  });

  it("does not accept a RIFF container that is not WebP", () => {
    expect(detectFileType(bytes("RIFF", 0, 0, 0, 0, "AVI LIST"))).toBeNull();
  });
});

describe("readValidatedUpload", () => {
  const options = { allowed: ["image/png" as const], maxBytes: 1024, allowedLabel: "PNG images" };

  function form(content: Uint8Array, declaredType: string) {
    const fd = new FormData();
    fd.set("file", new File([Buffer.from(content)], "upload", { type: declaredType }));
    return fd;
  }

  it("ignores a lying Content-Type and rejects by content", async () => {
    const result = await readValidatedUpload(form(HTML, "image/png"), ["file"], options);
    expect(result.ok).toBe(false);
  });

  it("uses the detected type even when the declared one is wrong", async () => {
    const result = await readValidatedUpload(form(PNG, "text/plain"), ["file"], options);
    expect(result.ok && result.upload.type.mime).toBe("image/png");
  });

  it("enforces the size limit", async () => {
    const big = new Uint8Array(2048);
    big.set(PNG);
    const result = await readValidatedUpload(form(big, "image/png"), ["file"], options);
    expect(result).toMatchObject({ ok: false, status: 400 });
  });

  it("reports a missing file", async () => {
    expect(await readValidatedUpload(new FormData(), ["file"], options)).toMatchObject({ ok: false });
  });
});

describe("assertSafeObjectKey", () => {
  it("accepts generated keys", () => {
    expect(() => assertSafeObjectKey("submissions/abc-0123456789abcdef.pdf")).not.toThrow();
  });

  it.each(["../etc/passwd", "a/../../b", "/absolute", "a//b", "a\\b", ".hidden", ""])(
    "rejects %j",
    (key) => {
      expect(() => assertSafeObjectKey(key)).toThrow();
    }
  );
});

describe("isAllowedProfileImage", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("accepts the user's own uploads and Google avatars", () => {
    vi.stubEnv("SUPABASE_URL", "https://ref.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "k");
    expect(
      isAllowedProfileImage("https://ref.supabase.co/storage/v1/object/public/public-images/avatars/u1-ab.png", "u1")
    ).toBe(true);
    expect(isAllowedProfileImage("/uploads/avatars/u1-ab.png", "u1")).toBe(true);
    expect(isAllowedProfileImage("https://lh3.googleusercontent.com/a/xyz", "u1")).toBe(true);
  });

  it("rejects other users' uploads, foreign hosts, and non-http schemes", () => {
    expect(isAllowedProfileImage("/uploads/avatars/u2-ab.png", "u1")).toBe(false);
    expect(isAllowedProfileImage("https://tracker.example/pixel.gif", "u1")).toBe(false);
    expect(isAllowedProfileImage("javascript:alert(1)", "u1")).toBe(false);
    expect(isAllowedProfileImage("/uploads/avatars/u1-/../../secret", "u1")).toBe(false);
  });
});
