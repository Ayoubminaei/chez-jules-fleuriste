import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/types";

export function MobileStories({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  return (
    <div className="md:hidden">
      <div className="px-5 pt-3 pb-4 flex gap-4 overflow-x-auto scrollbar-hidden snap-x-mandatory">
        {categories.map((c) => {
          const active = c.slug === activeSlug;
          return (
            <Link
              key={c.slug}
              href={`/categorie/${c.slug}`}
              className="snap-start-2 flex flex-col items-center gap-1.5 shrink-0 w-[78px]"
            >
              <span
                className={[
                  "relative w-[72px] h-[72px] rounded-full p-[2.5px]",
                  active
                    ? "bg-gradient-to-tr from-[color:var(--color-terracotta)] via-[color:var(--color-bloom)] to-[color:var(--color-forest)]"
                    : "bg-gradient-to-tr from-[color:var(--color-sage)]/70 to-[color:var(--color-forest)]/80",
                ].join(" ")}
              >
                <span className="block w-full h-full rounded-full p-[2px] bg-[color:var(--color-bg)]">
                  <span className="relative block w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </span>
                </span>
                {active && (
                  <span className="absolute inset-0 rounded-full ring-2 ring-[color:var(--color-terracotta)]/40 animate-ringPulse" />
                )}
              </span>
              <span className="text-[11px] text-center leading-tight line-clamp-2 px-0.5">
                {c.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
