export const metadata = { title: "Mentions légales" };

export default function MentionsPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 lg:px-10 mt-8 lg:mt-12">
      <h1 className="text-3xl lg:text-5xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)]">
        Mentions légales
      </h1>
      <div className="mt-6 space-y-5 text-[color:var(--color-ink)]/85 text-sm leading-relaxed">
        <Section title="Éditeur">
          Chez Jules SARL au capital de 10 000€ — RCS Paris 999 999 999 — TVA
          FR00 999999999 — 14 rue des Martyrs, 75009 Paris.
        </Section>
        <Section title="Directeur de la publication">Jules Martin</Section>
        <Section title="Hébergeur">
          Vercel Inc., 340 S Lemon Ave #4133, Walnut CA 91789, USA.
        </Section>
        <Section title="Données personnelles">
          Vos données sont traitées dans le respect du RGPD. Pour exercer vos
          droits : bonjour@chez-jules.fr
        </Section>
        <Section title="Crédits">
          Photographies : Unsplash & atelier Chez Jules. Typographies : Fraunces
          & Inter (Google Fonts).
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
