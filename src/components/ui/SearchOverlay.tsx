"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { products, categories } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // focus next tick
      window.setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return products
      .filter((p) =>
        [p.name, p.description, p.longDescription, p.composition.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(needle)
      )
      .slice(0, 8);
  }, [q]);

  const matchedCategories = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return categories
      .filter(
        (c) =>
          c.name.toLowerCase().includes(needle) ||
          c.tagline.toLowerCase().includes(needle)
      )
      .slice(0, 4);
  }, [q]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Rechercher"
        className="p-2 lg:p-2.5 hover:bg-black/5 rounded-full transition-colors"
      >
        <Search className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center p-4 sm:p-10 animate-fadeUp"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[color:var(--color-bg)] rounded-[var(--radius-frame)] overflow-hidden shadow-2xl"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5">
              <Search className="w-5 h-5 text-[color:var(--color-mute)] shrink-0" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Pivoines, mariage, abonnement…"
                className="flex-1 bg-transparent outline-none text-base placeholder:text-[color:var(--color-mute)]"
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="p-1.5 hover:bg-black/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto">
              {!q.trim() && (
                <div className="p-5">
                  <p className="text-xs uppercase tracking-widest text-[color:var(--color-mute)] mb-3">
                    Suggestions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 6).map((c) => (
                      <Link
                        key={c.slug}
                        href={`/categorie/${c.slug}`}
                        onClick={() => setOpen(false)}
                        className="px-3 py-1.5 rounded-full bg-[color:var(--color-cream)] border border-black/5 text-sm hover:bg-white"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {q.trim() && matchedCategories.length > 0 && (
                <div className="p-5 border-b border-black/5">
                  <p className="text-xs uppercase tracking-widest text-[color:var(--color-mute)] mb-3">
                    Catégories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {matchedCategories.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/categorie/${c.slug}`}
                        onClick={() => setOpen(false)}
                        className="px-3 py-1.5 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] text-sm"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {q.trim() && (
                <div className="p-2">
                  <p className="px-3 py-2 text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
                    Articles ({results.length})
                  </p>
                  {results.length === 0 ? (
                    <p className="px-3 py-6 text-sm text-[color:var(--color-mute)]">
                      Aucun article ne correspond. Essayez « pivoine »,
                      « monstera » ou « abonnement ».
                    </p>
                  ) : (
                    <ul>
                      {results.map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/produit/${p.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-black/5"
                          >
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black/5 shrink-0">
                              <Image
                                src={p.images[0]}
                                alt=""
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-base font-[family-name:var(--font-display)] truncate">
                                {p.name}
                              </div>
                              <div className="text-xs text-[color:var(--color-mute)] truncate">
                                {p.description}
                              </div>
                            </div>
                            <span className="text-sm tabular-nums shrink-0">
                              {formatPrice(p.priceCents)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-black/5 flex items-center justify-between text-[11px] text-[color:var(--color-mute)]">
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-black/5">Esc</kbd> pour
                fermer
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-black/5">⌘ K</kbd> pour
                ouvrir
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
