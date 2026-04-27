import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const collections = [
  {
    href: "/catalogue?cat=bouquets",
    label: "Bouquets",
    blurb: "L’art du moment offert",
    image:
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80",
  },
  {
    href: "/catalogue?cat=plantes",
    label: "Plantes",
    blurb: "Le vivant qui s’installe",
    image:
      "https://images.unsplash.com/photo-1462530260150-162092dbf011?auto=format&fit=crop&w=1200&q=80",
  },
  {
    href: "/catalogue?cat=evenements",
    label: "Événements",
    blurb: "Mariages, dîners, vitrines",
    image:
      "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?auto=format&fit=crop&w=1200&q=80",
  },
];

export function Collections() {
  return (
    <section className="container-x py-20 md:py-28">
      <header className="flex items-end justify-between gap-6 pb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-(--color-muted)">
            Nos univers
          </p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl tracking-tight text-balance">
            Trois manières d’offrir des fleurs.
          </h2>
        </div>
        <Link
          href="/catalogue"
          className="hidden md:inline-flex items-center gap-1 text-sm text-(--color-forest) hover:underline underline-offset-4"
        >
          Tout voir <ArrowUpRight className="h-4 w-4" />
        </Link>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {collections.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group relative aspect-[4/5] overflow-hidden rounded-(--radius-lg)"
          >
            <Image
              src={c.image}
              alt={c.label}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-(--color-cream)">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-white/75">
                  {c.blurb}
                </p>
                <h3 className="mt-1 font-display text-3xl">{c.label}</h3>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur transition-colors group-hover:bg-white group-hover:text-(--color-forest)">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
