import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata = { title: "Connexion" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <section className="mx-auto max-w-md px-5 lg:px-10 mt-12 lg:mt-20">
      <h1 className="text-3xl lg:text-4xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)] text-center">
        Bon retour
      </h1>
      <p className="mt-2 text-sm text-[color:var(--color-mute)] text-center">
        Recevez un code à 6 chiffres par email.
      </p>

      <div className="mt-8 rounded-[var(--radius-frame)] bg-[color:var(--color-cream)] border border-black/5 p-6 sm:p-8">
        {!configured ? (
          <div className="text-sm text-[color:var(--color-mute)] space-y-3">
            <p className="font-medium text-[color:var(--color-ink)]">
              Authentification en attente de configuration.
            </p>
            <p>
              Définissez <code>NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans votre projet
              Vercel pour activer la connexion.
            </p>
          </div>
        ) : (
          <LoginForm next={next} />
        )}
      </div>

      <p className="mt-6 text-sm text-center text-[color:var(--color-mute)]">
        En vous connectant vous acceptez nos{" "}
        <Link href="/cgv" className="underline">
          conditions
        </Link>
        .
      </p>
    </section>
  );
}
