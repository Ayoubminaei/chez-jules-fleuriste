import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { PromoList } from "@/components/admin/PromoList";

export const metadata = { title: "Promotions" };

type Row = {
  code: string;
  kind: "percent" | "fixed" | "free_shipping";
  value_int: number;
  min_subtotal_cents: number;
  max_redemptions: number | null;
  redeemed_count: number;
  ends_at: string | null;
  active: boolean;
};

export default async function AdminPromotionsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = (await supabase
    ?.from("promo_codes")
    .select("*")
    .order("active", { ascending: false })
    .order("code")) ?? { data: null };

  const promos = (data as Row[]) ?? [];

  return (
    <div>
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl lg:text-3xl font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
            Promotions
          </h1>
          <p className="text-sm text-[color:var(--color-mute)]">
            Codes de réduction utilisables au panier.
          </p>
        </div>
        <Link
          href="/admin/promotions/nouveau"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Nouveau code
        </Link>
      </header>

      <div className="mt-6">
        <PromoList promos={promos} />
      </div>
    </div>
  );
}
