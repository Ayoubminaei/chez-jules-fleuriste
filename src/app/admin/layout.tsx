import { isSupabaseConfigured } from "@/lib/supabase/server";
import { ADMIN_EMAIL, getCurrentUser } from "@/lib/admin";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSetup } from "@/components/admin/AdminSetup";

export const metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return <AdminSetup adminEmail={ADMIN_EMAIL} />;
  }

  const user = await getCurrentUser();

  return (
    <AdminShell user={{ email: user?.email ?? null }}>{children}</AdminShell>
  );
}
