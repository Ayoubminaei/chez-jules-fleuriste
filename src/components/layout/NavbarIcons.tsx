"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart, useFavorites } from "@/lib/store";

function Badge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[color:var(--color-terracotta)] text-white text-[10px] font-medium flex items-center justify-center tabular-nums">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function CartIcon() {
  const { count, hydrated } = useCart();
  return (
    <Link
      href="/panier"
      className="relative p-2 lg:p-2.5 hover:bg-black/5 rounded-full transition-colors"
      aria-label={`Panier${hydrated && count ? ` (${count})` : ""}`}
    >
      <ShoppingBag className="w-5 h-5" />
      {hydrated && <Badge count={count} />}
    </Link>
  );
}

export function FavoritesIcon() {
  const { ids, hydrated } = useFavorites();
  const count = ids.length;
  return (
    <Link
      href="/favoris"
      className="relative p-2 lg:p-2.5 hover:bg-black/5 rounded-full transition-colors hidden sm:inline-flex"
      aria-label={`Favoris${hydrated && count ? ` (${count})` : ""}`}
    >
      <Heart className="w-5 h-5" />
      {hydrated && <Badge count={count} />}
    </Link>
  );
}
