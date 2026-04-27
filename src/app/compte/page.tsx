import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Mon compte" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <PageHeader
        eyebrow="Compte"
        title={user ? `Bonjour ${user.email?.split("@")[0]}.` : "Bienvenue."}
        description={
          user
            ? "Retrouvez vos commandes, vos adresses et vos favoris."
            : "Connectez-vous pour suivre vos commandes et sauvegarder vos favoris."
        }
      />
      <div className="container-x pb-24">
        {!user ? (
          <div className="rounded-(--radius-lg) border border-(--color-line) bg-white/60 p-10 text-center">
            <Button asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <Tile title="Mes commandes" href="/compte/commandes" />
            <Tile title="Mes favoris" href="/compte/favoris" />
            <Tile title="Mes adresses" href="/compte/adresses" />
          </div>
        )}
      </div>
    </>
  );
}

function Tile({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-(--radius-lg) border border-(--color-line) bg-white/60 p-6 transition-all hover:border-(--color-forest) hover:shadow-(--shadow-soft)"
    >
      <p className="font-display text-xl text-(--color-forest)">{title}</p>
    </Link>
  );
}
