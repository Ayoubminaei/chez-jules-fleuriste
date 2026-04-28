"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { upsertBannerAction } from "@/app/admin/_actions";

type Initial = {
  id?: string;
  message?: string;
  link_label?: string;
  link_href?: string;
  bg_color?: string;
  text_color?: string;
  dismissible?: boolean;
  active?: boolean;
};

export function BannerForm({ initial }: { initial?: Initial }) {
  const [state, action, pending] = useActionState(upsertBannerAction, undefined);

  const [message, setMessage] = useState(initial?.message ?? "");
  const [linkLabel, setLinkLabel] = useState(initial?.link_label ?? "");
  const [linkHref, setLinkHref] = useState(initial?.link_href ?? "");
  const [bg, setBg] = useState(initial?.bg_color ?? "#2F4A3A");
  const [fg, setFg] = useState(initial?.text_color ?? "#FFFBF3");

  return (
    <form
      action={action}
      className="rounded-[var(--radius-frame)] bg-white border border-black/5 p-5 sm:p-6 space-y-5"
    >
      <input type="hidden" name="id" value={initial?.id ?? ""} />

      <div>
        <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
          Aperçu
        </label>
        <div
          style={{ backgroundColor: bg, color: fg }}
          className="mt-2 px-4 py-3 rounded-2xl text-sm flex items-center gap-3"
        >
          <span className="flex-1 truncate">
            {message || "Votre message ici"}
            {linkLabel && (
              <span className="ml-2 underline">{linkLabel}</span>
            )}
          </span>
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
          Message
        </label>
        <input
          name="message"
          required
          maxLength={280}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1.5 w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-forest)]"
          placeholder="Livraison Paris offerte dès 80€"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
            Texte du lien
          </label>
          <input
            name="link_label"
            value={linkLabel}
            onChange={(e) => setLinkLabel(e.target.value)}
            className="mt-1.5 w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-forest)]"
            placeholder="J'en profite"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
            URL du lien
          </label>
          <input
            name="link_href"
            value={linkHref}
            onChange={(e) => setLinkHref(e.target.value)}
            className="mt-1.5 w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-forest)]"
            placeholder="/categorie/bouquets-signature"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <ColorField
          label="Couleur de fond"
          name="bg_color"
          value={bg}
          onChange={setBg}
        />
        <ColorField
          label="Couleur du texte"
          name="text_color"
          value={fg}
          onChange={setFg}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Toggle
          name="active"
          label="Active"
          defaultChecked={initial?.active}
          hint="Visible sur le site public."
        />
        <Toggle
          name="dismissible"
          label="Peut être fermée"
          defaultChecked={initial?.dismissible ?? true}
          hint="Le visiteur peut la masquer."
        />
      </div>

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
        ) : initial?.id ? (
          "Mettre à jour"
        ) : (
          "Publier la bannière"
        )}
      </button>
    </form>
  );
}

function ColorField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
        {label}
      </label>
      <div className="mt-1.5 flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-full border border-black/10 bg-white cursor-pointer"
        />
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[color:var(--color-forest)]"
        />
      </div>
    </div>
  );
}

function Toggle({
  label,
  name,
  defaultChecked,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <span className="relative shrink-0 mt-0.5">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="peer sr-only"
        />
        <span className="block w-9 h-5 rounded-full bg-black/15 peer-checked:bg-[color:var(--color-forest)] transition-colors" />
        <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
      </span>
      <span className="flex-1">
        <span className="text-sm">{label}</span>
        {hint && (
          <span className="block text-[11px] text-[color:var(--color-mute)]">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}
