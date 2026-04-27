import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, Sparkles, Truck } from "lucide-react";
import { categories, getFeaturedProducts } from "@/lib/data";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { ProductCard } from "@/components/ui/ProductCard";
import { MobileStories } from "@/components/ui/MobileStories";

export default function HomePage() {
  const featured = getFeaturedProducts();
  const heroCat = categories[0];
  const sideCats = categories.slice(1, 3);

  return (
    <>
      <MobileStories categories={categories} />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10 pt-2 md:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7">
          <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[560px] rounded-[var(--radius-frame)] overflow-hidden grain">
            <Image
              src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=2000&q=85"
              alt="Atelier de Jules"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/20 to-transparent" />
            <div className="absolute inset-0 p-6 sm:p-10 lg:p-14 flex flex-col justify-end">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-forest)] w-fit">
                <Leaf className="w-3.5 h-3.5" /> Saison · Avril
              </span>
              <h1 className="mt-4 text-white font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-7xl leading-[1.02] text-balance max-w-3xl">
                Des fleurs cueillies <em className="font-light italic">comme on raconte</em> une histoire.
              </h1>
              <p className="mt-4 text-white/85 max-w-md text-pretty">
                Atelier de Jules, fleuriste artisan à Paris 9ᵉ. Pivoines, dahlias,
                roses anciennes — composés à la main chaque matin.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/categorie/bouquets-signature"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[color:var(--color-cream)] text-[color:var(--color-forest)] hover:bg-white transition-colors"
                >
                  Voir les bouquets <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/categorie/abonnements"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/40 text-white hover:bg-white/10 transition-colors"
                >
                  Abonnements
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 gap-5 lg:gap-7">
            {sideCats.map((c, i) => (
              <CategoryCard key={c.slug} category={c} size="md" index={i + 1} />
            ))}
          </div>
        </div>

        {/* Trust bar */}
        <div className="mt-7 lg:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
          <Pill icon={<Truck className="w-4 h-4" />}>Livraison Paris en 2h</Pill>
          <Pill icon={<Leaf className="w-4 h-4" />}>Composé à la main, le matin même</Pill>
          <Pill icon={<Sparkles className="w-4 h-4" />}>Producteurs Île-de-France</Pill>
        </div>
      </section>

      {/* Categories — beautiful frames */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10 mt-14 lg:mt-28">
        <header className="flex items-end justify-between gap-6 mb-6 sm:mb-8">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-mute)]">
              Nos univers
            </span>
            <h2 className="mt-2 text-[26px] sm:text-4xl lg:text-5xl text-[color:var(--color-forest)] text-balance max-w-2xl leading-tight">
              Choisissez l&rsquo;esprit, on s&rsquo;occupe du reste.
            </h2>
          </div>
          <Link
            href="/categorie/bouquets-signature"
            className="hidden md:inline-flex items-center gap-1 text-sm hover:underline shrink-0"
          >
            Toutes les catégories <ArrowRight className="w-4 h-4" />
          </Link>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div className="col-span-2 md:col-span-2 md:row-span-2">
            <CategoryCard category={heroCat} size="lg" index={0} />
          </div>
          {categories.slice(1).map((c, i) => (
            <CategoryCard key={c.slug} category={c} index={i + 1} />
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10 mt-20 lg:mt-28">
        <header className="flex items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-mute)]">
              Coups de cœur
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl text-[color:var(--color-forest)] text-balance">
              La sélection de Jules cette semaine.
            </h2>
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featured.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Editorial band */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10 mt-20 lg:mt-28">
        <div className="rounded-[var(--radius-frame)] overflow-hidden bg-[color:var(--color-forest)] text-[color:var(--color-cream)] grid md:grid-cols-2">
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1600&q=85"
              alt="Abonnements Chez Jules"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-bloom)]">
              Abonnements
            </span>
            <h2 className="mt-3 text-3xl lg:text-5xl text-balance">
              Des fleurs fraîches, chaque jeudi, sans y penser.
            </h2>
            <p className="mt-4 text-[color:var(--color-cream)]/80 max-w-md text-pretty">
              Recevez chez vous un bouquet de saison composé pour vous.
              Sans engagement, suspendable d&rsquo;un clic. À partir de 45 €.
            </p>
            <div className="mt-6">
              <Link
                href="/categorie/abonnements"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[color:var(--color-cream)] text-[color:var(--color-forest)] hover:bg-white transition-colors w-fit"
              >
                Découvrir les formules <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Pill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[color:var(--color-cream)] border border-black/5 text-sm">
      <span className="text-[color:var(--color-forest)]">{icon}</span>
      <span className="text-[color:var(--color-ink)]/80">{children}</span>
    </div>
  );
}
