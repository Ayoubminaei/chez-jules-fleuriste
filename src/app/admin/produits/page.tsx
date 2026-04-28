import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Produits" };

type Row = {
  slug: string;
  name: string;
  category_slug: string;
  price_cents: number;
  in_stock: boolean;
  featured: boolean;
  images: string[];
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ stock?: string }>;
}) {
  await requireAdmin();
  const { stock } = await searchParams;

  const supabase = await createClient();
  let products: Row[] = [];

  if (supabase) {
    let q = supabase
      .from("products")
      .select(
        "slug,name,category_slug,price_cents,in_stock,featured,images"
      )
      .order("name", { ascending: true });
    if (stock === "oos") q = q.eq("in_stock", false);
    const { data } = await q;
    products = (data as Row[]) ?? [];
  }

  return (
    <div>
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl lg:text-3xl font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
            Produits
          </h1>
          <p className="text-sm text-[color:var(--color-mute)]">
            {products.length} référence{products.length > 1 ? "s" : ""}
            {stock === "oos" ? " hors stock" : ""}.
          </p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Nouveau produit
        </Link>
      </header>

      <div className="mt-6 rounded-[var(--radius-frame)] bg-white border border-black/5 overflow-hidden">
        {products.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-[color:var(--color-mute)]">
            Aucun produit. Commencez par lancer le seed{" "}
            <code className="px-1 py-0.5 rounded bg-black/5 text-xs">
              supabase/seed.sql
            </code>{" "}
            ou ajoutez-en un.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-black/[0.02]">
              <tr className="text-[11px] uppercase tracking-widest text-[color:var(--color-mute)]">
                <th className="text-left px-4 py-3 font-medium">Produit</th>
                <th className="text-left px-3 py-3 font-medium">Catégorie</th>
                <th className="text-right px-3 py-3 font-medium">Prix</th>
                <th className="text-center px-3 py-3 font-medium">Stock</th>
                <th className="text-right px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.slug}
                  className="border-t border-black/5 hover:bg-black/[0.02]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-black/5 shrink-0">
                        {p.images?.[0] && (
                          <Image
                            src={p.images[0]}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/produits/${p.slug}`}
                          className="block truncate font-medium hover:underline"
                        >
                          {p.name}
                        </Link>
                        <span className="text-[11px] text-[color:var(--color-mute)] truncate block">
                          {p.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[color:var(--color-mute)]">
                    {p.category_slug}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {formatPrice(p.price_cents)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={
                        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] " +
                        (p.in_stock
                          ? "bg-[color:var(--color-sage)]/30"
                          : "bg-[color:var(--color-bloom)]/40")
                      }
                    >
                      {p.in_stock ? "En stock" : "Épuisé"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/produits/${p.slug}`}
                      className="inline-flex items-center gap-1 text-xs text-[color:var(--color-mute)] hover:text-[color:var(--color-forest)]"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Modifier
                    </Link>
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
