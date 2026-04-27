"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

type Cadence = "weekly" | "biweekly" | "monthly";

const PLANS: {
  cadence: Cadence;
  name: string;
  perDeliveryCents: number;
  rhythm: string;
  highlight?: boolean;
  perks: string[];
}[] = [
  {
    cadence: "monthly",
    name: "Mensuel",
    perDeliveryCents: 4900,
    rhythm: "1 bouquet / mois",
    perks: ["1 bouquet de saison", "Livraison Paris incluse", "Pause illimitée"],
  },
  {
    cadence: "biweekly",
    name: "Bimensuel",
    perDeliveryCents: 4500,
    rhythm: "1 bouquet / 2 semaines",
    highlight: true,
    perks: [
      "1 bouquet de saison",
      "Livraison Paris incluse",
      "10% sur la boutique",
      "Pause illimitée",
    ],
  },
  {
    cadence: "weekly",
    name: "Hebdomadaire",
    perDeliveryCents: 3900,
    rhythm: "1 bouquet / semaine",
    perks: [
      "1 bouquet de saison",
      "Livraison Paris incluse",
      "15% sur la boutique",
      "Une carte cadeau offerte",
    ],
  },
];

export function CadencePicker() {
  const [selected, setSelected] = useState<Cadence>("biweekly");

  return (
    <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
      {PLANS.map((plan) => {
        const active = plan.cadence === selected;
        return (
          <button
            key={plan.cadence}
            type="button"
            onClick={() => setSelected(plan.cadence)}
            aria-pressed={active}
            className={cn(
              "relative text-left p-6 rounded-[var(--radius-frame)] border transition-all",
              active
                ? "bg-[color:var(--color-forest)] text-[color:var(--color-cream)] border-[color:var(--color-forest)] -translate-y-1 shadow-xl shadow-black/10"
                : "bg-[color:var(--color-cream)] border-black/10 hover:border-black/30",
              plan.highlight && !active && "border-[color:var(--color-terracotta)]/40"
            )}
          >
            {plan.highlight && (
              <span
                className={cn(
                  "absolute -top-3 left-6 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest",
                  active
                    ? "bg-[color:var(--color-bloom)] text-[color:var(--color-ink)]"
                    : "bg-[color:var(--color-terracotta)] text-white"
                )}
              >
                Le plus choisi
              </span>
            )}

            <div className="flex items-baseline justify-between gap-3">
              <h3
                className={cn(
                  "text-2xl font-[family-name:var(--font-display)]",
                  active ? "" : "text-[color:var(--color-forest)]"
                )}
              >
                {plan.name}
              </h3>
              <span
                className={cn(
                  "w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                  active
                    ? "border-[color:var(--color-cream)] bg-[color:var(--color-cream)] text-[color:var(--color-forest)]"
                    : "border-black/30"
                )}
              >
                {active && <Check className="w-3.5 h-3.5" />}
              </span>
            </div>

            <p
              className={cn(
                "mt-1 text-sm",
                active
                  ? "text-[color:var(--color-cream)]/80"
                  : "text-[color:var(--color-mute)]"
              )}
            >
              {plan.rhythm}
            </p>

            <div className="mt-5 flex items-baseline gap-1.5">
              <span className="text-3xl font-[family-name:var(--font-display)] tabular-nums">
                {formatPrice(plan.perDeliveryCents)}
              </span>
              <span
                className={cn(
                  "text-sm",
                  active
                    ? "text-[color:var(--color-cream)]/70"
                    : "text-[color:var(--color-mute)]"
                )}
              >
                / livraison
              </span>
            </div>

            <ul className="mt-5 space-y-2 text-sm">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2">
                  <Check
                    className={cn(
                      "w-3.5 h-3.5 shrink-0",
                      active
                        ? "text-[color:var(--color-bloom)]"
                        : "text-[color:var(--color-forest)]"
                    )}
                  />
                  <span
                    className={cn(
                      active
                        ? "text-[color:var(--color-cream)]/90"
                        : "text-[color:var(--color-ink)]/85"
                    )}
                  >
                    {perk}
                  </span>
                </li>
              ))}
            </ul>
          </button>
        );
      })}

      <div className="md:col-span-3 mt-4 flex items-center justify-center">
        <button
          type="button"
          onClick={() => {
            // Placeholder until Stripe Subscriptions is wired.
            window.location.href = "/login?next=/abonnements/checkout";
          }}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors"
        >
          Souscrire — formule {PLANS.find((p) => p.cadence === selected)?.name.toLowerCase()}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
