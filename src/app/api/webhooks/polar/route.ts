import { NextRequest, NextResponse } from "next/server";
import { webhooks } from "@polar-sh/sdk/2026-10";
import { MEMBERSHIP_PRICE } from "@/lib/subscription-plans";
import { AppError } from "@/server/lib/errors";
import {
  grantEntitlementForVerifiedPayment,
  reverseEntitlementForRefund,
} from "@/server/subscription/entitlement.service";

export const dynamic = "force-dynamic";

type PolarOrder = {
  id: string;
  status: string;
  paid: boolean;
  product_id: string | null;
  metadata: Record<string, unknown>;
  customer: { external_id?: string | null };
};

/** The checkout sets both; external_id survives even if metadata is edited in Polar. */
function orderUserId(order: PolarOrder): string | null {
  const external = order.customer.external_id?.trim();
  if (external) return external;
  const meta = order.metadata?.userId;
  return typeof meta === "string" && meta.trim() ? meta.trim() : null;
}

function isMembershipProduct(order: PolarOrder): boolean {
  const productId = process.env.POLAR_PRODUCT_ID?.trim();
  return Boolean(productId) && order.product_id === productId;
}

/** POST /api/webhooks/polar — verified Polar events grant or reverse membership access. */
export async function POST(request: NextRequest) {
  const secret = process.env.POLAR_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error("[polar] POLAR_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await request.text();
  const headers = {
    "webhook-id": request.headers.get("webhook-id") ?? "",
    "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
    "webhook-signature": request.headers.get("webhook-signature") ?? "",
  };

  let event;
  try {
    event = await webhooks.validateEvent(body, headers, secret);
  } catch (error) {
    if (error instanceof webhooks.PolarWebhookVerificationError) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 403 });
    }
    if (error instanceof webhooks.PolarWebhookUnknownTypeError) {
      return NextResponse.json({ received: true }, { status: 202 });
    }
    if (error instanceof webhooks.PolarWebhookError) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }
    throw error;
  }

  try {
    if (event.type === "order.paid") {
      const order = event.data as PolarOrder;
      const userId = orderUserId(order);
      if (!order.paid || !isMembershipProduct(order) || !userId) {
        console.warn("[polar] ignoring order.paid", { orderId: order.id, userId, productId: order.product_id });
        return NextResponse.json({ received: true });
      }
      await grantEntitlementForVerifiedPayment({
        provider: "POLAR",
        providerEventId: `order:${order.id}`,
        eventType: event.type,
        userId,
        durationMonths: MEMBERSHIP_PRICE.durationMonths,
      });
    } else if (event.type === "order.refunded") {
      const order = event.data as PolarOrder;
      const userId = orderUserId(order);
      if (order.status === "refunded" && isMembershipProduct(order) && userId) {
        await reverseEntitlementForRefund({
          provider: "POLAR",
          providerEventId: `refund:${order.id}`,
          eventType: event.type,
          userId,
          durationMonths: MEMBERSHIP_PRICE.durationMonths,
        });
      }
    }
  } catch (error) {
    // Retrying cannot fix a missing user or bad duration, so acknowledge those.
    if (error instanceof AppError && error.status < 500) {
      console.error("[polar] webhook rejected", { type: event.type, message: error.message });
      return NextResponse.json({ received: true });
    }
    console.error("[polar] webhook processing failed", { type: event.type, error });
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
