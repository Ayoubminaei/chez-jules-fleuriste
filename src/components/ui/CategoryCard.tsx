import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const accentMap: Record<Category["accent"], string> = {
  forest: "bg-[color:var(--color-forest)] text-[color:var(--color-cream)]",
  sage: "bg-[color:var(--color-sage)] text-[color:var(--color-ink)]",
  terracotta: "bg-[color:var(--color-terracotta)] text-white",
  bloom: "bg-[color:var(--color-bloom)] text-[color:var(--color-ink)]",
};

export function CategoryCard({
  category,
  size = "md",
  index = 0,
}: {
  category: Category;
  size?: "sm" | "md" | "lg";
  index?: number;
}) {
  const aspect =
    size === "lg" ? "aspect-[4/5] lg:aspect-[5/6]" : size === "sm" ? "aspect-[4/5]" : "aspect-[3/4]";

  return (
    <Link
      href={`/categorie/${category.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-[var(--radius-frame)] bg-black/5 animate-fadeUp",
        aspect
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Image
        src={category.image}
        alt=""
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 45vw, 30vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />

      <div className="absolute top-3 left-3 right-12 sm:top-4 sm:left-4 sm:right-14">
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.18em] max-w-full truncate",
            accentMap[category.accent]
          )}
        >
          {category.tagline}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 lg:p-7 flex items-end justify-between gap-2 sm:gap-4">
        <div className="text-white min-w-0">
          <h3 className="text-base sm:text-xl lg:text-3xl leading-[1.1] font-[family-name:var(--font-display)] text-balance">
            {category.name}
          </h3>
          <p className="mt-1.5 text-sm text-white/80 line-clamp-2 max-w-xs text-pretty hidden md:block">
            {category.description}
          </p>
        </div>
        <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-full bg-white/95 text-[color:var(--color-forest)] flex items-center justify-center transition-transform duration-500 group-hover:rotate-45">
          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
        </div>
      </div>
    </Link>
  );
}
