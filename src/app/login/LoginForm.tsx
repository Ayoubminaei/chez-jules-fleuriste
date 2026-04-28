"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Auth indisponible");
      const redirectTo = `${window.location.origin}/auth/callback?next=${
        next ? encodeURIComponent(next) : "/"
      }`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) throw error;
      router.replace(`/login?sent=1${next ? `&next=${encodeURIComponent(next)}` : ""}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'envoi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-forest)]"
          placeholder="vous@email.fr"
          autoComplete="email"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors disabled:opacity-60 text-sm"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Envoi…
          </>
        ) : (
          <>
            <Mail className="w-4 h-4" /> Recevoir le lien
          </>
        )}
      </button>
      {error && (
        <p className="text-xs text-[color:var(--color-terracotta)]">{error}</p>
      )}
    </form>
  );
}
