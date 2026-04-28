import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "Nouveau produit" };

export default async function NewProductPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = (await supabase
    ?.from("categories")
    .select("slug,name")
    .order("position")) ?? { data: null };

  const categories = (data as { slug: string; name: string }[]) ?? [];

  return (
    <div>
      <Link
        href="/admin/produits"
        className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-mute)] hover:text-[color:var(--color-forest)]"
      >
        <ArrowLeft className="w-4 h-4" /> Retour aux produits
      </Link>
      <h1 className="mt-3 text-2xl lg:text-3xl font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
        Nouveau produit
      </h1>

      <div className="mt-6">
        <ProductForm
          isNew
          categories={categories}
          initial={{
            slug: "",
            name: "",
            category_slug: categories[0]?.slug ?? "",
            price_cents: 0,
            description: "",
            long_description: "",
            size: "M",
            in_stock: true,
            featured: false,
            images: [],
            composition: [],
          }}
        />
      </div>
    </div>
  );
}
