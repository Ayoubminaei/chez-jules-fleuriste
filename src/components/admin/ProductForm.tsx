"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { upsertProductAction, deleteProductAction } from "@/app/admin/_actions";
import { cn } from "@/lib/utils";

type Initial = {
  slug: string;
  name: string;
  category_slug: string;
  price_cents: number;
  description: string;
  long_description: string;
  size: "S" | "M" | "L";
  in_stock: boolean;
  featured: boolean;
  images: string[];
  composition: string[];
};

export function ProductForm({
  initial,
  categories,
  isNew,
}: {
  initial: Initial;
  categories: { slug: string; name: string }[];
  isNew: boolean;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(upsertProductAction, undefined);
  const [images, setImages] = useState<string[]>(initial.images);
  const [priceEuros, setPriceEuros] = useState(
    (initial.price_cents / 100).toFixed(2)
  );
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    if (!confirm(`Supprimer "${initial.name}" ?`)) return;
    setDeleting(true);
    const r = await deleteProductAction(initial.slug);
    setDeleting(false);
    if ("error" in r && r.error) {
      alert(r.error);
      return;
    }
    router.push("/admin/produits");
  }

  return (
    <form action={action} className="grid lg:grid-cols-12 gap-6">
      <input
        type="hidden"
        name="images"
        value={JSON.stringify(images)}
      />
      <input
        type="hidden"
        name="price_cents"
        value={Math.round(parseFloat(priceEuros || "0") * 100)}
      />

      <div className="lg:col-span-7 space-y-5">
        <Card title="Identité">
          <Field label="Nom" name="name" defaultValue={initial.name} required />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Slug (URL)"
              name="slug"
              defaultValue={initial.slug}
              hint="a-z, 0-9, tirets"
              required
              readOnly={!isNew}
            />
            <SelectField
              label="Catégorie"
              name="category_slug"
              defaultValue={initial.category_slug}
              options={categories.map((c) => ({ value: c.slug, label: c.name }))}
            />
          </div>
          <Field
            label="Description courte"
            name="description"
            defaultValue={initial.description}
            hint="Une phrase qui apparaît dans les listes."
            required
          />
          <TextArea
            label="Description longue"
            name="long_description"
            defaultValue={initial.long_description}
            rows={6}
            required
          />
          <Field
            label="Composition"
            name="composition"
            defaultValue={initial.composition.join(", ")}
            hint="Séparez par des virgules. Ex : Pivoines, Eucalyptus, Fougère"
          />
        </Card>

        <Card title="Images">
          <ImageUploader
            bucket="product-images"
            value={images}
            onChange={setImages}
            max={6}
            hint="La 1ʳᵉ image est la principale. Glissez-déposez ou cliquez."
          />
        </Card>
      </div>

      <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24 lg:self-start">
        <Card title="Prix & stock">
          <div>
            <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
              Prix (EUR)
            </label>
            <div className="mt-1.5 relative">
              <input
                value={priceEuros}
                onChange={(e) => setPriceEuros(e.target.value)}
                inputMode="decimal"
                pattern="[0-9]+(\.[0-9]{1,2})?"
                className="w-full rounded-full border border-black/10 bg-white px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-[color:var(--color-forest)] tabular-nums"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--color-mute)] text-sm">
                €
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
              Taille
            </label>
            <div className="mt-1.5 flex gap-2">
              {(["S", "M", "L"] as const).map((s) => (
                <label key={s} className="flex-1">
                  <input
                    type="radio"
                    name="size"
                    value={s}
                    defaultChecked={initial.size === s}
                    className="peer sr-only"
                  />
                  <span className="block text-center px-3 py-2 rounded-full border border-black/10 cursor-pointer text-sm peer-checked:bg-[color:var(--color-forest)] peer-checked:text-[color:var(--color-cream)] peer-checked:border-[color:var(--color-forest)]">
                    {s}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <Toggle
            label="Disponible"
            name="in_stock"
            defaultChecked={initial.in_stock}
            hint="Décochez pour marquer comme épuisé."
          />
          <Toggle
            label="Mise en avant"
            name="featured"
            defaultChecked={initial.featured}
            hint="Apparaît dans la sélection « Coups de cœur »."
          />
        </Card>

        {state?.error && (
          <div className="rounded-2xl bg-[color:var(--color-bloom)]/30 px-4 py-3 text-sm text-[color:var(--color-ink)]">
            {state.error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={pending}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-forest-soft)] transition-colors text-sm",
              pending && "opacity-60"
            )}
          >
            {pending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Enregistrement…
              </>
            ) : (
              "Enregistrer"
            )}
          </button>
          {!isNew && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[color:var(--color-terracotta)] text-[color:var(--color-terracotta)] hover:bg-[color:var(--color-terracotta)]/10 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-frame)] bg-white border border-black/5 p-5 sm:p-6">
      <h2 className="text-base font-medium">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  readOnly,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  readOnly?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
        {label}
      </label>
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        readOnly={readOnly}
        className="mt-1.5 w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-forest)] read-only:bg-black/[0.03]"
      />
      {hint && (
        <p className="mt-1 text-[11px] text-[color:var(--color-mute)]">
          {hint}
        </p>
      )}
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows = 4,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
        {label}
      </label>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        required={required}
        className="mt-1.5 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:border-[color:var(--color-forest)] resize-none"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
        {label}
      </label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-forest)]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
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
