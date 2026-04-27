import type { Metadata } from "next";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Recherche" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow="Recherche"
        title="Trouver une fleur."
        description="Pivoines, eucalyptus, tulipes — tapez ce qui vous fait vibrer."
      />
      <div className="container-x pb-24">
        <form className="mx-auto max-w-xl">
          <Input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Pivoines, mariage, blanc…"
            autoFocus
          />
        </form>
        <p className="mx-auto mt-8 max-w-xl text-center text-sm text-(--color-muted)">
          Recherche full-text Postgres branchée au Sprint 2.
        </p>
      </div>
    </>
  );
}
