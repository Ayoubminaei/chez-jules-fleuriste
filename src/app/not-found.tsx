import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-x grid place-items-center py-32 text-center">
      <p className="text-xs uppercase tracking-[0.18em] text-(--color-muted)">
        404 · Introuvable
      </p>
      <h1 className="mt-4 font-display text-5xl md:text-7xl tracking-tight">
        Cette fleur a fané.
      </h1>
      <p className="mt-4 max-w-md text-(--color-muted)">
        La page demandée n’existe plus. Retour au jardin.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Retour à l’accueil</Link>
      </Button>
    </section>
  );
}
