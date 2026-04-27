import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  categories,
  getCategory,
  getProductsByCategory,
} from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { MobileStories } from "@/components/ui/MobileStories";
import { MobileFeed } from "@/components/ui/MobileFeed";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return notFound();

  const products = getProductsByCategory(slug);
  const idx = categories.findIndex((c) => c.slug === slug);
  const prev = categories[(idx - 1 + categories.length) % categories.length];
  const next = categories[(idx + 1) % categories.length];

  return (
    <>
      {/* Mobile Instagram-style stories at the very top */}
      <MobileStories categories={categories} activeSlug={slug} />

      {/* Header — desktop */}
      <section className="hidden md:block mx-auto max-w-7xl px-5 lg:px-10 mt-6">
        <nav className="text-xs text-[color:var(--color-mute)] flex items-center gap-2">
          <Link href="/" className="hover:underline">Accueil</Link>
          <span>/</span>
          <span>{cat.name}</span>
        </nav>

        <div className="mt-5 grid lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-terracotta)]">
              {cat.tagline}
            </span>
            <h1 className="mt-2 text-4xl lg:text-6xl text-[color:var(--color-forest)] text-balance">
              {cat.name}
            </h1>
            <p className="mt-4 max-w-xl text-[color:var(--color-mute)] text-pretty">
              {cat.description}
            </p>
          </div>
          <div className="lg:col-span-5 flex lg:justify-end gap-2">
            <Link
              href={`/categorie/${prev.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-black/10 bg-white hover:bg-[color:var(--color-cream)] transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> {prev.name}
            </Link>
            <Link
              href={`/categorie/${next.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors text-sm"
            >
              {next.name} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Category banner */}
        <div className="mt-6 relative aspect-[21/9] rounded-[var(--radius-frame)] overflow-hidden grain">
          <Image
            src={cat.image}
            alt={cat.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </section>

      {/* Mobile header */}
      <section className="md:hidden px-5 mt-2">
        <h1 className="text-3xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)]">
          {cat.name}
        </h1>
        <p className="mt-1 text-sm text-[color:var(--color-mute)]">
          {cat.tagline}
        </p>
      </section>

      {/* Products — desktop grid */}
      <section className="hidden md:block mx-auto max-w-7xl px-5 lg:px-10 mt-12">
        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Products — mobile Instagram feed */}
      {products.length === 0 ? (
        <div className="md:hidden px-5 mt-8">
          <EmptyState />
        </div>
      ) : (
        <MobileFeed products={products} />
      )}

      {/* Cross-category navigation footer */}
      <section className="mx-auto max-w-7xl px-5 lg:px-10 mt-16 lg:mt-24">
        <div className="border-t border-black/10 pt-6 flex items-center justify-between gap-4">
          <Link
            href={`/categorie/${prev.slug}`}
            className="flex items-center gap-3 group min-w-0"
          >
            <span className="w-10 h-10 rounded-full bg-[color:var(--color-cream)] border border-black/10 flex items-center justify-center group-hover:-translate-x-0.5 transition-transform">
              <ArrowLeft className="w-4 h-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-widest text-[color:var(--color-mute)]">
                Précédente
              </span>
              <span className="block text-base text-[color:var(--color-forest)] truncate">
                {prev.name}
              </span>
            </span>
          </Link>
          <Link
            href={`/categorie/${next.slug}`}
            className="flex items-center gap-3 group text-right min-w-0"
          >
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-widest text-[color:var(--color-mute)]">
                Suivante
              </span>
              <span className="block text-base text-[color:var(--color-forest)] truncate">
                {next.name}
              </span>
            </span>
            <span className="w-10 h-10 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[var(--radius-frame)] border border-dashed border-black/15 p-10 text-center bg-[color:var(--color-cream)]">
      <h3 className="text-2xl text-[color:var(--color-forest)]">
        Bientôt en vitrine
      </h3>
      <p className="mt-2 text-sm text-[color:var(--color-mute)] max-w-md mx-auto">
        Les compositions de cette catégorie arrivent. Inscrivez-vous à la
        newsletter pour être prévenu·e dès le premier arrivage.
      </p>
    </div>
  );
}
