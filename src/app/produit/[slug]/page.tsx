import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Heart, Truck, Leaf, Shield } from "lucide-react";
import {
  products,
  getProduct,
  getCategory,
  getAdjacentProducts,
} from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { formatPrice } from "@/lib/utils";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return { title: p.name, description: p.description };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return notFound();

  const cat = getCategory(product.categorySlug);
  const { prev, next } = getAdjacentProducts(slug);
  const related = products
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== slug)
    .slice(0, 4);

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 lg:px-10 mt-6">
        <nav className="text-xs text-[color:var(--color-mute)] flex items-center gap-2">
          <Link href="/" className="hover:underline">Accueil</Link>
          <span>/</span>
          {cat && (
            <>
              <Link
                href={`/categorie/${cat.slug}`}
                className="hover:underline"
              >
                {cat.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="truncate max-w-[40vw]">{product.name}</span>
        </nav>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-10 mt-5 lg:mt-8 grid lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="md:col-span-6 relative aspect-[4/5] md:aspect-[5/4] rounded-[var(--radius-frame)] overflow-hidden bg-black/5">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
            {product.images.slice(1).map((src) => (
              <div
                key={src}
                className="md:col-span-3 relative aspect-square rounded-[var(--radius-soft)] overflow-hidden bg-black/5"
              >
                <Image
                  src={src}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 30vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
          {cat && (
            <span className="text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-terracotta)]">
              {cat.name}
            </span>
          )}
          <h1 className="mt-2 text-3xl lg:text-5xl text-[color:var(--color-forest)] text-balance">
            {product.name}
          </h1>
          <p className="mt-3 text-[color:var(--color-mute)] text-pretty">
            {product.longDescription}
          </p>

          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-3xl font-[family-name:var(--font-display)] tabular-nums">
              {formatPrice(product.priceCents)}
            </span>
            <span className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
              Taille {product.size}
            </span>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              disabled={!product.inStock}
              className="flex-1 min-w-[180px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.inStock ? "Ajouter au panier" : "Indisponible"}
            </button>
            <button
              aria-label="Ajouter aux favoris"
              className="w-12 h-12 rounded-full border border-black/10 bg-white hover:bg-[color:var(--color-cream)] flex items-center justify-center transition-colors"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <Bullet icon={<Truck className="w-3.5 h-3.5" />}>Livraison Paris 2h</Bullet>
            <Bullet icon={<Leaf className="w-3.5 h-3.5" />}>Composé le matin</Bullet>
            <Bullet icon={<Shield className="w-3.5 h-3.5" />}>Fraîcheur garantie 5j</Bullet>
          </div>

          {product.composition.length > 0 && (
            <div className="mt-8 pt-6 border-t border-black/10">
              <h3 className="text-sm uppercase tracking-widest text-[color:var(--color-mute)]">
                Composition
              </h3>
              <ul className="mt-3 grid grid-cols-2 gap-y-1.5 text-sm">
                {product.composition.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[color:var(--color-forest)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Prev / next product navigation */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10 mt-16 lg:mt-24">
        <div className="border-t border-black/10 pt-6 grid grid-cols-2 gap-3">
          {prev && (
            <Link
              href={`/produit/${prev.slug}`}
              className="group relative overflow-hidden rounded-[var(--radius-soft)] aspect-[5/2] sm:aspect-[7/2]"
            >
              <Image
                src={prev.images[0]}
                alt={prev.name}
                fill
                sizes="50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/10" />
              <div className="absolute inset-0 p-4 sm:p-6 flex items-center gap-3 text-white">
                <span className="w-9 h-9 rounded-full bg-white/95 text-[color:var(--color-forest)] flex items-center justify-center group-hover:-translate-x-0.5 transition-transform">
                  <ArrowLeft className="w-4 h-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-widest opacity-80">
                    Article précédent
                  </span>
                  <span className="block font-[family-name:var(--font-display)] text-lg sm:text-xl truncate">
                    {prev.name}
                  </span>
                </span>
              </div>
            </Link>
          )}
          {next && (
            <Link
              href={`/produit/${next.slug}`}
              className="group relative overflow-hidden rounded-[var(--radius-soft)] aspect-[5/2] sm:aspect-[7/2]"
            >
              <Image
                src={next.images[0]}
                alt={next.name}
                fill
                sizes="50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-black/10" />
              <div className="absolute inset-0 p-4 sm:p-6 flex items-center justify-end gap-3 text-white text-right">
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-widest opacity-80">
                    Article suivant
                  </span>
                  <span className="block font-[family-name:var(--font-display)] text-lg sm:text-xl truncate">
                    {next.name}
                  </span>
                </span>
                <span className="w-9 h-9 rounded-full bg-white/95 text-[color:var(--color-forest)] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 lg:px-10 mt-16 lg:mt-24">
          <h2 className="text-2xl lg:text-3xl text-[color:var(--color-forest)]">
            Dans le même esprit
          </h2>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Bullet({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[color:var(--color-cream)] border border-black/5">
      <span className="text-[color:var(--color-forest)]">{icon}</span>
      <span className="text-[color:var(--color-ink)]/80 truncate">
        {children}
      </span>
    </div>
  );
}
