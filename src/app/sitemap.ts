import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://chez-jules.fr"
  );
  const now = new Date();

  const staticPaths = [
    "",
    "/atelier",
    "/contact",
    "/abonnements",
    "/cgv",
    "/mentions",
  ];

  return [
    ...staticPaths.map((p) => ({
      url: `${base}${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...categories.map((c) => ({
      url: `${base}/categorie/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${base}/produit/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
