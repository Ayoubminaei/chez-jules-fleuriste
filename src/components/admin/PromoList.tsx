"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2, Copy, Check } from "lucide-react";
import { deletePromoAction } from "@/app/admin/_actions";
import { formatPrice } from "@/lib/utils";

type Row = {
  code: string;
  kind: "percent" | "fixed" | "free_shipping";
  value_int: number;
  min_subtotal_cents: number;
  max_redemptions: number | null;
  redeemed_count: number;
  ends_at: string | null;
  active: boolean;
};

function describe(p: Row) {
  if (p.kind === "percent") return `-${p.value_int}%`;
  if (p.kind === "fixed") return `-${formatPrice(p.value_int)}`;
  return "Livraison offerte";
}

export function PromoList({ promos }: { promos: Row[] }) {
  const [pending, start] = useTransition();
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function onDelete(code: string) {
    if (!confirm(`Supprimer le code ${code} ?`)) return;
    setBusy(code);
    start(async () => {
      await deletePromoAction(code);
      setBusy(null);
    });
  }

  if (promos.length === 0) {
    return (
      <div className="rounded-[var(--radius-frame)] border border-dashed border-black/15 px-6 py-12 text-center bg-[color:var(--color-cream)]">
        <p className="text-[color:var(--color-mute)] text-sm">
          Aucun code de réduction. Créez-en un pour les soldes ou la newsletter.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-frame)] bg-white border border-black/5 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-black/[0.02]">
          <tr className="text-[11px] uppercase tracking-widest text-[color:var(--color-mute)]">
            <th className="text-left px-4 py-3 font-medium">Code</th>
            <th className="text-left px-3 py-3 font-medium">Réduction</th>
            <th className="text-left px-3 py-3 font-medium">Min</th>
            <th className="text-left px-3 py-3 font-medium">Utilisations</th>
            <th className="text-left px-3 py-3 font-medium">Expire</th>
            <th className="text-left px-3 py-3 font-medium">Statut</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {promos.map((p) => (
            <tr key={p.code} className="border-t border-black/5">
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(p.code).catch(() => {});
                    setCopied(p.code);
                    window.setTimeout(() => setCopied(null), 1500);
                  }}
                  className="font-mono text-sm inline-flex items-center gap-1.5 hover:text-[color:var(--color-forest)]"
                >
                  {p.code}
                  {copied === p.code ? (
                    <Check className="w-3.5 h-3.5 text-[color:var(--color-forest)]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-40" />
                  )}
                </button>
              </td>
              <td className="px-3 py-3">{describe(p)}</td>
              <td className="px-3 py-3 text-[color:var(--color-mute)]">
                {p.min_subtotal_cents
                  ? formatPrice(p.min_subtotal_cents)
                  : "—"}
              </td>
              <td className="px-3 py-3 tabular-nums">
                {p.redeemed_count}
                {p.max_redemptions ? ` / ${p.max_redemptions}` : ""}
              </td>
              <td className="px-3 py-3 text-[color:var(--color-mute)] text-xs">
                {p.ends_at
                  ? new Date(p.ends_at).toLocaleDateString("fr-FR")
                  : "—"}
              </td>
              <td className="px-3 py-3">
                {p.active ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] bg-[color:var(--color-sage)]/30">
                    Actif
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] bg-black/10 text-[color:var(--color-mute)]">
                    Inactif
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onDelete(p.code)}
                  disabled={pending && busy === p.code}
                  className="p-1.5 hover:bg-black/5 rounded-full text-[color:var(--color-mute)] hover:text-[color:var(--color-terracotta)] disabled:opacity-50"
                  aria-label="Supprimer"
                >
                  {pending && busy === p.code ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
