"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2, Pencil } from "lucide-react";
import { deleteBannerAction } from "@/app/admin/_actions";
import { BannerForm } from "./BannerForm";

type Row = {
  id: string;
  message: string;
  link_label: string | null;
  link_href: string | null;
  bg_color: string;
  text_color: string;
  dismissible: boolean;
  active: boolean;
  created_at: string;
};

export function BannerList({ banners }: { banners: Row[] }) {
  const [editing, setEditing] = useState<Row | null>(null);
  const [pending, start] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  function onDelete(id: string) {
    if (!confirm("Supprimer cette bannière ?")) return;
    setBusyId(id);
    start(async () => {
      await deleteBannerAction(id);
      setBusyId(null);
    });
  }

  if (editing) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setEditing(null)}
          className="text-xs text-[color:var(--color-mute)] hover:text-[color:var(--color-forest)]"
        >
          ← Retour à la liste
        </button>
        <BannerForm
          initial={{
            id: editing.id,
            message: editing.message,
            link_label: editing.link_label ?? "",
            link_href: editing.link_href ?? "",
            bg_color: editing.bg_color,
            text_color: editing.text_color,
            dismissible: editing.dismissible,
            active: editing.active,
          }}
        />
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-frame)] bg-white border border-black/5 overflow-hidden">
      <header className="px-5 py-3 border-b border-black/5">
        <h2 className="text-sm font-medium">Historique</h2>
      </header>
      {banners.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-[color:var(--color-mute)]">
          Aucune bannière pour l&rsquo;instant.
        </p>
      ) : (
        <ul>
          {banners.map((b) => (
            <li
              key={b.id}
              className="px-5 py-3 border-t border-black/5 first:border-t-0 flex items-center gap-3"
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: b.bg_color }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{b.message}</p>
                <div className="flex items-center gap-2 text-[11px] text-[color:var(--color-mute)] mt-0.5">
                  {b.active ? (
                    <span className="px-1.5 py-0.5 rounded bg-[color:var(--color-sage)]/30 text-[color:var(--color-ink)]">
                      Active
                    </span>
                  ) : (
                    <span>Inactive</span>
                  )}
                  <span>·</span>
                  <span>
                    {new Date(b.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditing(b)}
                className="p-1.5 hover:bg-black/5 rounded-full text-[color:var(--color-mute)]"
                aria-label="Modifier"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(b.id)}
                disabled={pending && busyId === b.id}
                className="p-1.5 hover:bg-black/5 rounded-full text-[color:var(--color-mute)] hover:text-[color:var(--color-terracotta)] disabled:opacity-50"
                aria-label="Supprimer"
              >
                {pending && busyId === b.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
