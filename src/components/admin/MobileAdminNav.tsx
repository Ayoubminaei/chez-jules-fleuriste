"use client";

import { useState } from "react";
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
  Menu,
  X,
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

export function MobileAdminNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 -ml-2 rounded-full hover:bg-black/5"
        aria-label="Ouvrir le menu admin"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-y-0 left-0 w-[78%] max-w-xs bg-[color:var(--color-cream)] flex flex-col"
          >
            <div className="px-5 py-5 border-b border-black/5 flex items-center justify-between">
              <span className="font-[family-name:var(--font-display)] text-xl text-[color:var(--color-forest)]">
                Chez Jules · Admin
              </span>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {NAV.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm",
                      active
                        ? "bg-[color:var(--color-forest)] text-[color:var(--color-cream)]"
                        : "hover:bg-black/5"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
