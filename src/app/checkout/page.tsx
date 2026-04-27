import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export const metadata = { title: "Paiement" };

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-2xl px-5 lg:px-10 mt-12 lg:mt-20">
      <Link
        href="/panier"
        className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-mute)] hover:text-[color:var(--color-forest)]"
      >
        <ArrowLeft className="w-4 h-4" /> Retour au panier
      </Link>

      <div className="mt-6 rounded-[var(--radius-frame)] bg-[color:var(--color-cream)] border border-black/5 p-8 sm:p-12 text-center">
        <span className="inline-flex w-12 h-12 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] items-center justify-center">
          <Lock className="w-5 h-5" />
        </span>
        <h1 className="mt-4 text-3xl lg:text-4xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)]">
          Paiement sécurisé
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-mute)] max-w-md mx-auto">
          L&rsquo;intégration Stripe Checkout sera branchée à cette étape pour
          finaliser la commande, choisir le créneau de livraison et écrire le
          mot d&rsquo;accompagnement.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[color:var(--color-mute)] uppercase tracking-widest">
          <Lock className="w-3 h-3" /> 256-bit SSL · Stripe
        </div>
      </div>
    </section>
  );
}
