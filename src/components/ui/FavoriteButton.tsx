"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/lib/store";

export function FavoriteButton({
  slug,
  className,
  size = 16,
}: {
  slug: string;
  className?: string;
  size?: number;
}) {
  const { has, toggle, hydrated } = useFavorites();
  const active = hydrated && has(slug);

  return (
    <button
      type="button"
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={cn(
        "rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition-colors hover:bg-white",
        active && "bg-[color:var(--color-bloom)] hover:bg-[color:var(--color-bloom)]",
        className
      )}
    >
      <Heart
        style={{ width: size, height: size }}
        className={cn(
          "transition-colors",
          active && "fill-[color:var(--color-terracotta)] text-[color:var(--color-terracotta)]"
        )}
      />
    </button>
  );
}
