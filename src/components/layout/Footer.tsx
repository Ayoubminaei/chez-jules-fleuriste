import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-black/5 bg-[color:var(--color-cream)]">
      <div className="mx-auto max-w-7xl px-5 lg:px-10 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="text-2xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)]">
            Chez Jules
          </h3>
          <p className="mt-3 text-sm text-[color:var(--color-mute)] leading-relaxed">
            Fleuriste artisan, 14 rue des Martyrs, Paris 9ᵉ. Composé chaque jour
            à partir des arrivages du marché de Rungis.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
            Boutique
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/categorie/bouquets-signature" className="hover:underline">
                Bouquets signature
              </Link>
            </li>
            <li>
              <Link href="/categorie/roses" className="hover:underline">
                Roses
              </Link>
            </li>
            <li>
              <Link href="/categorie/plantes" className="hover:underline">
                Plantes
              </Link>
            </li>
            <li>
              <Link href="/abonnements" className="hover:underline">
                Abonnements
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
            Maison
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/atelier" className="hover:underline">
                L&rsquo;atelier
              </Link>
            </li>
            <li>
              <Link href="/categorie/mariage" className="hover:underline">
                Mariage & événement
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium uppercase tracking-wider text-[color:var(--color-mute)]">
            Newsletter
          </h4>
          <p className="mt-4 text-sm text-[color:var(--color-mute)]">
            Une lettre par mois, les arrivages de saison et les nouveautés.
          </p>
          <form className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder="votre@email.fr"
              className="flex-1 px-3 py-2 rounded-full bg-white border border-black/10 text-sm focus:outline-none focus:border-[color:var(--color-forest)]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] text-sm hover:bg-[color:var(--color-forest-soft)] transition-colors"
            >
              Suivre
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-black/5">
        <div className="mx-auto max-w-7xl px-5 lg:px-10 py-5 flex items-center justify-between text-xs text-[color:var(--color-mute)]">
          <span>© {new Date().getFullYear()} Chez Jules — Tous droits réservés</span>
          <div className="flex gap-4">
            <Link href="/cgv" className="hover:underline">CGV</Link>
            <Link href="/mentions" className="hover:underline">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
