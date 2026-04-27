import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ui/ProductCard";

const demo: Product[] = [
  {
    id: "1",
    slug: "bouquet-aurore",
    name: "Bouquet Aurore",
    description: "Pivoines, renoncules, eucalyptus.",
    price_cents: 5900,
    compare_at_cents: null,
    category: "bouquets",
    occasions: ["anniversaire", "remerciement"],
    colors: ["rose", "blanc"],
    stock: 12,
    is_featured: true,
    is_new: true,
    image_url:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1000&q=80",
    created_at: "",
  },
  {
    id: "2",
    slug: "bouquet-foret",
    name: "Bouquet Forêt",
    description: "Roses anciennes, fougères, baies sauvages.",
    price_cents: 7200,
    compare_at_cents: 8400,
    category: "bouquets",
    occasions: ["anniversaire"],
    colors: ["rouge", "vert"],
    stock: 3,
    is_featured: true,
    is_new: false,
    image_url:
      "https://images.unsplash.com/photo-1471938537155-7de0bd123d0c?auto=format&fit=crop&w=1000&q=80",
    created_at: "",
  },
  {
    id: "3",
    slug: "monstera-deliciosa",
    name: "Monstera deliciosa",
    description: "Plante d’intérieur, pot terre cuite inclus.",
    price_cents: 4900,
    compare_at_cents: null,
    category: "plantes",
    occasions: ["tous-les-jours"],
    colors: ["vert"],
    stock: 8,
    is_featured: true,
    is_new: false,
    image_url:
      "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1000&q=80",
    created_at: "",
  },
  {
    id: "4",
    slug: "composition-table-dimanche",
    name: "Composition Table",
    description: "Centre de table, cire et fleurs sèches.",
    price_cents: 8500,
    compare_at_cents: null,
    category: "compositions",
    occasions: ["mariage"],
    colors: ["blanc", "orange"],
    stock: 5,
    is_featured: true,
    is_new: true,
    image_url:
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1000&q=80",
    created_at: "",
  },
];

export function Popular() {
  return (
    <section className="container-x pb-20 md:pb-28">
      <header className="flex items-end justify-between gap-6 pb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-(--color-muted)">
            Best-sellers
          </p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl tracking-tight text-balance">
            Les préférés de la saison.
          </h2>
        </div>
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-1 text-sm text-(--color-forest) hover:underline underline-offset-4"
        >
          Tout voir <ArrowUpRight className="h-4 w-4" />
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {demo.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
