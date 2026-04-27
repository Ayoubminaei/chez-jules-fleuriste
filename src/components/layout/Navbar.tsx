import Link from "next/link";
import { ShoppingBag, Heart, User, Search } from "lucide-react";
import { categories } from "@/lib/data";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color:var(--color-bg)]/80 border-b border-black/5">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-2xl lg:text-3xl tracking-tight text-[color:var(--color-forest)]"
          >
            Chez Jules
            <span className="hidden lg:inline text-[color:var(--color-mute)] italic font-normal text-base ml-2">
              · fleuriste
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm">
            {categories.slice(0, 5).map((c) => (
              <Link
                key={c.slug}
                href={`/categorie/${c.slug}`}
                className="text-[color:var(--color-ink)]/80 hover:text-[color:var(--color-forest)] transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 lg:gap-2">
            <button
              className="p-2 lg:p-2.5 hover:bg-black/5 rounded-full transition-colors"
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/compte"
              className="p-2 lg:p-2.5 hover:bg-black/5 rounded-full transition-colors hidden sm:inline-flex"
              aria-label="Compte"
            >
              <User className="w-5 h-5" />
            </Link>
            <Link
              href="/favoris"
              className="p-2 lg:p-2.5 hover:bg-black/5 rounded-full transition-colors hidden sm:inline-flex"
              aria-label="Favoris"
            >
              <Heart className="w-5 h-5" />
            </Link>
            <Link
              href="/panier"
              className="p-2 lg:p-2.5 hover:bg-black/5 rounded-full transition-colors relative"
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
