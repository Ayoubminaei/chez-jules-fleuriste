import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

const Body = z.object({
  code: z.string().min(2).max(40),
  subtotal_cents: z.number().int().min(0),
});

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Codes promo indisponibles" },
      { status: 503 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Indisponible" }, { status: 503 });
  }

  const code = parsed.data.code.toUpperCase();
  const { data, error } = await supabase
    .from("promo_codes")
    .select(
      "code,kind,value_int,min_subtotal_cents,max_redemptions,redeemed_count,starts_at,ends_at,active"
    )
    .eq("code", code)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Code introuvable" }, { status: 404 });
  }

  const promo = data as {
    code: string;
    kind: "percent" | "fixed" | "free_shipping";
    value_int: number;
    min_subtotal_cents: number;
    max_redemptions: number | null;
    redeemed_count: number;
    starts_at: string | null;
    ends_at: string | null;
    active: boolean;
  };

  if (!promo.active) {
    return NextResponse.json({ error: "Code inactif" }, { status: 400 });
  }
  if (promo.starts_at && new Date(promo.starts_at) > new Date()) {
    return NextResponse.json(
      { error: "Code pas encore valable" },
      { status: 400 }
    );
  }
  if (promo.ends_at && new Date(promo.ends_at) <= new Date()) {
    return NextResponse.json({ error: "Code expiré" }, { status: 400 });
  }
  if (
    promo.max_redemptions !== null &&
    promo.redeemed_count >= promo.max_redemptions
  ) {
    return NextResponse.json({ error: "Code épuisé" }, { status: 400 });
  }
  if (parsed.data.subtotal_cents < promo.min_subtotal_cents) {
    return NextResponse.json(
      {
        error: `Minimum ${(promo.min_subtotal_cents / 100).toFixed(0)}€ requis`,
      },
      { status: 400 }
    );
  }

  let discount_cents = 0;
  if (promo.kind === "percent") {
    discount_cents = Math.round(
      (parsed.data.subtotal_cents * promo.value_int) / 100
    );
  } else if (promo.kind === "fixed") {
    discount_cents = Math.min(promo.value_int, parsed.data.subtotal_cents);
  }

  return NextResponse.json({
    code: promo.code,
    kind: promo.kind,
    value_int: promo.value_int,
    discount_cents,
    free_shipping: promo.kind === "free_shipping",
  });
}
