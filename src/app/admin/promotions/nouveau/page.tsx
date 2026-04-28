import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { PromoForm } from "@/components/admin/PromoForm";

export const metadata = { title: "Nouvelle promotion" };

export default async function NewPromoPage() {
  await requireAdmin();
  return (
    <div>
      <Link
        href="/admin/promotions"
        className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-mute)] hover:text-[color:var(--color-forest)]"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </Link>
      <h1 className="mt-3 text-2xl lg:text-3xl font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
        Nouveau code de réduction
      </h1>
      <div className="mt-6 max-w-xl">
        <PromoForm />
      </div>
    </div>
  );
}
