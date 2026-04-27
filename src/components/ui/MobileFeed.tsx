import Link from "next/link";
import Image from "next/image";
import { Heart, Bookmark, Share2 } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function MobileFeed({ products }: { products: Product[] }) {
  return (
    <div className="md:hidden mt-2">
      <div className="flex flex-col gap-7 px-2 pb-6">
        {products.map((p, i) => (
          <article
            key={p.slug}
            className="rounded-[var(--radius-frame)] overflow-hidden bg-[color:var(--color-cream)] border border-black/5 animate-fadeUp"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* media — 1:1 like Instagram */}
            <Link
              href={`/produit/${p.slug}`}
              className="relative block aspect-square"
            >
              <Image
                src={p.images[0]}
                alt={p.name}
                fill
                sizes="100vw"
                className="object-cover"
              />
              {p.images.length > 1 && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/55 text-white text-[10px] tracking-wider">
                  1 / {p.images.length}
                </span>
              )}
            </Link>

            {/* actions row */}
            <div className="px-4 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button aria-label="J'aime" className="p-1 -m-1">
                  <Heart className="w-6 h-6" />
                </button>
                <button aria-label="Partager" className="p-1 -m-1">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
              <button aria-label="Sauvegarder" className="p-1 -m-1">
                <Bookmark className="w-6 h-6" />
              </button>
            </div>

            <div className="px-4 pt-2 pb-5">
              <Link href={`/produit/${p.slug}`}>
                <h3 className="text-2xl font-[family-name:var(--font-display)] leading-tight">
                  {p.name}
                </h3>
              </Link>
              <p className="mt-1.5 text-sm text-[color:var(--color-mute)]">
                {p.longDescription}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-lg tabular-nums">
                  {formatPrice(p.priceCents)}
                </span>
                <Link
                  href={`/produit/${p.slug}`}
                  className="px-5 py-2.5 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] text-sm hover:bg-[color:var(--color-forest-soft)] transition-colors"
                >
                  Découvrir
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
