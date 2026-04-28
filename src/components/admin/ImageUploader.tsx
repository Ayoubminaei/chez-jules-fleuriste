"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X, GripVertical } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ImageUploader({
  bucket,
  value,
  onChange,
  max = 6,
  label = "Images",
  hint,
  single = false,
}: {
  bucket: "product-images" | "category-images" | "banners";
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  label?: string;
  hint?: string;
  single?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const supabase = createClient();
    if (!supabase) {
      setError("Supabase non configuré");
      return;
    }
    setError(null);
    setUploading(true);
    const newUrls: string[] = [];
    try {
      const list = Array.from(files);
      const room = single ? 1 : Math.max(0, max - value.length);
      const toUpload = list.slice(0, room);
      for (const file of toUpload) {
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} n'est pas une image`);
        }
        if (file.size > 8 * 1024 * 1024) {
          throw new Error(`${file.name} dépasse 8 Mo`);
        }
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(bucket)
          .upload(path, file, { cacheControl: "31536000", upsert: false });
        if (upErr) throw upErr;
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(path);
        newUrls.push(publicUrl);
      }
      onChange(single ? newUrls.slice(0, 1) : [...value, ...newUrls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload échoué");
    } finally {
      setUploading(false);
    }
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= value.length) return;
    const next = value.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-[color:var(--color-mute)]">
        {label}
      </label>
      {hint && (
        <p className="text-[11px] text-[color:var(--color-mute)] mt-1">
          {hint}
        </p>
      )}

      <div
        className={[
          "mt-2 rounded-2xl border-2 border-dashed transition-colors",
          dragOver
            ? "border-[color:var(--color-forest)] bg-[color:var(--color-cream)]"
            : "border-black/15 bg-white",
        ].join(" ")}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
        }}
      >
        {value.length > 0 && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2">
            {value.map((url, i) => (
              <li
                key={url}
                className="relative aspect-square rounded-xl overflow-hidden bg-black/5 group"
              >
                <Image
                  src={url}
                  alt={`Image ${i + 1}`}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-x-0 top-0 p-1.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1">
                    {!single && i > 0 && (
                      <button
                        type="button"
                        onClick={() => move(i, i - 1)}
                        className="w-7 h-7 rounded-full bg-white/95 flex items-center justify-center"
                        title="Reculer"
                      >
                        <GripVertical className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((_, j) => j !== i))}
                    className="w-7 h-7 rounded-full bg-white/95 flex items-center justify-center"
                    title="Retirer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {i === 0 && !single && (
                  <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-[color:var(--color-forest)] text-[color:var(--color-cream)] text-[10px]">
                    Principale
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || (!single && value.length >= max)}
          className="w-full py-6 px-4 flex flex-col items-center gap-2 text-sm text-[color:var(--color-mute)] hover:text-[color:var(--color-forest)] disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
          {uploading
            ? "Envoi en cours…"
            : single
              ? value.length
                ? "Remplacer l'image"
                : "Ajouter une image"
              : `Glisser des images ici ou cliquer (${value.length}/${max})`}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={!single}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <p className="mt-2 text-xs text-[color:var(--color-terracotta)]">
          {error}
        </p>
      )}
    </div>
  );
}
