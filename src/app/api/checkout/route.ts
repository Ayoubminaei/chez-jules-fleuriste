import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe, isStripeConfigured, siteUrl } from "@/lib/stripe";
import { getProduct } from "@/lib/mock-data";

const Body = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().min(1),
        qty: z.number().int().min(1).max(20),
      })
    )
    .min(1),
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
  const shippingCents = subtotalCents >= 8000 ? 0 : 800;

  try {
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
      shipping_options:
        shippingCents === 0
          ? [
              {
                shipping_rate_data: {
                  display_name: "Livraison Paris (offerte)",
                  type: "fixed_amount",
                  fixed_amount: { amount: 0, currency: "eur" },
                },
              },
            ]
          : [
              {
                shipping_rate_data: {
                  display_name: "Livraison Paris",
                  type: "fixed_amount",
                  fixed_amount: { amount: shippingCents, currency: "eur" },
                },
              },
            ],
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
