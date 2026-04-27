export const metadata = { title: "CGV" };

export default function CgvPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 lg:px-10 mt-8 lg:mt-12 prose-style">
      <h1 className="text-3xl lg:text-5xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)]">
        Conditions générales de vente
      </h1>
      <div className="mt-6 space-y-5 text-[color:var(--color-ink)]/85 text-sm leading-relaxed">
        <p>
          Les présentes conditions générales s&rsquo;appliquent à toute commande
          passée sur le site chez-jules.fr, édité par Chez Jules SARL, 14 rue
          des Martyrs, 75009 Paris.
        </p>
        <Section title="Commandes">
          La commande est confirmée par un email de confirmation. Les bouquets
          sont composés à partir des arrivages du jour, certaines variétés
          peuvent être substituées par des fleurs équivalentes.
        </Section>
        <Section title="Livraison">
          Livraison Paris intra-muros sous 2h ouvrées. Île-de-France sous 24h.
          Frais de port offerts dès 80€ d&rsquo;achat.
        </Section>
        <Section title="Paiement">
          Paiement sécurisé Stripe. Cartes Visa, Mastercard, American Express.
        </Section>
        <Section title="Rétractation">
          Compte tenu de la nature périssable des produits, le droit de
          rétractation ne s&rsquo;applique pas (article L221-28 du Code de la
          consommation).
        </Section>
        <Section title="Contact">
          Pour toute réclamation : bonjour@chez-jules.fr
        </Section>
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-[family-name:var(--font-display)] text-[color:var(--color-forest)] mb-1.5">
        {title}
      </h2>
      <p>{children}</p>
    </div>
  );
}
