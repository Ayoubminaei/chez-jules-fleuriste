import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { StatusPill } from "@/app/admin/page";

export const metadata = { title: "Commandes" };

const STATUSES = [
  { value: "all", label: "Toutes" },
  { value: "pending", label: "En attente" },
  { value: "paid", label: "Payées" },
  { value: "preparing", label: "Préparation" },
  { value: "delivered", label: "Livrées" },
  { value: "canceled", label: "Annulées" },
];

type Row = {
  id: string;
  email: string;
  total_cents: number;
  status: string;
  created_at: string;
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireAdmin();
  const { status = "all", q } = await searchParams;
  const supabase = await createClient();

  let orders: Row[] = [];

  if (supabase) {
    let query = supabase
      .from("orders")
      .select("id,email,total_cents,status,created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (status !== "all") query = query.eq("status", status);
    if (q) query = query.ilike("email", `%${q}%`);
    const { data } = await query;
    orders = (data as Row[]) ?? [];
  }

  return (
    <div>
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl lg:text-3xl font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
            Commandes
          </h1>
          <p className="text-sm text-[color:var(--color-mute)]">
            {orders.length} commande{orders.length > 1 ? "s" : ""}.
          </p>
        </div>
        <form action="" className="flex items-center gap-2">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Rechercher un email"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm w-56 focus:outline-none focus:border-[color:var(--color-forest)]"
          />
          <input type="hidden" name="status" value={status} />
        </form>
      </header>

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const active = (status ?? "all") === s.value;
          return (
            <Link
              key={s.value}
              href={`/admin/commandes${
                s.value === "all" ? "" : `?status=${s.value}`
              }`}
              className={
                "px-3 py-1.5 rounded-full text-xs " +
                (active
                  ? "bg-[color:var(--color-forest)] text-[color:var(--color-cream)]"
                  : "bg-white border border-black/10 hover:bg-black/5")
              }
            >
              {s.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-6 rounded-[var(--radius-frame)] bg-white border border-black/5 overflow-hidden">
        {orders.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-[color:var(--color-mute)]">
            Aucune commande.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-black/[0.02]">
              <tr className="text-[11px] uppercase tracking-widest text-[color:var(--color-mute)]">
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-3 py-3 font-medium">Client</th>
                <th className="text-left px-3 py-3 font-medium">Statut</th>
                <th className="text-right px-4 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-black/5 hover:bg-black/[0.02]"
                >
                  <td className="px-4 py-3 text-[color:var(--color-mute)] text-xs">
                    {new Date(o.created_at).toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/commandes/${o.id}`}
                      className="hover:underline"
                    >
                      {o.email}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <StatusPill status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatPrice(o.total_cents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
