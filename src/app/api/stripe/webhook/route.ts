import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getServiceClient } from "@/lib/supabase/admin";
import { sendOrderEmails } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook non configuré" },
      { status: 503 }
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Signature manquante" },
      { status: 400 }
    );
  }

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      {
        error: `Signature invalide: ${
          err instanceof Error ? err.message : "?"
        }`,
      },
      { status: 400 }
    );
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const supabase = getServiceClient();
  if (!supabase) {
    // No DB configured — still ack the webhook.
    return NextResponse.json({ received: true, persisted: false });
  }

  // Pull line items so we can persist a snapshot.
  const expanded = await stripe.checkout.sessions.retrieve(session.id, {
    expand: [
      "line_items.data.price.product",
      "customer_details",
      "collected_information",
    ],
  });
  const items = expanded.line_items?.data ?? [];

  const totalCents = expanded.amount_total ?? 0;
  const email =
    expanded.customer_details?.email ??
    expanded.customer_email ??
    "inconnu@chez-jules.fr";

  const shipping =
    expanded.collected_information?.shipping_details ?? null;

  // Idempotency: skip if already inserted.
  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  let orderId: string | null = (existing as { id: string } | null)?.id ?? null;

  if (!orderId) {
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        email,
        status: "paid",
        total_cents: totalCents,
        currency: (expanded.currency ?? "eur").toUpperCase(),
        shipping_address: shipping?.address
          ? {
              line1: shipping.address.line1 ?? null,
              line2: shipping.address.line2 ?? null,
              city: shipping.address.city ?? null,
              postal_code: shipping.address.postal_code ?? null,
              country: shipping.address.country ?? null,
            }
          : null,
        stripe_session_id: session.id,
        stripe_payment_intent:
          typeof expanded.payment_intent === "string"
            ? expanded.payment_intent
            : (expanded.payment_intent?.id ?? null),
      })
      .select("id")
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: error?.message ?? "Insertion échouée" },
        { status: 500 }
      );
    }

    orderId = (order as { id: string }).id;

    if (items.length > 0) {
      await supabase.from("order_items").insert(
        items.map((li) => {
          const product = li.price?.product as Stripe.Product | null;
          const slug = (product?.metadata?.slug as string | undefined) ?? "";
          return {
            order_id: orderId,
            product_slug: slug || (product?.id ?? "unknown"),
            name_snapshot: li.description ?? product?.name ?? "Article",
            unit_price_cents: li.price?.unit_amount ?? 0,
            qty: li.quantity ?? 1,
          };
        })
      );
    }

    await supabase.from("notifications").insert({
      kind: "order_placed",
      title: `Nouvelle commande · ${formatEuro(totalCents)}`,
      body: `${email}`,
      href: `/admin/commandes/${orderId}`,
    });
  }

  // Send emails (best-effort).
  try {
    await sendOrderEmails({
      orderId: orderId ?? session.id,
      email,
      totalCents,
      lines: items.map((li) => ({
        name: li.description ?? "Article",
        qty: li.quantity ?? 1,
        unitPriceCents: li.price?.unit_amount ?? 0,
      })),
    });
  } catch {
    /* logged via Resend dashboard */
  }

  return NextResponse.json({ received: true, orderId });
}

function formatEuro(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
