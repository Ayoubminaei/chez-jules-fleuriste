import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { FavoriteButton } from "./FavoriteButton";

export function ProductCard({
  product,
  index = 0,
  variant = "default",
}: {
  product: Product;
  index?: number;
  variant?: "default" | "compact";
}) {
  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group block animate-fadeUp"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-soft)] bg-black/5",
          variant === "compact" ? "aspect-square" : "aspect-[4/5]"
        )}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        {!product.inStock && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-[11px] uppercase tracking-wider text-[color:var(--color-mute)]">
            En attente
          </span>
        )}
        <FavoriteButton
          slug={product.slug}
          className="absolute top-3 right-3 w-9 h-9 sm:opacity-0 group-hover:opacity-100 transition-opacity"
        />

      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[15px] font-[family-name:var(--font-display)] truncate">
            {product.name}
          </h3>
          {variant !== "compact" && (
            <p className="text-[13px] text-[color:var(--color-mute)] truncate">
              {product.description}
            </p>
          )}
        </div>
        <span className="text-[14px] font-medium tabular-nums shrink-0">
          {formatPrice(product.priceCents)}
        </span>
      </div>
    </Link>
  );
}
