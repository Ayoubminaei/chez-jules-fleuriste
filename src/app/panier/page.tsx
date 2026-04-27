import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Panier" };

export default function CartPage() {
  return (
    <>
      <PageHeader eyebrow="Panier" title="Votre sélection." />
      <div className="container-x pb-24">
        <div className="rounded-(--radius-lg) border border-dashed border-(--color-line) bg-white/40 p-10 text-center">
          <p className="text-(--color-muted)">
            Votre panier est vide pour le moment.
          </p>
          <Button asChild className="mt-6">
            <Link href="/catalogue">Découvrir la boutique</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
