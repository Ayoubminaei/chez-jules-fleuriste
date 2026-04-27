import Link from "next/link";
import { Heart, Package, MapPin, CreditCard, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Mon compte",
};

export default function AccountPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 lg:px-10 mt-8 lg:mt-12">
      <h1 className="text-3xl lg:text-5xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)]">
        Bonjour
      </h1>
      <p className="mt-2 text-[color:var(--color-mute)]">
        Connectez-vous pour gérer vos commandes, vos favoris et vos abonnements.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <AccountTile href="/favoris" icon={<Heart className="w-4 h-4" />} title="Favoris">
          Vos pièces sauvegardées
        </AccountTile>
        <AccountTile href="/compte/commandes" icon={<Package className="w-4 h-4" />} title="Commandes">
          Historique et suivi
        </AccountTile>
        <AccountTile href="/compte/adresses" icon={<MapPin className="w-4 h-4" />} title="Adresses">
          Livraison et facturation
        </AccountTile>
        <AccountTile href="/compte/abonnements" icon={<CreditCard className="w-4 h-4" />} title="Abonnements">
          Cadence et paiement
        </AccountTile>
      </div>

      <div className="mt-10 rounded-[var(--radius-frame)] bg-[color:var(--color-cream)] border border-black/5 p-6 sm:p-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
            Connectez-vous
          </h2>
          <p className="text-sm text-[color:var(--color-mute)] mt-1">
            Pour accéder à votre espace personnel.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors text-sm"
        >
          Se connecter <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

function AccountTile({
  href,
  icon,
  title,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block p-5 rounded-[var(--radius-soft)] bg-[color:var(--color-cream)] border border-black/5 hover:bg-white transition-colors"
    >
      <span className="inline-flex w-8 h-8 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] items-center justify-center">
        {icon}
      </span>
      <h3 className="mt-3 text-base font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
        {title}
      </h3>
      <p className="text-xs text-[color:var(--color-mute)] mt-0.5">{children}</p>
    </Link>
  );
}
