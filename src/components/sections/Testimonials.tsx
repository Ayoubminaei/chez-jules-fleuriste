import { Star } from "lucide-react";

const items = [
  {
    quote:
      "Le bouquet est arrivé encore plus beau qu’en photo. Ma mère a pleuré.",
    name: "Camille R.",
    city: "Paris",
  },
  {
    quote: "Service impeccable, livraison à l’heure, fleurs splendides.",
    name: "Marc D.",
    city: "Boulogne",
  },
  {
    quote:
      "L’abonnement mensuel est devenu mon petit rituel du vendredi. Magique.",
    name: "Léa B.",
    city: "Paris",
  },
];

export function Testimonials() {
  return (
    <section className="bg-(--color-sage-50)">
      <div className="container-x py-20 md:py-28">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-(--color-muted)">
            Ils en parlent
          </p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl tracking-tight text-balance">
            Des fleurs qui font sourire.
          </h2>
        </header>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col gap-4 rounded-(--radius-lg) bg-white/80 p-6 ring-1 ring-(--color-line)"
            >
              <div className="flex gap-0.5 text-(--color-gold)">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="font-display text-xl leading-snug text-(--color-ink)">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-auto text-sm text-(--color-muted)">
                {t.name} · {t.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
