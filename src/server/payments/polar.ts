import { createPolar } from "@polar-sh/sdk/2026-10";

/**
 * Polar is the merchant of record for USD card payments. The checkout sells one
 * fixed-price product; access is granted only from a verified `order.paid`
 * webhook, never from the success redirect.
 */
export type PolarEnvironment = "sandbox" | "production";

export function polarEnvironment(): PolarEnvironment {
  return process.env.POLAR_SERVER?.trim().toLowerCase() === "production" ? "production" : "sandbox";
}

export function isPolarConfigured(): boolean {
  return Boolean(process.env.POLAR_ACCESS_TOKEN?.trim() && process.env.POLAR_PRODUCT_ID?.trim());
}

let client: ReturnType<typeof createPolar> | null = null;

function getPolar() {
  const accessToken = process.env.POLAR_ACCESS_TOKEN?.trim();
  if (!accessToken) throw new Error("POLAR_ACCESS_TOKEN is not set");
  client ??= createPolar({ accessToken, environment: polarEnvironment(), timeout: 20 });
  return client;
}

export async function createPolarCheckoutUrl(input: {
  userId: string;
  email: string;
  name: string | null;
  planId: string;
  baseUrl: string;
}): Promise<string> {
  const productId = process.env.POLAR_PRODUCT_ID?.trim();
  if (!productId) throw new Error("POLAR_PRODUCT_ID is not set");

  const checkout = await getPolar().checkouts.create({
    products: [productId],
    external_customer_id: input.userId,
    customer_email: input.email,
    customer_name: input.name,
    metadata: { userId: input.userId, planId: input.planId },
    success_url: `${input.baseUrl}/subscription/success?checkout_id={CHECKOUT_ID}`,
    return_url: `${input.baseUrl}/subscription/checkout?plan=${encodeURIComponent(input.planId)}`,
  });
  return checkout.url;
}
