import Link from "next/link";
import { LogOut } from "lucide-react";
import { NotificationsBell } from "./NotificationsBell";
import { MobileAdminNav } from "./MobileAdminNav";

export function AdminTopbar({
  user,
}: {
  user: { email: string | null };
}) {
  return (
    <header className="sticky top-0 z-30 bg-[color:var(--color-bg)]/85 backdrop-blur border-b border-black/5">
      <div className="h-16 px-4 sm:px-6 lg:px-10 flex items-center gap-3">
        <MobileAdminNav />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[color:var(--color-mute)]">
            Bonjour
          </p>
          <p className="text-sm truncate text-[color:var(--color-ink)]">
            {user.email ?? "Admin"}
          </p>
        </div>

        <NotificationsBell />

        <form action="/auth/logout" method="POST">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs hover:bg-black/5 text-[color:var(--color-mute)]"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </form>
        <Link
          href="/"
          className="hidden sm:inline-flex px-3 py-2 rounded-full text-xs hover:bg-black/5 text-[color:var(--color-mute)]"
        >
          Site public
        </Link>
      </div>
    </header>
  );
}
