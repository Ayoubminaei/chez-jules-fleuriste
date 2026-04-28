import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";

export function AdminSetup({ adminEmail }: { adminEmail: string }) {
  return (
    <section className="mx-auto max-w-2xl px-5 lg:px-10 mt-12 lg:mt-20">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-mute)] hover:text-[color:var(--color-forest)]"
      >
        <ArrowLeft className="w-4 h-4" /> Retour au site
      </Link>

      <div className="mt-6 rounded-[var(--radius-frame)] bg-[color:var(--color-cream)] border border-black/5 p-8 sm:p-12">
        <span className="inline-flex w-12 h-12 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] items-center justify-center">
          <KeyRound className="w-5 h-5" />
        </span>
        <h1 className="mt-4 text-3xl lg:text-4xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)]">
          Activer le panneau admin
        </h1>
        <p className="mt-3 text-sm text-[color:var(--color-mute)]">
          Pour activer l&rsquo;administration en ligne, suivez ces étapes une
          seule fois :
        </p>

        <ol className="mt-6 space-y-4 text-sm">
          <Step n={1} title="Créer un projet Supabase">
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              supabase.com/dashboard
            </a>{" "}
            → Nouveau projet.
          </Step>
          <Step n={2} title="Lancer les migrations SQL">
            Dans le SQL editor : exécutez{" "}
            <code className="px-1.5 py-0.5 rounded bg-black/5 text-xs">
              supabase/migrations/0001_init.sql
            </code>{" "}
            puis <code className="px-1.5 py-0.5 rounded bg-black/5 text-xs">0002_admin.sql</code> et enfin{" "}
            <code className="px-1.5 py-0.5 rounded bg-black/5 text-xs">supabase/seed.sql</code>.
          </Step>
          <Step n={3} title="Variables Vercel">
            Project Settings → Environment Variables :{" "}
            <code className="px-1 py-0.5 rounded bg-black/5 text-xs">
              NEXT_PUBLIC_SUPABASE_URL
            </code>
            ,{" "}
            <code className="px-1 py-0.5 rounded bg-black/5 text-xs">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>
            ,{" "}
            <code className="px-1 py-0.5 rounded bg-black/5 text-xs">
              SUPABASE_SERVICE_ROLE_KEY
            </code>
            ,{" "}
            <code className="px-1 py-0.5 rounded bg-black/5 text-xs">
              ADMIN_EMAIL={adminEmail}
            </code>
            .
          </Step>
          <Step n={4} title="Connectez-vous">
            Recevez un lien magique sur{" "}
            <strong>{adminEmail}</strong>, et accédez à{" "}
            <Link href="/admin" className="underline">
              /admin
            </Link>
            .
          </Step>
        </ol>
      </div>
    </section>
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
    <li className="flex gap-4">
      <span className="shrink-0 w-7 h-7 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] flex items-center justify-center text-xs">
        {n}
      </span>
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-base text-[color:var(--color-forest)]">
          {title}
        </h3>
        <p className="mt-0.5 text-[color:var(--color-mute)]">{children}</p>
      </div>
    </li>
  );
}
