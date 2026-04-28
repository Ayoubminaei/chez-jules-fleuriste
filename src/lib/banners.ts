import "server-only";
import { createClient, isSupabaseConfigured } from "./supabase/server";

export type Banner = {
  id: string;
  message: string;
  link_label: string | null;
  link_href: string | null;
  bg_color: string;
  text_color: string;
  dismissible: boolean;
};

export async function getActiveBanner(): Promise<Banner | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  if (!supabase) return null;
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("banners")
    .select(
      "id,message,link_label,link_href,bg_color,text_color,dismissible,starts_at,ends_at"
    )
    .eq("active", true)
    .or(`starts_at.is.null,starts_at.lte.${nowIso}`)
    .or(`ends_at.is.null,ends_at.gt.${nowIso}`)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data as Banner;
}
