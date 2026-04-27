"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/catalogue", label: "Boutique" },
  { href: "/catalogue?cat=bouquets", label: "Bouquets" },
  { href: "/catalogue?cat=plantes", label: "Plantes" },
  { href: "/abonnements", label: "Abonnements" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-(--color-bg)/85 backdrop-blur-xl border-b border-(--color-line)"
          : "bg-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <button
          type="button"
          className="md:hidden p-2 -ml-2"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-(--color-forest)"
        >
          Chez&nbsp;Jules
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative text-sm text-(--color-ink) hover:text-(--color-forest) transition-colors group"
            >
              {l.label}
              <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-(--color-forest) transition-[width] duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/recherche"
            className="hidden sm:grid h-10 w-10 place-items-center rounded-full hover:bg-(--color-forest-50) transition-colors"
            aria-label="Recherche"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href="/compte/favoris"
            className="hidden sm:grid h-10 w-10 place-items-center rounded-full hover:bg-(--color-forest-50) transition-colors"
            aria-label="Favoris"
          >
            <Heart className="h-4 w-4" />
          </Link>
          <Link
            href="/compte"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-(--color-forest-50) transition-colors"
            aria-label="Compte"
          >
            <User className="h-4 w-4" />
          </Link>
          <Link
            href="/panier"
            className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-(--color-forest-50) transition-colors"
            aria-label="Panier"
          >
            <ShoppingBag className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-50 transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        <button
          type="button"
          aria-label="Fermer"
          className="absolute inset-0 bg-(--color-ink)/40"
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute top-0 left-0 h-full w-[82%] max-w-sm bg-(--color-bg) p-6 shadow-(--shadow-float) transition-transform duration-300 ease-[var(--ease-out-expo)]",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-xl text-(--color-forest)">
              Chez Jules
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-(--color-forest-50)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-2xl text-(--color-ink) hover:text-(--color-forest) transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-12 border-t border-(--color-line) pt-6 flex flex-col gap-3 text-sm text-(--color-muted)">
            <Link href="/compte" onClick={() => setOpen(false)}>
              Mon compte
            </Link>
            <Link href="/compte/favoris" onClick={() => setOpen(false)}>
              Mes favoris
            </Link>
            <Link href="/recherche" onClick={() => setOpen(false)}>
              Rechercher
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
