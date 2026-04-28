import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Clients" };

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

type OrderAgg = { user_id: string | null; email: string; total_cents: number };

export default async function AdminClientsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: profiles }, { data: orders }] = await Promise.all([
    supabase
      ?.from("profiles")
      .select("id,email,full_name,created_at")
      .order("created_at", { ascending: false })
      .limit(200) ?? Promise.resolve({ data: null }),
    supabase
      ?.from("orders")
      .select("user_id,email,total_cents")
      .in("status", ["paid", "preparing", "delivered"]) ??
      Promise.resolve({ data: null }),
  ]);

  const aggMap = new Map<string, { count: number; spent: number }>();
  for (const o of (orders as OrderAgg[]) ?? []) {
    const k = (o.user_id ?? o.email).toLowerCase();
    const cur = aggMap.get(k) ?? { count: 0, spent: 0 };
    cur.count += 1;
    cur.spent += o.total_cents;
    aggMap.set(k, cur);
  }

  const rows = (profiles as ProfileRow[]) ?? [];

  return (
    <div>
      <header>
        <h1 className="text-2xl lg:text-3xl font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
          Clients
        </h1>
        <p className="text-sm text-[color:var(--color-mute)]">
          {rows.length} compte{rows.length > 1 ? "s" : ""} créé
          {rows.length > 1 ? "s" : ""}.
        </p>
      </header>

      <div className="mt-6 rounded-[var(--radius-frame)] bg-white border border-black/5 overflow-hidden">
        {rows.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-[color:var(--color-mute)]">
            Aucun client pour l&rsquo;instant.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-black/[0.02]">
              <tr className="text-[11px] uppercase tracking-widest text-[color:var(--color-mute)]">
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-3 py-3 font-medium">Nom</th>
                <th className="text-right px-3 py-3 font-medium">Commandes</th>
                <th className="text-right px-4 py-3 font-medium">Total dépensé</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const agg =
                  aggMap.get(p.id.toLowerCase()) ??
                  aggMap.get(p.email.toLowerCase()) ??
                  { count: 0, spent: 0 };
                return (
                  <tr key={p.id} className="border-t border-black/5">
                    <td className="px-4 py-3">{p.email}</td>
                    <td className="px-3 py-3 text-[color:var(--color-mute)]">
                      {p.full_name ?? "—"}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {agg.count}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatPrice(agg.spent)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
