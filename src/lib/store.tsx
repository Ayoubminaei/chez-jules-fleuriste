"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CartItem = { slug: string; qty: number };

type CartState = {
  items: CartItem[];
  count: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  hydrated: boolean;
};

type FavoritesState = {
  ids: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  hydrated: boolean;
};

const CartCtx = createContext<CartState | null>(null);
const FavoritesCtx = createContext<FavoritesState | null>(null);

const CART_KEY = "cj.cart.v1";
const FAV_KEY = "cj.fav.v1";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or disabled */
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favIds, setFavIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-shot hydration from localStorage on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readJSON<CartItem[]>(CART_KEY, []));
    setFavIds(readJSON<string[]>(FAV_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(CART_KEY, items);
  }, [items, hydrated]);

  useEffect(() => {
    if (hydrated) writeJSON(FAV_KEY, favIds);
  }, [favIds, hydrated]);

  const add = useCallback((slug: string, qty: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === slug ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { slug, qty }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.slug !== slug)
        : prev.map((i) => (i.slug === slug ? { ...i, qty } : i))
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const cart = useMemo<CartState>(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      add,
      setQty,
      remove,
      clear,
      hydrated,
    }),
    [items, add, setQty, remove, clear, hydrated]
  );

  const toggle = useCallback((slug: string) => {
    setFavIds((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const has = useCallback(
    (slug: string) => favIds.includes(slug),
    [favIds]
  );

  const favorites = useMemo<FavoritesState>(
    () => ({ ids: favIds, toggle, has, hydrated }),
    [favIds, toggle, has, hydrated]
  );

  return (
    <CartCtx.Provider value={cart}>
      <FavoritesCtx.Provider value={favorites}>
        {children}
      </FavoritesCtx.Provider>
    </CartCtx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within Providers");
  return ctx;
}

export function useFavorites() {
  const ctx = useContext(FavoritesCtx);
  if (!ctx) throw new Error("useFavorites must be used within Providers");
  return ctx;
}
