import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Package,
  ShoppingBag,
  Sprout,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Tableau de bord" };

export default async function AdminDashboard() {
  await requireAdmin();
  const supabase = await createClient();

  const since = new Date();
  since.setHours(0, 0, 0, 0);

  let revenueToday = 0;
  let ordersToday = 0;
  let pendingOrders = 0;
  let outOfStockCount = 0;
  let recent: Array<{
    id: string;
    email: string;
    total_cents: number;
    status: string;
    created_at: string;
  }> = [];

  if (supabase) {
    const [{ data: today }, { count: pending }, { count: oos }, { data: latest }] =
      await Promise.all([
        supabase
          .from("orders")
          .select("total_cents")
          .gte("created_at", since.toISOString())
          .in("status", ["paid", "preparing", "delivered"]),
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("products")
          .select("slug", { count: "exact", head: true })
          .eq("in_stock", false),
        supabase
          .from("orders")
          .select("id,email,total_cents,status,created_at")
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

    if (today) {
      ordersToday = today.length;
      revenueToday = today.reduce(
        (s, o: { total_cents: number }) => s + o.total_cents,
        0
      );
    }
    pendingOrders = pending ?? 0;
    outOfStockCount = oos ?? 0;
    recent = (latest as typeof recent) ?? [];
  }

  return (
    <div>
      <header>
        <h1 className="text-2xl lg:text-3xl font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
          Tableau de bord
        </h1>
        <p className="text-sm text-[color:var(--color-mute)]">
          Vue d&rsquo;ensemble de l&rsquo;activité de la boutique.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          icon={<Banknote className="w-4 h-4" />}
          label="CA aujourd'hui"
          value={formatPrice(revenueToday)}
          accent="forest"
        />
        <StatCard
          icon={<ShoppingBag className="w-4 h-4" />}
          label="Commandes du jour"
          value={String(ordersToday)}
          accent="terracotta"
        />
        <StatCard
          icon={<Package className="w-4 h-4" />}
          label="En attente"
          value={String(pendingOrders)}
          accent="bloom"
          href="/admin/commandes?status=pending"
        />
        <StatCard
          icon={<Sprout className="w-4 h-4" />}
          label="Hors stock"
          value={String(outOfStockCount)}
          accent="sage"
          href="/admin/produits?stock=oos"
        />
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-[var(--radius-frame)] bg-white border border-black/5 overflow-hidden">
          <header className="px-5 py-4 border-b border-black/5 flex items-center justify-between">
            <h2 className="text-base font-medium">Dernières commandes</h2>
            <Link
              href="/admin/commandes"
              className="text-xs text-[color:var(--color-mute)] hover:text-[color:var(--color-forest)] inline-flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-3 h-3" />
            </Link>
          </header>
          {recent.length === 0 ? (
            <p className="px-5 py-10 text-sm text-[color:var(--color-mute)] text-center">
              Aucune commande pour l&rsquo;instant.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-black/[0.02]">
                <tr className="text-[11px] uppercase tracking-widest text-[color:var(--color-mute)]">
                  <th className="text-left px-5 py-2.5 font-medium">Client</th>
                  <th className="text-left px-3 py-2.5 font-medium">Statut</th>
                  <th className="text-right px-5 py-2.5 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} className="border-t border-black/5">
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/commandes/${o.id}`}
                        className="hover:underline"
                      >
                        <div className="truncate max-w-[28ch]">{o.email}</div>
                        <div className="text-[11px] text-[color:var(--color-mute)]">
                          {new Date(o.created_at).toLocaleString("fr-FR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {formatPrice(o.total_cents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="rounded-[var(--radius-frame)] bg-white border border-black/5 p-5">
          <h2 className="text-base font-medium">Raccourcis</h2>
          <ul className="mt-3 space-y-2">
            <Shortcut href="/admin/produits/nouveau">
              Ajouter un produit
            </Shortcut>
            <Shortcut href="/admin/promotions/nouveau">
              Créer une promotion
            </Shortcut>
            <Shortcut href="/admin/bannieres">Modifier la bannière</Shortcut>
            <Shortcut href="/admin/commandes?status=pending">
              Commandes en attente
            </Shortcut>
          </ul>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "forest" | "terracotta" | "bloom" | "sage";
  href?: string;
}) {
  const dot = {
    forest: "bg-[color:var(--color-forest)]",
    terracotta: "bg-[color:var(--color-terracotta)]",
    bloom: "bg-[color:var(--color-bloom)]",
    sage: "bg-[color:var(--color-sage)]",
  }[accent];

  const inner = (
    <>
      <div className="flex items-center gap-2 text-[color:var(--color-mute)]">
        <span
          className={`w-7 h-7 rounded-full ${dot} text-white inline-flex items-center justify-center`}
        >
          {icon}
        </span>
        <span className="text-xs uppercase tracking-widest">{label}</span>
      </div>
      <p className="mt-3 text-2xl lg:text-3xl font-[family-name:var(--font-display)] text-[color:var(--color-forest)] tabular-nums">
        {value}
      </p>
    </>
  );

  return href ? (
    <Link
      href={href}
      className="rounded-[var(--radius-soft)] bg-white border border-black/5 p-4 hover:border-black/15 transition-colors block"
    >
      {inner}
    </Link>
  ) : (
    <div className="rounded-[var(--radius-soft)] bg-white border border-black/5 p-4">
      {inner}
    </div>
  );
}

function Shortcut({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm hover:bg-black/[0.04] transition-colors"
      >
        <span>{children}</span>
        <ArrowRight className="w-3.5 h-3.5 text-[color:var(--color-mute)]" />
      </Link>
    </li>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; classes: string }> = {
    pending: { label: "En attente", classes: "bg-[color:var(--color-bloom)]/30 text-[color:var(--color-ink)]" },
    paid: { label: "Payée", classes: "bg-[color:var(--color-sage)]/30 text-[color:var(--color-ink)]" },
    preparing: { label: "En préparation", classes: "bg-[color:var(--color-terracotta)]/20 text-[color:var(--color-ink)]" },
    delivered: { label: "Livrée", classes: "bg-[color:var(--color-forest)] text-[color:var(--color-cream)]" },
    canceled: { label: "Annulée", classes: "bg-black/10 text-[color:var(--color-mute)]" },
    refunded: { label: "Remboursée", classes: "bg-black/10 text-[color:var(--color-mute)]" },
  };
  const { label, classes } = map[status] ?? {
    label: status,
    classes: "bg-black/10",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] ${classes}`}
    >
      {label}
    </span>
  );
}
