import Link from "next/link";
import { User } from "lucide-react";
import { categories } from "@/lib/data";
import { CartIcon, FavoritesIcon } from "./NavbarIcons";
import { SearchTrigger } from "@/components/ui/SearchOverlay";

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
            <SearchTrigger />
            <Link
              href="/compte"
              className="p-2 lg:p-2.5 hover:bg-black/5 rounded-full transition-colors hidden sm:inline-flex"
              aria-label="Compte"
            >
              <User className="w-5 h-5" />
            </Link>
            <FavoritesIcon />
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
}
