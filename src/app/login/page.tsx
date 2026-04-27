import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <>
      <PageHeader
        eyebrow="Compte"
        title="Bon retour."
        description="Saisissez votre email pour recevoir un lien de connexion magique."
      />
      <div className="container-x pb-24">
        <form className="mx-auto flex max-w-md flex-col gap-3 rounded-(--radius-lg) border border-(--color-line) bg-white/60 p-8">
          <label className="text-xs uppercase tracking-[0.12em] text-(--color-muted)">
            Email
          </label>
          <Input type="email" placeholder="vous@exemple.com" required />
          <Button type="submit" className="mt-2">
            Recevoir un lien magique
          </Button>
          <p className="mt-2 text-center text-xs text-(--color-muted)">
            Authentification Supabase — branchée au Sprint 2.
          </p>
        </form>
      </div>
    </>
  );
}
