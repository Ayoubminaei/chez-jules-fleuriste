export type Category = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  accent: "forest" | "sage" | "terracotta" | "bloom";
};

export type Product = {
  slug: string;
  name: string;
  categorySlug: string;
  priceCents: number;
  description: string;
  longDescription: string;
  images: string[];
  composition: string[];
  size: "S" | "M" | "L";
  inStock: boolean;
  featured?: boolean;
};
