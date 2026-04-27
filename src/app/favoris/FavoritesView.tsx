"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useFavorites } from "@/lib/store";
import { getProduct } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";

export function FavoritesView() {
  const { ids, hydrated } = useFavorites();

  if (!hydrated) {
    return (
      <div className="mt-10 text-[color:var(--color-mute)] text-sm">
        Chargement…
      </div>
    );
  }

  const items = ids.map((s) => getProduct(s)).filter((p) => !!p);

  if (items.length === 0) {
    return (
      <div className="mt-10 rounded-[var(--radius-frame)] border border-dashed border-black/15 p-10 text-center bg-[color:var(--color-cream)]">
        <h2 className="text-2xl text-[color:var(--color-forest)]">
          Aucun favori pour l&rsquo;instant
        </h2>
        <p className="mt-2 text-sm text-[color:var(--color-mute)] max-w-md mx-auto">
          Cliquez sur le cœur d&rsquo;un article pour le sauvegarder ici.
        </p>
        <div className="mt-6">
          <Link
            href="/categorie/bouquets-signature"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors"
          >
            Découvrir les bouquets <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {items.map((p, i) => (
        <ProductCard key={p.slug} product={p} index={i} />
      ))}
    </div>
  );
}
