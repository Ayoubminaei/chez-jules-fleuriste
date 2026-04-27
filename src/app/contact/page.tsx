import { Mail, MapPin, Phone, Clock } from "lucide-react";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 lg:px-10 mt-8 lg:mt-12 grid lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-5">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-terracotta)]">
          Écrivez-nous
        </span>
        <h1 className="mt-2 text-3xl lg:text-5xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)] text-balance">
          On vous répond sous 48h.
        </h1>
        <p className="mt-3 text-[color:var(--color-mute)] max-w-md">
          Pour les commandes sur mesure, mariages et événements, ou simplement
          une question sur les arrivages.
        </p>

        <ul className="mt-8 space-y-4 text-sm">
          <Info icon={<MapPin className="w-4 h-4" />}>
            14 rue des Martyrs, 75009 Paris
          </Info>
          <Info icon={<Phone className="w-4 h-4" />}>
            <a href="tel:+33145000000" className="hover:underline">01 45 00 00 00</a>
          </Info>
          <Info icon={<Mail className="w-4 h-4" />}>
            <a href="mailto:bonjour@chez-jules.fr" className="hover:underline">
              bonjour@chez-jules.fr
            </a>
          </Info>
          <Info icon={<Clock className="w-4 h-4" />}>
            Mar–Sam 10h–19h30 · Dim 10h–13h30
          </Info>
        </ul>
      </div>

      <form className="lg:col-span-7 rounded-[var(--radius-frame)] bg-[color:var(--color-cream)] border border-black/5 p-6 sm:p-8 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Prénom" name="firstName" />
          <Field label="Nom" name="lastName" />
        </div>
        <Field label="Email" name="email" type="email" />
        <Field label="Sujet" name="subject" />
        <div>
          <label htmlFor="message" className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--color-forest)] resize-none"
            placeholder="Dites-nous tout"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors text-sm"
        >
          Envoyer le message
        </button>
      </form>
    </section>
  );
}

function Info({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-3">
      <span className="w-9 h-9 rounded-full bg-[color:var(--color-cream)] border border-black/5 flex items-center justify-center text-[color:var(--color-forest)]">
        {icon}
      </span>
      <span>{children}</span>
    </li>
  );
}

function Field({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="mt-1.5 w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-forest)]"
      />
    </div>
  );
}
