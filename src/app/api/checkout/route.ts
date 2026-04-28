import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe, isStripeConfigured, siteUrl } from "@/lib/stripe";
import { getProduct } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";

const Body = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().min(1),
        qty: z.number().int().min(1).max(20),
      })
    )
    .min(1),
  promo: z.string().optional(),
});

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Stripe n'est pas configuré. Définissez STRIPE_SECRET_KEY dans Vercel.",
      },
      { status: 503 }
    );
  }

  const stripe = getStripe()!;

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Panier invalide" }, { status: 400 });
  }

  const lines = parsed.data.items
    .map((i) => {
      const p = getProduct(i.slug);
      return p ? { product: p, qty: i.qty } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null && x.product.inStock);

  if (lines.length === 0) {
    return NextResponse.json(
      { error: "Aucun article disponible" },
      { status: 400 }
    );
  }

  const subtotalCents = lines.reduce(
    (s, l) => s + l.product.priceCents * l.qty,
    0
  );

  // Validate promo against DB if provided.
  let discountCents = 0;
  let freeShipping = false;
  let promoLabel: string | null = null;
  if (parsed.data.promo) {
    const supabase = await createClient();
    if (supabase) {
      const code = parsed.data.promo.toUpperCase();
      const { data: promo } = await supabase
        .from("promo_codes")
        .select("code,kind,value_int,min_subtotal_cents,active,starts_at,ends_at,max_redemptions,redeemed_count")
        .eq("code", code)
        .maybeSingle();
      if (promo && promo.active) {
        const now = new Date();
        const okStart = !promo.starts_at || new Date(promo.starts_at) <= now;
        const okEnd = !promo.ends_at || new Date(promo.ends_at) > now;
        const okQuota =
          promo.max_redemptions === null ||
          promo.redeemed_count < promo.max_redemptions;
        const okMin = subtotalCents >= promo.min_subtotal_cents;
        if (okStart && okEnd && okQuota && okMin) {
          promoLabel = code;
          if (promo.kind === "percent") {
            discountCents = Math.round(
              (subtotalCents * promo.value_int) / 100
            );
          } else if (promo.kind === "fixed") {
            discountCents = Math.min(promo.value_int, subtotalCents);
          } else if (promo.kind === "free_shipping") {
            freeShipping = true;
          }
        }
      }
    }
  }

  const shippingCents = freeShipping ? 0 : subtotalCents >= 8000 ? 0 : 800;

  try {
    let couponId: string | undefined;
    if (discountCents > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: discountCents,
        currency: "eur",
        duration: "once",
        name: promoLabel ?? "Remise",
      });
      couponId = coupon.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      locale: "fr",
      line_items: lines.map(({ product, qty }) => ({
        quantity: qty,
        price_data: {
          currency: "eur",
          unit_amount: product.priceCents,
          product_data: {
            name: product.name,
            description: product.description,
            images: product.images.slice(0, 1),
            metadata: { slug: product.slug },
          },
        },
      })),
      shipping_options: [
        {
          shipping_rate_data: {
            display_name:
              shippingCents === 0
                ? freeShipping
                  ? "Livraison offerte (code)"
                  : "Livraison Paris (offerte)"
                : "Livraison Paris",
            type: "fixed_amount",
            fixed_amount: { amount: shippingCents, currency: "eur" },
          },
        },
      ],
      discounts: couponId ? [{ coupon: couponId }] : undefined,
      metadata: promoLabel ? { promo_code: promoLabel } : undefined,
      success_url: `${siteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/checkout/canceled`,
      shipping_address_collection: { allowed_countries: ["FR", "BE", "CH", "LU"] },
      phone_number_collection: { enabled: true },
      automatic_tax: { enabled: false },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
