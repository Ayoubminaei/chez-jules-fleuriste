import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { BannerForm } from "@/components/admin/BannerForm";
import { BannerList } from "@/components/admin/BannerList";

export const metadata = { title: "Bannières" };

type Row = {
  id: string;
  message: string;
  link_label: string | null;
  link_href: string | null;
  bg_color: string;
  text_color: string;
  dismissible: boolean;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
};

export default async function BannersPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data } = (await supabase
    ?.from("banners")
    .select("*")
    .order("created_at", { ascending: false })) ?? { data: null };

  const banners = (data as Row[]) ?? [];

  return (
    <div>
      <header>
        <h1 className="text-2xl lg:text-3xl font-[family-name:var(--font-display)] text-[color:var(--color-forest)]">
          Bannière du site
        </h1>
        <p className="text-sm text-[color:var(--color-mute)]">
          Une seule bannière peut être active à la fois. Elle apparaît tout en
          haut du site public.
        </p>
      </header>

      <div className="mt-6 grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <BannerForm />
        </div>
        <div className="lg:col-span-5">
          <BannerList banners={banners} />
        </div>
      </div>
    </div>
  );
}
