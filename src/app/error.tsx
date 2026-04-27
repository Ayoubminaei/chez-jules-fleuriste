"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto max-w-2xl px-5 lg:px-10 mt-16 lg:mt-24 text-center">
      <span className="text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-terracotta)]">
        Une fleur est tombée
      </span>
      <h1 className="mt-3 text-4xl lg:text-6xl text-[color:var(--color-forest)] font-[family-name:var(--font-display)] text-balance">
        Quelque chose s&rsquo;est passé de travers.
      </h1>
      <p className="mt-4 text-[color:var(--color-mute)] max-w-md mx-auto">
        Réessayez dans un instant. Si le problème persiste, écrivez-nous.
      </p>
      {error.digest && (
        <p className="mt-2 text-[11px] text-[color:var(--color-mute)] font-mono">
          ref · {error.digest}
        </p>
      )}
      <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Réessayer
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-black/15 hover:bg-[color:var(--color-cream)] transition-colors"
        >
          <Home className="w-4 h-4" /> Retour à l&rsquo;accueil
        </Link>
      </div>
    </section>
  );
}
