import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, MapPin, Sparkles } from "lucide-react";

export const metadata = {
  title: "L'atelier",
};

export default function AtelierPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 lg:px-10 mt-6 lg:mt-10">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-terracotta)]">
          La maison
        </span>
        <h1 className="mt-2 text-4xl lg:text-6xl text-[color:var(--color-forest)] text-balance max-w-3xl">
          L&rsquo;atelier de Jules, rue des Martyrs.
        </h1>
        <p className="mt-4 max-w-2xl text-[color:var(--color-mute)] text-pretty">
          Un atelier-boutique où l&rsquo;on compose chaque jour à partir des
          arrivages du marché de Rungis et de petits producteurs
          d&rsquo;Île-de-France. Un travail de la main, sans excès, dans le
          respect de la saison.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 lg:px-10 mt-8">
        <div className="relative aspect-[16/9] rounded-[var(--radius-frame)] overflow-hidden grain">
          <Image
            src="https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=2000&q=85"
            alt="L'atelier"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 lg:px-10 mt-12 grid md:grid-cols-3 gap-4 lg:gap-6">
        <Card icon={<Leaf className="w-4 h-4" />} title="De saison, toujours">
          Pas de fleur hors-sol ni de variétés transportées sur 5 000 km. Ce qui
          pousse maintenant, ici.
        </Card>
        <Card icon={<Sparkles className="w-4 h-4" />} title="Composé à la main">
          Chaque bouquet est monté en spirale, tige par tige, dans l&rsquo;ordre
          d&rsquo;une partition.
        </Card>
        <Card icon={<MapPin className="w-4 h-4" />} title="Paris 9ᵉ">
          14 rue des Martyrs. Ouvert du mardi au samedi, 10h–19h30. Et le
          dimanche matin.
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-5 lg:px-10 mt-16 lg:mt-24">
        <div className="rounded-[var(--radius-frame)] bg-[color:var(--color-forest)] text-[color:var(--color-cream)] p-8 sm:p-12 lg:p-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl text-balance">
              Un projet sur mesure ?
            </h2>
            <p className="mt-3 text-[color:var(--color-cream)]/80 max-w-md">
              Mariage, événement, scénographie. Écrivez-nous, on revient vers
              vous sous 48h.
            </p>
          </div>
          <div className="md:text-right">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[color:var(--color-cream)] text-[color:var(--color-forest)] hover:bg-white transition-colors"
            >
              Nous écrire <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-[var(--radius-soft)] bg-[color:var(--color-cream)] border border-black/5">
      <span className="inline-flex w-9 h-9 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] items-center justify-center">
        {icon}
      </span>
      <h3 className="mt-4 text-xl font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
        {title}
      </h3>
      <p className="mt-2 text-sm text-[color:var(--color-mute)]">{children}</p>
    </div>
  );
}
