import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative -mt-16 md:-mt-20 isolate overflow-hidden bg-(--color-bg)">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=2200&q=80"
          alt="Bouquet artisan composé à la main"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-(--color-bg)" />
      </div>

      <div className="container-x relative pt-40 pb-24 md:pt-56 md:pb-40">
        <div className="max-w-2xl">
          <p className="reveal text-xs uppercase tracking-[0.18em] text-(--color-cream)/85">
            Saison printemps · 2026
          </p>
          <h1 className="reveal reveal-delay-1 mt-5 font-display text-5xl leading-[1.04] tracking-tight text-(--color-cream) md:text-7xl text-balance">
            La beauté <em className="not-italic text-(--color-bloom)">simple</em>{" "}
            d&apos;un bouquet façonné à la main.
          </h1>
          <p className="reveal reveal-delay-2 mt-6 max-w-xl text-base leading-relaxed text-(--color-cream)/85 md:text-lg">
            Cueillis le matin, composés l&apos;après-midi, livrés le soir.
            Des fleurs fraîches, choisies une à une — pour vous, pour eux,
            pour la table de dimanche.
          </p>
          <div className="reveal reveal-delay-3 mt-10 flex flex-wrap gap-3">
            <Button asChild variant="primary" size="lg">
              <Link href="/catalogue">
                Découvrir la boutique <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="bg-white/90">
              <Link href="/abonnements">Offrir un abonnement</Link>
            </Button>
          </div>
        </div>

        <div className="reveal reveal-delay-4 mt-20 grid max-w-3xl grid-cols-3 gap-8 border-t border-white/15 pt-6 text-(--color-cream)">
          <Stat value="100%" label="Fleurs de saison" />
          <Stat value="J+0" label="Livraison Paris" />
          <Stat value="4,9 / 5" label="Avis Google" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl md:text-3xl">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-(--color-cream)/65">
        {label}
      </p>
    </div>
  );
}
