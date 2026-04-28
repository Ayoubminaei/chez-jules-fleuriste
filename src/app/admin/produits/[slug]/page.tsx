import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "Modifier un produit" };

type ProductRow = {
  slug: string;
  name: string;
  category_slug: string;
  price_cents: number;
  description: string;
  long_description: string;
  size: "S" | "M" | "L";
  in_stock: boolean;
  featured: boolean;
  images: string[];
  composition: string[];
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();
  const { slug } = await params;
  const supabase = await createClient();

  if (!supabase) return notFound();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select(
        "slug,name,category_slug,price_cents,description,long_description,size,in_stock,featured,images,composition"
      )
      .eq("slug", slug)
      .maybeSingle(),
    supabase.from("categories").select("slug,name").order("position"),
  ]);

  if (!product) return notFound();

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link
          href="/admin/produits"
          className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-mute)] hover:text-[color:var(--color-forest)]"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux produits
        </Link>
        <Link
          href={`/produit/${slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs text-[color:var(--color-mute)] hover:text-[color:var(--color-forest)]"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Voir sur le site
        </Link>
      </div>
      <h1 className="mt-3 text-2xl lg:text-3xl font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
        {(product as ProductRow).name}
      </h1>

      <div className="mt-6">
        <ProductForm
          isNew={false}
          categories={(categories as { slug: string; name: string }[]) ?? []}
          initial={product as ProductRow}
        />
      </div>
    </div>
  );
}
