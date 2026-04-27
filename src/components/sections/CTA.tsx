import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="container-x py-20 md:py-28">
      <div className="relative overflow-hidden rounded-(--radius-xl) bg-(--color-forest) text-(--color-cream) shadow-(--shadow-float)">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1561181286-d5c92b600cc5?auto=format&fit=crop&w=1800&q=80"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="relative grid items-center gap-8 p-10 md:grid-cols-[1.4fr_1fr] md:gap-12 md:p-16">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-(--color-bloom)">
              Abonnements
            </p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl tracking-tight text-balance">
              Des fleurs fraîches, chaque semaine, livrées chez vous.
            </h2>
            <p className="mt-4 max-w-xl text-(--color-cream)/80 leading-relaxed">
              Un bouquet de saison, composé pour vous, livré sans effort.
              Pause, reprise ou annulation en un clic.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button asChild variant="accent" size="lg">
              <Link href="/abonnements">Découvrir les formules</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="bg-white/10 text-(--color-cream) border-white/25 hover:bg-white/20 hover:border-white/40"
            >
              <Link href="/contact">Nous écrire</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
