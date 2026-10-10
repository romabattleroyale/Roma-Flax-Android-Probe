import { createFileRoute } from "@tanstack/react-router";
import { type StripeEnv, verifyWebhook } from "@/lib/stripe.server";

function iso(s?: number | null) {
  return s ? new Date(s * 1000).toISOString() : null;
}

// Upserting the subscription row fires a DB trigger that sets profiles.plan (pro/free).
async function upsertSubscription(sub: any, env: StripeEnv) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const item = sub.items?.data?.[0];
  const priceId = item?.price?.lookup_key || item?.price?.metadata?.lovable_external_id || item?.price?.id;
  const productId = typeof item?.price?.product === "string" ? item.price.product : item?.price?.product?.id;
  const row = {
    stripe_subscription_id: sub.id,
    stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
    product_id: productId ?? "",
    price_id: priceId ?? "",
    status: sub.status,
    current_period_start: iso(item?.current_period_start ?? sub.current_period_start),
    current_period_end: iso(item?.current_period_end ?? sub.current_period_end),
    cancel_at_period_end: sub.cancel_at_period_end || false,
    environment: env,
    updated_at: new Date().toISOString(),
  };
  const userId = sub.metadata?.userId;
  if (userId) {
    await supabaseAdmin.from("subscriptions").upsert({ ...row, user_id: userId }, { onConflict: "stripe_subscription_id" });
  } else {
    await supabaseAdmin.from("subscriptions").update(row).eq("stripe_subscription_id", sub.id).eq("environment", env);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") return Response.json({ received: true, ignored: "invalid env" });
        try {
          const event = await verifyWebhook(request, rawEnv);
          switch (event.type) {
            case "customer.subscription.created":
            case "customer.subscription.updated":
            case "customer.subscription.deleted":
            case "subscription.created":
            case "subscription.updated":
            case "subscription.canceled": {
              const sub = event.data.object;
              if (event.type.endsWith("deleted") || event.type.endsWith("canceled")) sub.status = "canceled";
              await upsertSubscription(sub, rawEnv);
              break;
            }
            default:
              console.log("Unhandled event:", event.type);
          }
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});