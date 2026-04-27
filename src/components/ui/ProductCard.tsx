"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { Badge } from "./Badge";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const onSale =
    product.compare_at_cents && product.compare_at_cents > product.price_cents;

  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-(--radius-lg) bg-white/60 ring-1 ring-(--color-line) transition-all duration-500 hover:ring-(--color-forest) hover:shadow-(--shadow-float) hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-(--color-sage-50)">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-col gap-1.5">
            {product.is_new && <Badge tone="forest">Nouveau</Badge>}
            {onSale && <Badge tone="bloom">Promo</Badge>}
            {product.stock <= 3 && product.stock > 0 && (
              <Badge tone="gold">Plus que {product.stock}</Badge>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label="Ajouter aux favoris"
          className="pointer-events-auto absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-(--color-forest) opacity-0 backdrop-blur transition-all duration-300 hover:bg-white group-hover:opacity-100"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-(--color-muted)">
          {product.category}
        </p>
        <h3 className="font-display text-lg leading-tight text-(--color-ink)">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="font-medium text-(--color-forest)">
            {formatPrice(product.price_cents)}
          </span>
          {onSale && (
            <span className="text-sm text-(--color-muted) line-through">
              {formatPrice(product.compare_at_cents!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
