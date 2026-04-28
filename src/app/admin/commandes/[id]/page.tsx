import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { StatusPill } from "@/app/admin/page";
import { OrderStatusChanger } from "@/components/admin/OrderStatusChanger";

export const metadata = { title: "Commande" };

type ShippingAddress = {
  line1?: string;
  line2?: string | null;
  postal_code?: string;
  city?: string;
  country?: string;
};

type OrderRow = {
  id: string;
  email: string;
  status: string;
  total_cents: number;
  currency: string;
  shipping_address: ShippingAddress | null;
  delivery_at: string | null;
  card_message: string | null;
  stripe_session_id: string | null;
  created_at: string;
};

type ItemRow = {
  product_slug: string;
  name_snapshot: string;
  unit_price_cents: number;
  qty: number;
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) return notFound();

  const [{ data: order }, { data: items }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("order_items")
      .select("product_slug,name_snapshot,unit_price_cents,qty")
      .eq("order_id", id),
  ]);

  if (!order) return notFound();
  const o = order as OrderRow;
  const lines = (items as ItemRow[]) ?? [];

  return (
    <div>
      <Link
        href="/admin/commandes"
        className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-mute)] hover:text-[color:var(--color-forest)]"
      >
        <ArrowLeft className="w-4 h-4" /> Retour aux commandes
      </Link>

      <header className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
            Commande
          </h1>
          <p className="text-xs text-[color:var(--color-mute)] font-mono mt-1">
            #{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleString("fr-FR")}
          </p>
        </div>
        <StatusPill status={o.status} />
      </header>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-[var(--radius-frame)] bg-white border border-black/5 overflow-hidden">
          <header className="px-5 py-4 border-b border-black/5">
            <h2 className="text-base font-medium">Articles</h2>
          </header>
          <table className="w-full text-sm">
            <tbody>
              {lines.map((l, i) => (
                <tr key={i} className="border-t border-black/5">
                  <td className="px-5 py-3">
                    <Link
                      href={`/produit/${l.product_slug}`}
                      target="_blank"
                      className="hover:underline"
                    >
                      {l.name_snapshot}
                    </Link>
                    <div className="text-[11px] text-[color:var(--color-mute)]">
                      {l.product_slug} · {formatPrice(l.unit_price_cents)} ×{" "}
                      {l.qty}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {formatPrice(l.unit_price_cents * l.qty)}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-black/10 bg-black/[0.02]">
                <td className="px-5 py-3 font-medium">Total</td>
                <td className="px-5 py-3 text-right tabular-nums font-medium">
                  {formatPrice(o.total_cents)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <aside className="space-y-5">
          <section className="rounded-[var(--radius-frame)] bg-white border border-black/5 p-5">
            <h2 className="text-base font-medium">Statut</h2>
            <p className="mt-1 text-xs text-[color:var(--color-mute)]">
              Changez le statut de la commande.
            </p>
            <OrderStatusChanger id={o.id} status={o.status} />
          </section>

          <section className="rounded-[var(--radius-frame)] bg-white border border-black/5 p-5 text-sm space-y-2">
            <h2 className="text-base font-medium">Client</h2>
            <p className="text-[color:var(--color-mute)]">{o.email}</p>
          </section>

          {o.shipping_address && (
            <section className="rounded-[var(--radius-frame)] bg-white border border-black/5 p-5 text-sm space-y-1">
              <h2 className="text-base font-medium mb-1">Livraison</h2>
              <p>{o.shipping_address.line1}</p>
              {o.shipping_address.line2 && <p>{o.shipping_address.line2}</p>}
              <p>
                {o.shipping_address.postal_code} {o.shipping_address.city}
              </p>
              <p className="text-[color:var(--color-mute)]">
                {o.shipping_address.country}
              </p>
              {o.delivery_at && (
                <p className="mt-2 text-xs">
                  Créneau :{" "}
                  {new Date(o.delivery_at).toLocaleString("fr-FR", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </section>
          )}

          {o.card_message && (
            <section className="rounded-[var(--radius-frame)] bg-white border border-black/5 p-5 text-sm">
              <h2 className="text-base font-medium mb-1">Mot d&rsquo;accompagnement</h2>
              <p className="italic text-[color:var(--color-mute)]">“{o.card_message}”</p>
            </section>
          )}

          {o.stripe_session_id && (
            <section className="rounded-[var(--radius-frame)] bg-white border border-black/5 p-5 text-xs text-[color:var(--color-mute)] font-mono break-all">
              Stripe: {o.stripe_session_id}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
