import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Abonnements floraux",
  description:
    "Recevez un bouquet frais et de saison, hebdomadaire ou bi-mensuel.",
};

const plans = [
  {
    name: "Découverte",
    price: "29 € / mois",
    cadence: "1 bouquet / mois",
    perks: ["Petit format", "Fleurs de saison", "Pause possible"],
  },
  {
    name: "Maison",
    price: "55 € / mois",
    cadence: "2 bouquets / mois",
    perks: ["Format moyen", "Livraison incluse Paris", "Cadeau anniversaire"],
    featured: true,
  },
  {
    name: "Atelier",
    price: "99 € / mois",
    cadence: "4 bouquets / mois",
    perks: ["Grand format", "Variétés rares", "Atelier offert /an"],
  },
];

export default function AbonnementsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Abonnements"
        title="Des fleurs, en rituel."
        description="Recevez un bouquet de saison, composé pour vous, livré sans effort. Pause, reprise ou annulation en un clic."
      />
      <div className="container-x pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.name}
              className={`relative flex flex-col rounded-(--radius-lg) border p-8 transition-all ${
                p.featured
                  ? "border-(--color-forest) bg-(--color-forest) text-(--color-cream) shadow-(--shadow-float)"
                  : "border-(--color-line) bg-white/60"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-(--color-bloom) px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-(--color-forest)">
                  Préféré
                </span>
              )}
              <p className="text-xs uppercase tracking-[0.12em] opacity-70">
                {p.cadence}
              </p>
              <h2 className="mt-2 font-display text-3xl">{p.name}</h2>
              <p className="mt-1 text-2xl">{p.price}</p>
              <ul className="mt-6 flex flex-col gap-3 text-sm">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> {perk}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={p.featured ? "accent" : "primary"}
                className="mt-8 w-full"
              >
                <Link href="/abonnements/souscrire">Choisir</Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
