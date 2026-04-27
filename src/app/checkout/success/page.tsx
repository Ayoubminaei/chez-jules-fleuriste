import Link from "next/link";
import { Check, Mail, ArrowRight } from "lucide-react";
import { ClearCartOnMount } from "./ClearCartOnMount";

export const metadata = { title: "Commande confirmée" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  return (
    <section className="mx-auto max-w-2xl px-5 lg:px-10 mt-12 lg:mt-20">
      <ClearCartOnMount />
      <div className="rounded-[var(--radius-frame)] bg-[color:var(--color-cream)] border border-black/5 p-8 sm:p-12 text-center">
        <span className="inline-flex w-14 h-14 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] items-center justify-center">
          <Check className="w-6 h-6" />
        </span>
        <h1 className="mt-5 text-3xl lg:text-5xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)] text-balance">
          Merci pour votre commande !
        </h1>
        <p className="mt-3 text-[color:var(--color-mute)] max-w-md mx-auto">
          Jules vient d&rsquo;être prévenu et commence la composition. Un email
          de confirmation arrive dans votre boîte.
        </p>

        {session_id && (
          <p className="mt-4 text-[11px] text-[color:var(--color-mute)] font-mono">
            réf · {session_id.slice(0, 24)}…
          </p>
        )}

        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors"
          >
            Retour à l&rsquo;accueil <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-black/15 hover:bg-white transition-colors"
          >
            <Mail className="w-4 h-4" /> Une question ?
          </Link>
        </div>
      </div>
    </section>
  );
}
