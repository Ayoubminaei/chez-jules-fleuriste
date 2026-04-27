// Async Supabase-aware data accessors with graceful fallback to mocks.
//
// Pages that want live data should import from here instead of `data.ts`.
// When env vars are missing or a query fails, we fall back to the mock
// dataset so the site remains functional.

import "server-only";
import { createClient, isSupabaseConfigured } from "./supabase/server";
import * as mock from "./mock-data";
import type { Category, Product } from "./types";

type CategoryRow = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  accent: Category["accent"];
};

type ProductRow = {
  slug: string;
  name: string;
  category_slug: string;
  price_cents: number;
  description: string;
  long_description: string;
  images: string[];
  composition: string[];
  size: Product["size"];
  in_stock: boolean;
  featured: boolean | null;
};

function rowToProduct(r: ProductRow): Product {
  return {
    slug: r.slug,
    name: r.name,
    categorySlug: r.category_slug,
    priceCents: r.price_cents,
    description: r.description,
    longDescription: r.long_description,
    images: r.images,
    composition: r.composition,
    size: r.size,
    inStock: r.in_stock,
    featured: r.featured ?? false,
  };
}

export async function listCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return mock.categories;
  const supabase = await createClient();
  if (!supabase) return mock.categories;
  const { data, error } = await supabase
    .from("categories")
    .select("slug,name,tagline,description,image,accent")
    .order("position", { ascending: true });
  if (error || !data?.length) return mock.categories;
  return data as CategoryRow[];
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  if (!isSupabaseConfigured()) return mock.getCategory(slug);
  const supabase = await createClient();
  if (!supabase) return mock.getCategory(slug);
  const { data, error } = await supabase
    .from("categories")
    .select("slug,name,tagline,description,image,accent")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return mock.getCategory(slug);
  return data as CategoryRow;
}

export async function listProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return mock.products;
  const supabase = await createClient();
  if (!supabase) return mock.products;
  const { data, error } = await supabase
    .from("products")
    .select(
      "slug,name,category_slug,price_cents,description,long_description,images,composition,size,in_stock,featured"
    );
  if (error || !data?.length) return mock.products;
  return (data as ProductRow[]).map(rowToProduct);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  if (!isSupabaseConfigured()) return mock.getProductsByCategory(slug);
  const supabase = await createClient();
  if (!supabase) return mock.getProductsByCategory(slug);
  const { data, error } = await supabase
    .from("products")
    .select(
      "slug,name,category_slug,price_cents,description,long_description,images,composition,size,in_stock,featured"
    )
    .eq("category_slug", slug);
  if (error || !data) return mock.getProductsByCategory(slug);
  return (data as ProductRow[]).map(rowToProduct);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) return mock.getProduct(slug);
  const supabase = await createClient();
  if (!supabase) return mock.getProduct(slug);
  const { data, error } = await supabase
    .from("products")
    .select(
      "slug,name,category_slug,price_cents,description,long_description,images,composition,size,in_stock,featured"
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return mock.getProduct(slug);
  return rowToProduct(data as ProductRow);
}
