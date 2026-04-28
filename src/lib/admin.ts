import "server-only";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "./supabase/server";

export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "tiam.rainbow@gmail.com";

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function isCurrentUserAdmin() {
  const user = await getCurrentUser();
  return Boolean(user && user.email === ADMIN_EMAIL);
}

export async function requireAdmin() {
  if (!isSupabaseConfigured()) return null;
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.email !== ADMIN_EMAIL) redirect("/");
  return user;
}
