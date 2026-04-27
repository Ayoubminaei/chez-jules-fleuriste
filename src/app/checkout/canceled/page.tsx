import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Paiement annulé" };

export default function CheckoutCanceledPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 lg:px-10 mt-12 lg:mt-20">
      <div className="rounded-[var(--radius-frame)] bg-[color:var(--color-cream)] border border-black/5 p-8 sm:p-12 text-center">
        <h1 className="text-3xl lg:text-5xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)] text-balance">
          Paiement annulé
        </h1>
        <p className="mt-3 text-[color:var(--color-mute)] max-w-md mx-auto">
          Aucun montant n&rsquo;a été débité. Votre panier est intact et vous
          attend.
        </p>
        <div className="mt-8">
          <Link
            href="/panier"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour au panier
          </Link>
        </div>
      </div>
    </section>
  );
}
