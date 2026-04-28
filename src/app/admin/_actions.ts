"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";

const ProductSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Slug invalide (a-z, 0-9, -)"),
  name: z.string().min(1).max(120),
  category_slug: z.string().min(1),
  price_cents: z.coerce.number().int().min(0),
  description: z.string().min(1).max(160),
  long_description: z.string().min(1).max(4000),
  size: z.enum(["S", "M", "L"]),
  in_stock: z.coerce.boolean(),
  featured: z.coerce.boolean(),
  images: z.array(z.string().url()).min(1, "Au moins une image"),
  composition: z.array(z.string().min(1)).default([]),
});

export async function upsertProductAction(
  prev: { error?: string } | undefined,
  formData: FormData
) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase non configuré" };

  const raw = {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    category_slug: String(formData.get("category_slug") ?? "").trim(),
    price_cents: formData.get("price_cents"),
    description: String(formData.get("description") ?? "").trim(),
    long_description: String(formData.get("long_description") ?? "").trim(),
    size: String(formData.get("size") ?? "M"),
    in_stock: formData.get("in_stock") === "on",
    featured: formData.get("featured") === "on",
    images: JSON.parse(String(formData.get("images") ?? "[]")),
    composition: String(formData.get("composition") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };

  const parsed = ProductSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase.from("products").upsert(parsed.data);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/produits");
  revalidatePath(`/categorie/${parsed.data.category_slug}`);
  revalidatePath(`/produit/${parsed.data.slug}`);
  redirect("/admin/produits");
}

export async function deleteProductAction(slug: string) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase non configuré" };
  const { error } = await supabase.from("products").delete().eq("slug", slug);
  if (error) return { error: error.message };
  revalidatePath("/admin/produits");
  revalidatePath("/");
  return { ok: true };
}

const BannerSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  message: z.string().min(1).max(280),
  link_label: z.string().max(60).optional().or(z.literal("")),
  link_href: z.string().max(500).optional().or(z.literal("")),
  bg_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  text_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  dismissible: z.coerce.boolean(),
  active: z.coerce.boolean(),
});

export async function upsertBannerAction(
  prev: { error?: string } | undefined,
  formData: FormData
) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase non configuré" };

  const raw = {
    id: String(formData.get("id") ?? "") || undefined,
    message: String(formData.get("message") ?? "").trim(),
    link_label: String(formData.get("link_label") ?? "").trim(),
    link_href: String(formData.get("link_href") ?? "").trim(),
    bg_color: String(formData.get("bg_color") ?? "#2F4A3A"),
    text_color: String(formData.get("text_color") ?? "#FFFBF3"),
    dismissible: formData.get("dismissible") === "on",
    active: formData.get("active") === "on",
  };

  const parsed = BannerSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const payload = {
    ...parsed.data,
    link_label: parsed.data.link_label || null,
    link_href: parsed.data.link_href || null,
    updated_at: new Date().toISOString(),
  };

  // Only one banner active at a time.
  if (parsed.data.active) {
    await supabase
      .from("banners")
      .update({ active: false })
      .neq("id", parsed.data.id || "00000000-0000-0000-0000-000000000000");
  }

  const { error } = parsed.data.id
    ? await supabase.from("banners").update(payload).eq("id", parsed.data.id)
    : await supabase.from("banners").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin/bannieres");
  return { ok: true };
}

export async function deleteBannerAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase non configuré" };
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/bannieres");
  return { ok: true };
}

const PromoSchema = z.object({
  code: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[A-Z0-9_-]+$/i, "Code invalide")
    .transform((s) => s.toUpperCase()),
  kind: z.enum(["percent", "fixed", "free_shipping"]),
  value_int: z.coerce.number().int().min(0),
  min_subtotal_cents: z.coerce.number().int().min(0).default(0),
  max_redemptions: z.coerce.number().int().min(1).optional(),
  ends_at: z.string().optional().or(z.literal("")),
  active: z.coerce.boolean(),
});

export async function upsertPromoAction(
  prev: { error?: string } | undefined,
  formData: FormData
) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase non configuré" };

  const raw = {
    code: String(formData.get("code") ?? "").trim(),
    kind: String(formData.get("kind") ?? "percent"),
    value_int: formData.get("value_int"),
    min_subtotal_cents: formData.get("min_subtotal_cents") ?? 0,
    max_redemptions: formData.get("max_redemptions") || undefined,
    ends_at: String(formData.get("ends_at") ?? ""),
    active: formData.get("active") === "on",
  };

  const parsed = PromoSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const payload = {
    code: parsed.data.code,
    kind: parsed.data.kind,
    value_int: parsed.data.value_int,
    min_subtotal_cents: parsed.data.min_subtotal_cents,
    max_redemptions: parsed.data.max_redemptions ?? null,
    ends_at: parsed.data.ends_at ? new Date(parsed.data.ends_at).toISOString() : null,
    active: parsed.data.active,
  };

  const { error } = await supabase.from("promo_codes").upsert(payload);
  if (error) return { error: error.message };

  revalidatePath("/admin/promotions");
  return { ok: true };
}

export async function deletePromoAction(code: string) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase non configuré" };
  const { error } = await supabase
    .from("promo_codes")
    .delete()
    .eq("code", code);
  if (error) return { error: error.message };
  revalidatePath("/admin/promotions");
  return { ok: true };
}

export async function setOrderStatusAction(id: string, status: string) {
  await requireAdmin();
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase non configuré" };
  const allowed = [
    "pending",
    "paid",
    "preparing",
    "delivered",
    "canceled",
    "refunded",
  ];
  if (!allowed.includes(status))
    return { error: `Statut "${status}" inconnu` };
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/commandes");
  revalidatePath(`/admin/commandes/${id}`);
  return { ok: true };
}
