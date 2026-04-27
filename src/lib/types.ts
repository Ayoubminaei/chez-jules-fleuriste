export type Occasion =
  | "anniversaire"
  | "mariage"
  | "naissance"
  | "deuil"
  | "saint-valentin"
  | "fete-des-meres"
  | "remerciement"
  | "tous-les-jours";

export type ProductColor =
  | "blanc"
  | "rose"
  | "rouge"
  | "jaune"
  | "orange"
  | "violet"
  | "bleu"
  | "vert"
  | "multicolore";

export type ProductCategory = "bouquets" | "plantes" | "compositions" | "evenements";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  compare_at_cents: number | null;
  category: ProductCategory;
  occasions: Occasion[];
  colors: ProductColor[];
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  image_url: string;
  created_at: string;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  cta_label: string | null;
  cta_href: string | null;
  image_url: string;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
};

export type CartItem = {
  product_id: string;
  quantity: number;
  size: "S" | "M" | "L" | null;
};
