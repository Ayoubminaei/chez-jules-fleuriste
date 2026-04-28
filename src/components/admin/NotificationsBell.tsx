"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Notif = {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  href: string | null;
  read: boolean;
  created_at: string;
};

export function NotificationsBell() {
  const [items, setItems] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    let cancelled = false;
    async function load() {
      if (!supabase) return;
      const { data } = await supabase
        .from("notifications")
        .select("id,kind,title,body,href,read,created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (!cancelled && data) setItems(data as Notif[]);
    }
    load();

    const channel = supabase
      .channel("admin-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          setItems((prev) => [payload.new as Notif, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  const unread = items.filter((n) => !n.read).length;

  async function markAllRead() {
    const supabase = createClient();
    if (!supabase) return;
    const ids = items.filter((n) => !n.read).map((n) => n.id);
    if (ids.length === 0) return;
    await supabase
      .from("notifications")
      .update({ read: true })
      .in("id", ids);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full hover:bg-black/5"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[color:var(--color-terracotta)] text-white text-[10px] font-medium flex items-center justify-center tabular-nums">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-black/5 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-black/5 flex items-center justify-between">
            <span className="text-sm font-medium">Notifications</span>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-[color:var(--color-mute)] hover:text-[color:var(--color-forest)] inline-flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Tout marquer comme lu
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-[color:var(--color-mute)]">
                Aucune notification pour l&rsquo;instant.
              </p>
            ) : (
              <ul>
                {items.map((n) => (
                  <li key={n.id}>
                    {n.href ? (
                      <Link
                        href={n.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "block px-4 py-3 hover:bg-black/[0.03] border-b border-black/[0.04]",
                          !n.read && "bg-[color:var(--color-bloom)]/10"
                        )}
                      >
                        <NotificationContent n={n} />
                      </Link>
                    ) : (
                      <div
                        className={cn(
                          "px-4 py-3 border-b border-black/[0.04]",
                          !n.read && "bg-[color:var(--color-bloom)]/10"
                        )}
                      >
                        <NotificationContent n={n} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationContent({ n }: { n: Notif }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-1.5 h-1.5 mt-2 rounded-full bg-[color:var(--color-terracotta)] shrink-0" />
      <div className="min-w-0">
        <p className="text-sm text-[color:var(--color-ink)] truncate">
          {n.title}
        </p>
        {n.body && (
          <p className="text-xs text-[color:var(--color-mute)] line-clamp-2 mt-0.5">
            {n.body}
          </p>
        )}
        <p className="text-[10px] text-[color:var(--color-mute)] mt-1">
          {new Date(n.created_at).toLocaleString("fr-FR", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
      </div>
    </div>
  );
}
