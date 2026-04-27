"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  slug,
  disabled,
  className,
}: {
  slug: string;
  disabled?: boolean;
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  if (disabled) {
    return (
      <button
        disabled
        className={cn(
          "flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
      >
        Indisponible
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        add(slug, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
      className={cn(
        "flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors",
        className
      )}
    >
      {added ? (
        <>
          <Check className="w-4 h-4" /> Ajouté au panier
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" /> Ajouter au panier
        </>
      )}
    </button>
  );
}
