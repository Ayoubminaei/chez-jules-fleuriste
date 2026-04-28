import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Catégories" };

type Row = {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  accent: string;
  position: number;
};

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = (await supabase
    ?.from("categories")
    .select("slug,name,tagline,image,accent,position")
    .order("position")) ?? { data: null };

  const rows = (data as Row[]) ?? [];

  return (
    <div>
      <header>
        <h1 className="text-2xl lg:text-3xl font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
          Catégories
        </h1>
        <p className="text-sm text-[color:var(--color-mute)]">
          Univers du site. Modifiez le visuel et la position depuis Supabase
          (édition fine de catégories à venir).
        </p>
      </header>

      <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((c) => (
          <li
            key={c.slug}
            className="rounded-[var(--radius-frame)] bg-white border border-black/5 overflow-hidden"
          >
            <div className="relative aspect-[16/9] bg-black/5">
              {c.image && (
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <h3 className="text-base font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
                {c.name}
              </h3>
              <p className="text-xs text-[color:var(--color-mute)]">
                {c.tagline}
              </p>
              <Link
                href={`/categorie/${c.slug}`}
                target="_blank"
                className="mt-2 inline-flex items-center gap-1 text-xs text-[color:var(--color-mute)] hover:text-[color:var(--color-forest)]"
              >
                Voir <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </li>
        ))}
        {rows.length === 0 && (
          <li className="sm:col-span-2 lg:col-span-3 rounded-[var(--radius-frame)] border border-dashed border-black/15 px-6 py-12 text-center text-sm text-[color:var(--color-mute)] bg-[color:var(--color-cream)]">
            Aucune catégorie. Lancez{" "}
            <code className="px-1 py-0.5 rounded bg-black/5 text-xs">
              supabase/seed.sql
            </code>{" "}
            pour ajouter celles par défaut.
          </li>
        )}
      </ul>
    </div>
  );
}
