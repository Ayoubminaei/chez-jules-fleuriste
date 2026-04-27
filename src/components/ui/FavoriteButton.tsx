"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  className,
  size = 16,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <button
      type="button"
      aria-label="Ajouter aux favoris"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={cn(
        "rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition-colors hover:bg-white",
        className
      )}
    >
      <Heart style={{ width: size, height: size }} />
    </button>
  );
}
