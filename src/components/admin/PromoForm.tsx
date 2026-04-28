"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { upsertPromoAction } from "@/app/admin/_actions";

type Kind = "percent" | "fixed" | "free_shipping";

export function PromoForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(upsertPromoAction, undefined);
  const [kind, setKind] = useState<Kind>("percent");

  if (state && "ok" in state && state.ok) {
    // success — back to list
    router.push("/admin/promotions");
  }

  return (
    <form
      action={action}
      className="rounded-[var(--radius-frame)] bg-white border border-black/5 p-5 sm:p-6 space-y-5"
    >
      <div>
        <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
          Code
        </label>
        <input
          name="code"
          required
          maxLength={40}
          autoCapitalize="characters"
          className="mt-1.5 w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm uppercase tracking-wider focus:outline-none focus:border-[color:var(--color-forest)]"
          placeholder="PRINTEMPS24"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
          Type
        </label>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {(
            [
              { value: "percent", label: "Pourcentage" },
              { value: "fixed", label: "Montant fixe" },
              { value: "free_shipping", label: "Livraison" },
            ] as { value: Kind; label: string }[]
          ).map((k) => (
            <label key={k.value} className="cursor-pointer">
              <input
                type="radio"
                name="kind"
                value={k.value}
                checked={kind === k.value}
                onChange={() => setKind(k.value)}
                className="peer sr-only"
              />
              <span className="block text-center px-3 py-2 rounded-full border border-black/10 text-xs sm:text-sm peer-checked:bg-[color:var(--color-forest)] peer-checked:text-[color:var(--color-cream)] peer-checked:border-[color:var(--color-forest)]">
                {k.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {kind !== "free_shipping" && (
        <div>
          <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
            Valeur {kind === "percent" ? "(%)" : "(centimes)"}
          </label>
          <input
            name="value_int"
            type="number"
            min={0}
            required
            className="mt-1.5 w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-forest)]"
            placeholder={kind === "percent" ? "10" : "1000"}
          />
          <p className="text-[11px] text-[color:var(--color-mute)] mt-1">
            {kind === "percent"
              ? "Pourcentage de remise (1–100)."
              : "Montant en centimes (1000 = 10 €)."}
          </p>
        </div>
      )}
      {kind === "free_shipping" && (
        <input type="hidden" name="value_int" value={0} />
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
            Min. panier (centimes)
          </label>
          <input
            name="min_subtotal_cents"
            type="number"
            min={0}
            defaultValue={0}
            className="mt-1.5 w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-forest)]"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
            Limite d&rsquo;utilisations
          </label>
          <input
            name="max_redemptions"
            type="number"
            min={1}
            placeholder="∞"
            className="mt-1.5 w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-forest)]"
          />
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
          Expire le
        </label>
        <input
          name="ends_at"
          type="datetime-local"
          className="mt-1.5 w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-forest)]"
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <span className="relative shrink-0 mt-0.5">
          <input
            type="checkbox"
            name="active"
            defaultChecked
            className="peer sr-only"
          />
          <span className="block w-9 h-5 rounded-full bg-black/15 peer-checked:bg-[color:var(--color-forest)] transition-colors" />
          <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
        </span>
        <span className="text-sm">Activer immédiatement</span>
      </label>

      {state?.error && (
        <div className="rounded-2xl bg-[color:var(--color-bloom)]/30 px-4 py-3 text-sm">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors text-sm disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Enregistrement…
          </>
        ) : (
          "Créer le code"
        )}
      </button>
    </form>
  );
}
