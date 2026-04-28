"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Auth indisponible");
      // No emailRedirectTo → Supabase will send a 6-digit code (token)
      // alongside the link. Email scanners can't pre-consume a typed code.
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      setStep("code");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'envoi");
    } finally {
      setSubmitting(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Auth indisponible");
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code.trim(),
        type: "email",
      });
      if (error) throw error;
      router.replace(next || "/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Code invalide ou expiré");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "code") {
    return (
      <form onSubmit={verify} className="space-y-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
            Code de connexion
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-center text-2xl font-mono tracking-[0.4em] focus:outline-none focus:border-[color:var(--color-forest)]"
            placeholder="••••••"
            autoComplete="one-time-code"
            autoFocus
          />
          <p className="mt-2 text-xs text-[color:var(--color-mute)]">
            Code envoyé à <strong>{email}</strong>. Tapez les chiffres reçus.
            Vérifiez vos spams si rien n&rsquo;arrive sous 1&nbsp;minute.
          </p>
        </div>
        <button
          type="submit"
          disabled={submitting || code.length < 6}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors disabled:opacity-60 text-sm"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Vérification…
            </>
          ) : (
            <>
              <KeyRound className="w-4 h-4" /> Se connecter
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setStep("email");
            setCode("");
            setError(null);
          }}
          className="text-xs text-[color:var(--color-mute)] hover:underline w-full text-center"
        >
          ← Changer d&rsquo;email
        </button>
        {error && (
          <p className="text-xs text-[color:var(--color-terracotta)] text-center">
            {error}
          </p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={sendCode} className="space-y-4">
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
            <Mail className="w-4 h-4" /> Recevoir un code
          </>
        )}
      </button>
      {error && (
        <p className="text-xs text-[color:var(--color-terracotta)]">{error}</p>
      )}
    </form>
  );
}
