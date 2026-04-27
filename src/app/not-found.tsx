import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-5 lg:px-10 mt-16 lg:mt-24 text-center">
      <span className="text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-terracotta)]">
        Erreur 404
      </span>
      <h1 className="mt-3 text-4xl lg:text-6xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)] text-balance">
        On ne trouve plus la fleur.
      </h1>
      <p className="mt-4 text-[color:var(--color-mute)] max-w-md mx-auto">
        La page que vous cherchez n&rsquo;existe pas ou a été déplacée. Revenez
        à l&rsquo;accueil ou explorez le catalogue.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors"
        >
          <Home className="w-4 h-4" /> Accueil
        </Link>
        <Link
          href="/categorie/bouquets-signature"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-black/15 hover:bg-[color:var(--color-cream)] transition-colors"
        >
          <Search className="w-4 h-4" /> Voir les bouquets
        </Link>
      </div>
    </section>
  );
}
