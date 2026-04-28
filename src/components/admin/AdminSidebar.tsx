"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Sprout,
  BadgePercent,
  Megaphone,
  Users,
  Settings,
  Tag,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/produits", label: "Produits", icon: Sprout },
  { href: "/admin/categories", label: "Catégories", icon: Tag },
  { href: "/admin/promotions", label: "Promotions", icon: BadgePercent },
  { href: "/admin/bannieres", label: "Bannières", icon: Megaphone },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 border-r border-black/5 bg-[color:var(--color-cream)] flex-col">
      <div className="px-6 py-6 border-b border-black/5">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-2xl text-[color:var(--color-forest)]"
        >
          Chez Jules
        </Link>
        <p className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-mute)] mt-1">
          Administration
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                active
                  ? "bg-[color:var(--color-forest)] text-[color:var(--color-cream)]"
                  : "text-[color:var(--color-ink)]/80 hover:bg-black/5"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-black/5 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-[color:var(--color-mute)] hover:bg-black/5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Voir le site public
        </Link>
      </div>
    </aside>
  );
}
