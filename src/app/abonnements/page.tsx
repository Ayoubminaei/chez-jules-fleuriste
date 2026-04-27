import Image from "next/image";
import { Leaf, Pause, RefreshCw, Truck } from "lucide-react";
import { CadencePicker } from "./CadencePicker";

export const metadata = {
  title: "Abonnements",
  description:
    "Recevez chez vous un bouquet de saison composé par Jules — chaque semaine, deux semaines ou tous les mois. Sans engagement.",
};

export default function AbonnementsPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 lg:px-10 mt-6 lg:mt-10 grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-terracotta)]">
            Abonnements
          </span>
          <h1 className="mt-3 text-4xl lg:text-6xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)] text-balance leading-[1.05]">
            Des fleurs fraîches, sans y penser.
          </h1>
          <p className="mt-4 text-[color:var(--color-mute)] max-w-md text-pretty">
            Chaque livraison est une nouvelle composition de saison, imaginée
            par Jules à partir des arrivages du matin. Vous gardez la main
            depuis votre compte : pause, sauter une livraison, changer la
            cadence à tout moment.
          </p>

          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
            <Bullet icon={<Leaf className="w-3.5 h-3.5" />}>De saison</Bullet>
            <Bullet icon={<Truck className="w-3.5 h-3.5" />}>Livraison incluse</Bullet>
            <Bullet icon={<Pause className="w-3.5 h-3.5" />}>Pause d&rsquo;un clic</Bullet>
            <Bullet icon={<RefreshCw className="w-3.5 h-3.5" />}>Sans engagement</Bullet>
          </ul>
        </div>

        <div className="lg:col-span-6 relative aspect-[4/5] lg:aspect-square rounded-[var(--radius-frame)] overflow-hidden grain">
          <Image
            src="https://images.unsplash.com/photo-1453747063559-36695c8771bd?auto=format&fit=crop&w=1600&q=85"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-10 mt-16 lg:mt-24">
        <header className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-mute)]">
            Choisissez votre cadence
          </span>
          <h2 className="mt-2 text-3xl lg:text-4xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)]">
            Une formule pour chaque rythme.
          </h2>
        </header>

        <div className="mt-10">
          <CadencePicker />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 lg:px-10 mt-20 lg:mt-28">
        <h2 className="text-2xl lg:text-3xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)] text-center">
          Comment ça marche
        </h2>
        <ol className="mt-8 grid sm:grid-cols-3 gap-4">
          <Step n={1} title="Choisissez la cadence">
            Hebdomadaire, bimensuelle, mensuelle.
          </Step>
          <Step n={2} title="Indiquez l'adresse">
            Paris ou Île-de-France. Choix du jour de livraison.
          </Step>
          <Step n={3} title="Recevez & savourez">
            Pause, saut ou résiliation à tout moment depuis votre compte.
          </Step>
        </ol>
      </section>
    </>
  );
}

function Bullet({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2.5 text-sm">
      <span className="w-7 h-7 rounded-full bg-[color:var(--color-cream)] border border-black/5 flex items-center justify-center text-[color:var(--color-forest)]">
        {icon}
      </span>
      {children}
    </li>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="p-6 rounded-[var(--radius-soft)] bg-[color:var(--color-cream)] border border-black/5">
      <span className="font-[family-name:var(--font-display)] text-3xl text-[color:var(--color-terracotta)]">
        0{n}
      </span>
      <h3 className="mt-2 text-lg font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
        {title}
      </h3>
      <p className="mt-1 text-sm text-[color:var(--color-mute)]">{children}</p>
    </li>
  );
}
