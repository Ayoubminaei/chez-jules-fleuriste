"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/store";
import { getProduct } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export function CartView() {
  const { items, setQty, remove, clear, hydrated } = useCart();

  if (!hydrated) {
    return (
      <div className="mt-10 text-[color:var(--color-mute)] text-sm">
        Chargement…
      </div>
    );
  }

  const lines = items
    .map((i) => {
      const p = getProduct(i.slug);
      return p ? { product: p, qty: i.qty } : null;
    })
    .filter(<T,>(x: T | null): x is T => x !== null);

  if (lines.length === 0) {
    return (
      <div className="mt-10 rounded-[var(--radius-frame)] border border-dashed border-black/15 p-10 text-center bg-[color:var(--color-cream)]">
        <h2 className="text-2xl text-[color:var(--color-forest)]">
          Votre panier est vide
        </h2>
        <p className="mt-2 text-sm text-[color:var(--color-mute)] max-w-md mx-auto">
          Découvrez les bouquets de saison et les compositions signature de
          l&rsquo;atelier.
        </p>
        <div className="mt-6">
          <Link
            href="/categorie/bouquets-signature"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors"
          >
            Voir les bouquets <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = lines.reduce(
    (s, l) => s + l.product.priceCents * l.qty,
    0
  );
  const shippingCents = subtotal >= 8000 ? 0 : 800;
  const total = subtotal + shippingCents;

  return (
    <div className="mt-8 grid lg:grid-cols-12 gap-6 lg:gap-10">
      <div className="lg:col-span-8 space-y-3">
        {lines.map(({ product, qty }) => (
          <article
            key={product.slug}
            className="flex gap-4 p-3 sm:p-4 rounded-[var(--radius-soft)] bg-[color:var(--color-cream)] border border-black/5"
          >
            <Link
              href={`/produit/${product.slug}`}
              className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-black/5 shrink-0"
            >
              <Image
                src={product.images[0]}
                alt=""
                fill
                sizes="112px"
                className="object-cover"
              />
            </Link>
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/produit/${product.slug}`}
                    className="text-base sm:text-lg font-[family-name:var(--font-display)] truncate block"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-[color:var(--color-mute)] truncate">
                    {product.description}
                  </p>
                </div>
                <button
                  onClick={() => remove(product.slug)}
                  aria-label="Retirer"
                  className="p-1.5 -m-1.5 text-[color:var(--color-mute)] hover:text-[color:var(--color-terracotta)]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                <div className="inline-flex items-center rounded-full border border-black/10 bg-white">
                  <button
                    onClick={() => setQty(product.slug, qty - 1)}
                    aria-label="Diminuer"
                    className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-l-full"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm tabular-nums">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(product.slug, qty + 1)}
                    aria-label="Augmenter"
                    className="w-8 h-8 flex items-center justify-center hover:bg-black/5 rounded-r-full"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-base font-medium tabular-nums">
                  {formatPrice(product.priceCents * qty)}
                </span>
              </div>
            </div>
          </article>
        ))}

        <button
          onClick={clear}
          className="text-xs text-[color:var(--color-mute)] hover:text-[color:var(--color-terracotta)] underline-offset-2 hover:underline"
        >
          Vider le panier
        </button>
      </div>

      <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[var(--radius-frame)] bg-[color:var(--color-cream)] border border-black/5 p-6">
          <h2 className="text-xl font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
            Récapitulatif
          </h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[color:var(--color-mute)]">Sous-total</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[color:var(--color-mute)]">Livraison</dt>
              <dd className="tabular-nums">
                {shippingCents === 0 ? "Offerte" : formatPrice(shippingCents)}
              </dd>
            </div>
            {shippingCents > 0 && (
              <p className="text-xs text-[color:var(--color-mute)] pt-1">
                Plus que {formatPrice(8000 - subtotal)} pour la livraison offerte.
              </p>
            )}
          </dl>
          <div className="mt-4 pt-4 border-t border-black/10 flex items-baseline justify-between">
            <span className="text-sm uppercase tracking-widest text-[color:var(--color-mute)]">
              Total
            </span>
            <span className="text-2xl font-[family-name:var(--font-display)] tabular-nums">
              {formatPrice(total)}
            </span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors"
          >
            Passer commande <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-3 text-[11px] text-[color:var(--color-mute)] text-center">
            Paiement sécurisé Stripe · TVA incluse
          </p>
        </div>
      </aside>
    </div>
  );
}
