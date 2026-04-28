import { ADMIN_EMAIL, requireAdmin } from "@/lib/admin";
import { isStripeConfigured } from "@/lib/stripe";
import { isResendConfigured } from "@/lib/email";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { isServiceConfigured } from "@/lib/supabase/admin";

export const metadata = { title: "Paramètres" };

export default async function AdminSettingsPage() {
  await requireAdmin();

  const checks = [
    { label: "Supabase (lecture)", ok: isSupabaseConfigured() },
    { label: "Supabase (service role)", ok: isServiceConfigured() },
    { label: "Stripe Checkout", ok: isStripeConfigured() },
    {
      label: "Stripe Webhook",
      ok: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    },
    { label: "Resend (emails)", ok: isResendConfigured() },
    {
      label: "URL publique",
      ok: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
      hint: process.env.NEXT_PUBLIC_SITE_URL ?? "non définie",
    },
  ];

  return (
    <div>
      <header>
        <h1 className="text-2xl lg:text-3xl font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
          Paramètres
        </h1>
        <p className="text-sm text-[color:var(--color-mute)]">
          Vérification des intégrations et infos de la boutique.
        </p>
      </header>

      <section className="mt-6 rounded-[var(--radius-frame)] bg-white border border-black/5 p-5 sm:p-6">
        <h2 className="text-base font-medium">Compte admin</h2>
        <dl className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-[color:var(--color-mute)] text-xs uppercase tracking-widest">
              Email administrateur
            </dt>
            <dd className="mt-0.5 font-mono">{ADMIN_EMAIL}</dd>
          </div>
          <div>
            <dt className="text-[color:var(--color-mute)] text-xs uppercase tracking-widest">
              Modification
            </dt>
            <dd className="mt-0.5 text-[color:var(--color-mute)]">
              Variable Vercel{" "}
              <code className="px-1 py-0.5 rounded bg-black/5 text-xs">
                ADMIN_EMAIL
              </code>
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-[var(--radius-frame)] bg-white border border-black/5 p-5 sm:p-6">
        <h2 className="text-base font-medium">Intégrations</h2>
        <ul className="mt-3 divide-y divide-black/5">
          {checks.map((c) => (
            <li
              key={c.label}
              className="flex items-center justify-between py-2.5 text-sm"
            >
              <span>{c.label}</span>
              <span className="flex items-center gap-2">
                {c.hint && (
                  <span className="text-xs text-[color:var(--color-mute)]">
                    {c.hint}
                  </span>
                )}
                <span
                  className={
                    "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] " +
                    (c.ok
                      ? "bg-[color:var(--color-sage)]/30"
                      : "bg-[color:var(--color-bloom)]/40 text-[color:var(--color-ink)]")
                  }
                >
                  {c.ok ? "Configuré" : "À configurer"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
