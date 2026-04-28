"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export function DismissBanner({ id }: { id: string }) {
  useEffect(() => {
    const dismissed = window.localStorage.getItem(`cj.banner.dismissed.${id}`);
    if (dismissed === "1") {
      const el = document.getElementById(`banner-${id}`);
      if (el) el.style.display = "none";
    }
  }, [id]);

  return (
    <button
      type="button"
      aria-label="Fermer"
      onClick={() => {
        try {
          window.localStorage.setItem(`cj.banner.dismissed.${id}`, "1");
        } catch {
          /* noop */
        }
        const el = document.getElementById(`banner-${id}`);
        if (el) el.style.display = "none";
      }}
      className="p-1 -m-1 hover:opacity-80"
    >
      <X className="w-4 h-4" />
    </button>
  );
}
