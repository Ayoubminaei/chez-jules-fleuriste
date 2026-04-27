import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Commande" };

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Commande"
        title="Livraison & paiement."
        description="Choix livraison ou retrait, créneau précis, Stripe — Sprint 3."
      />
      <div className="container-x pb-24">
        <div className="rounded-(--radius-lg) border border-dashed border-(--color-line) bg-white/40 p-10 text-center text-(--color-muted)">
          Tunnel de checkout en construction.
        </div>
      </div>
    </>
  );
}
