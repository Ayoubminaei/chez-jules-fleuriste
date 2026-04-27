import Link from "next/link";
import { Instagram } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function Footer() {
  return (
    <footer className="mt-24 bg-(--color-forest) text-(--color-cream)">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl tracking-tight">
              Chez&nbsp;Jules
            </p>
            <p className="mt-4 max-w-sm text-sm text-(--color-cream)/75 leading-relaxed">
              Fleuriste artisan. Bouquets, plantes et compositions cueillis et
              façonnés à la main, livrés avec soin.
            </p>
            <form className="mt-8 max-w-sm">
              <label className="text-xs uppercase tracking-[0.12em] text-(--color-cream)/60">
                Lettre saisonnière
              </label>
              <div className="mt-2 flex gap-2">
                <Input
                  type="email"
                  placeholder="vous@exemple.com"
                  className="bg-white/5 border-white/15 text-(--color-cream) placeholder:text-(--color-cream)/40 focus:bg-white/10 focus:border-white/40"
                />
                <Button
                  type="submit"
                  variant="accent"
                  size="md"
                  className="shrink-0"
                >
                  S&apos;inscrire
                </Button>
              </div>
            </form>
          </div>

          <FooterCol
            title="Boutique"
            links={[
              { href: "/catalogue", label: "Tout voir" },
              { href: "/catalogue?cat=bouquets", label: "Bouquets" },
              { href: "/catalogue?cat=plantes", label: "Plantes" },
              { href: "/catalogue?cat=evenements", label: "Événements" },
              { href: "/abonnements", label: "Abonnements" },
            ]}
          />
          <FooterCol
            title="Maison"
            links={[
              { href: "/a-propos", label: "Notre histoire" },
              { href: "/livraison", label: "Livraison" },
              { href: "/entretien", label: "Conseils d’entretien" },
              { href: "/contact", label: "Contact" },
            ]}
          />
          <FooterCol
            title="Compte"
            links={[
              { href: "/compte", label: "Mon compte" },
              { href: "/compte/commandes", label: "Mes commandes" },
              { href: "/compte/favoris", label: "Mes favoris" },
              { href: "/login", label: "Connexion" },
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col-reverse gap-6 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-(--color-cream)/55">
            © {new Date().getFullYear()} Chez Jules. Tous droits réservés.
            ·{" "}
            <Link href="/mentions-legales" className="hover:text-(--color-cream)">
              Mentions légales
            </Link>{" "}
            ·{" "}
            <Link href="/cgv" className="hover:text-(--color-cream)">
              CGV
            </Link>{" "}
            ·{" "}
            <Link href="/confidentialite" className="hover:text-(--color-cream)">
              Confidentialité
            </Link>
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:bg-white/10 transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.12em] text-(--color-cream)/60">
        {title}
      </p>
      <ul className="mt-4 flex flex-col gap-2.5 text-sm text-(--color-cream)/85">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="hover:text-(--color-cream) transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
