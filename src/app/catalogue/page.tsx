import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Bouquets, plantes et compositions de saison. Filtrez par occasion, couleur ou prix.",
};

export default function CataloguePage() {
  return (
    <>
      <PageHeader
        eyebrow="Boutique"
        title="Composer son bonheur."
        description="Bouquets, plantes et compositions de saison. Choisissez par occasion, par couleur ou laissez-vous porter."
      />
      <div className="container-x pb-24">
        <div className="rounded-(--radius-lg) border border-dashed border-(--color-line) bg-white/40 p-10 text-center text-(--color-muted)">
          Le catalogue arrive très bientôt. Filtres (prix · occasion ·
          couleur · type) et tri en cours d’assemblage — Sprint 2.
        </div>
      </div>
    </>
  );
}
