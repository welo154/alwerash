import crypto from "crypto";
import { headers } from "next/headers";
import { clientIpFromHeaders, hashClientIp } from "@/server/auth/device-classification";

/** Key for every identifier HMAC, so stored hashes cannot be reversed by lookup table. */
export function securityHashSecret(): string {
  return (
    process.env.DEVICE_IP_HASH_SECRET ??
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "device-ip-fallback"
  );
}

/** Keyed hash of an email or other identifier, namespaced so values never collide across uses. */
export function hashIdentifier(namespace: string, value: string): string {
  return crypto
    .createHmac("sha256", securityHashSecret())
    .update(`${namespace}:v1:${value.trim().toLowerCase()}`)
    .digest("hex")
    .slice(0, 32);
}

export type RequestContext = {
  ip: string | null;
  ipHash: string | null;
  userAgent: string | null;
};

/** Returns empty values outside a request scope instead of throwing. */
export async function readRequestContext(): Promise<RequestContext> {
  try {
    const h = await headers();
    const ip = clientIpFromHeaders(h.get("x-forwarded-for"), h.get("x-real-ip"));
    return {
      ip,
      ipHash: hashClientIp(ip, securityHashSecret()),
      userAgent: h.get("user-agent"),
    };
  } catch {
    return { ip: null, ipHash: null, userAgent: null };
  }
}
