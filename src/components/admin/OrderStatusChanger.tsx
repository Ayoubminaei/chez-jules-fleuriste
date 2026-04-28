"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { setOrderStatusAction } from "@/app/admin/_actions";
import { cn } from "@/lib/utils";

const FLOW = [
  { value: "pending", label: "En attente" },
  { value: "paid", label: "Payée" },
  { value: "preparing", label: "Préparation" },
  { value: "delivered", label: "Livrée" },
];

export function OrderStatusChanger({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [current, setCurrent] = useState(status);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function set(next: string) {
    if (next === current) return;
    setError(null);
    start(async () => {
      const r = await setOrderStatusAction(id, next);
      if ("error" in r && r.error) setError(r.error);
      else setCurrent(next);
    });
  }

  return (
    <div className="mt-3 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {FLOW.map((f) => {
          const active = current === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => set(f.value)}
              disabled={pending}
              className={cn(
                "px-3 py-2.5 rounded-xl text-sm border transition-colors",
                active
                  ? "bg-[color:var(--color-forest)] text-[color:var(--color-cream)] border-[color:var(--color-forest)]"
                  : "bg-white border-black/10 hover:border-black/30",
                pending && "opacity-60"
              )}
            >
              {pending && active ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1" />
              ) : active ? (
                <Check className="w-3.5 h-3.5 inline mr-1" />
              ) : null}
              {f.label}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => set("canceled")}
          disabled={pending || current === "canceled"}
          className="flex-1 px-3 py-2 rounded-full text-xs border border-[color:var(--color-terracotta)] text-[color:var(--color-terracotta)] hover:bg-[color:var(--color-terracotta)]/10 disabled:opacity-40"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={() => set("refunded")}
          disabled={pending || current === "refunded"}
          className="flex-1 px-3 py-2 rounded-full text-xs border border-black/15 hover:bg-black/5 disabled:opacity-40"
        >
          Remboursée
        </button>
      </div>
      {error && (
        <p className="text-xs text-[color:var(--color-terracotta)]">{error}</p>
      )}
    </div>
  );
}
