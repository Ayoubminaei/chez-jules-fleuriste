import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, " "),
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;

  return (
    <>
      <PageHeader
        eyebrow="Produit"
        title={slug.replace(/-/g, " ")}
        description="Page produit en cours d’assemblage. Galerie, options, panier — Sprint 2."
      />
      <div className="container-x pb-24">
        <div className="rounded-(--radius-lg) border border-dashed border-(--color-line) bg-white/40 p-10 text-center text-(--color-muted)">
          Galerie haute définition · description · options de taille ·
          panier · avis clients arrivent bientôt.
        </div>
      </div>
    </>
  );
}
