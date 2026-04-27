import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Story() {
  return (
    <section className="container-x py-20 md:py-28">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-(--radius-lg)">
          <Image
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80"
            alt="Atelier du fleuriste"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-(--color-muted)">
            La maison
          </p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl tracking-tight text-balance">
            Un atelier, deux mains, mille fleurs.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-(--color-muted) md:text-lg">
            Depuis 2014, Jules compose chaque bouquet dans son atelier
            parisien. Producteurs locaux, fleurs de saison, papiers
            recyclés — la simplicité au service du geste.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/a-propos">Notre histoire</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/contact">Prendre rendez-vous</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
