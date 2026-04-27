import type { Category, Product } from "./types";

export const categories: Category[] = [
  {
    slug: "bouquets-signature",
    name: "Bouquets signature",
    tagline: "Compositions de l'atelier",
    description:
      "Compositions saisonnières montées à la main par Jules, dans l'esprit champêtre et structuré qui fait la signature de la maison.",
    image:
      "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=1600&q=80",
    accent: "forest",
  },
  {
    slug: "roses",
    name: "Roses de jardin",
    tagline: "Variétés anciennes & parfumées",
    description:
      "Des roses de Pierre de Ronsard à la David Austin, sélectionnées chez nos producteurs partenaires en Île-de-France.",
    image:
      "https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&w=1600&q=80",
    accent: "bloom",
  },
  {
    slug: "plantes",
    name: "Plantes d'intérieur",
    tagline: "Verdure pour la maison",
    description:
      "Monstera, oliviers nains, fougères et plantes rares — chacun choisi pour son port et sa robustesse.",
    image:
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1600&q=80",
    accent: "sage",
  },
  {
    slug: "mariage",
    name: "Mariage & événement",
    tagline: "Sur mesure",
    description:
      "Bouquets de mariée, arches florales et compositions pour vos cérémonies. Devis personnalisé sous 48h.",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1600&q=80",
    accent: "terracotta",
  },
  {
    slug: "deuil",
    name: "Hommage",
    tagline: "Avec délicatesse",
    description:
      "Couronnes, gerbes et coussins pour accompagner les moments les plus délicats. Livraison directe au lieu de cérémonie.",
    image:
      "https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=1600&q=80",
    accent: "sage",
  },
  {
    slug: "abonnements",
    name: "Abonnements",
    tagline: "Chaque semaine",
    description:
      "Recevez chez vous un bouquet de saison toutes les semaines, deux semaines ou tous les mois. Sans engagement.",
    image:
      "https://images.unsplash.com/photo-1453747063559-36695c8771bd?auto=format&fit=crop&w=1600&q=80",
    accent: "forest",
  },
];

export const products: Product[] = [
  {
    slug: "bouquet-aurore",
    name: "Bouquet Aurore",
    categorySlug: "bouquets-signature",
    priceCents: 6500,
    description: "Pivoines, roses anciennes, eucalyptus.",
    longDescription:
      "Aurore évoque la lumière du matin sur le jardin. Pivoines roses poudrées, roses David Austin, eucalyptus parvifolia et touches de gypsophile. Monté en spirale main, livré dans un papier kraft écru et un ruban de soie.",
    images: [
      "https://images.unsplash.com/photo-1525310072745-f49212b8ac81?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=1400&q=80",
    ],
    composition: ["Pivoines", "Roses David Austin", "Eucalyptus parvifolia", "Gypsophile"],
    size: "M",
    inStock: true,
    featured: true,
  },
  {
    slug: "bouquet-fougere",
    name: "Bouquet Fougère",
    categorySlug: "bouquets-signature",
    priceCents: 5500,
    description: "Renoncules, fougères, branches de saule.",
    longDescription:
      "Composition graphique et champêtre autour des verts profonds : fougères Boston, renoncules ivoire, saule tortueux. Idéal pour une table d'intérieur ou un cadeau qui sort des sentiers battus.",
    images: [
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1453747063559-36695c8771bd?auto=format&fit=crop&w=1400&q=80",
    ],
    composition: ["Renoncules ivoire", "Fougères Boston", "Saule tortueux"],
    size: "M",
    inStock: true,
  },
  {
    slug: "bouquet-cinq-heures",
    name: "Bouquet Cinq Heures",
    categorySlug: "bouquets-signature",
    priceCents: 8200,
    description: "Dahlias, lisianthus, herbes folles.",
    longDescription:
      "Le bouquet de la fin d'après-midi, quand la lumière s'adoucit. Dahlias bordeaux, lisianthus crème, herbes folles et fenouil sauvage. Volume généreux, pour une grande pièce de réception.",
    images: [
      "https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1400&q=80",
    ],
    composition: ["Dahlias bordeaux", "Lisianthus crème", "Fenouil sauvage", "Herbes folles"],
    size: "L",
    inStock: true,
    featured: true,
  },
  {
    slug: "rose-pierre-ronsard",
    name: "Roses Pierre de Ronsard",
    categorySlug: "roses",
    priceCents: 4800,
    description: "Botte de 12 roses anciennes parfumées.",
    longDescription:
      "La rose des roses. Coupées le matin même chez notre producteur en Eure-et-Loir, elles s'épanouissent en cœur double, rose tendre et crème. Tiges 50 cm minimum.",
    images: [
      "https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=1400&q=80",
    ],
    composition: ["12 tiges de roses Pierre de Ronsard"],
    size: "M",
    inStock: true,
    featured: true,
  },
  {
    slug: "rose-juliette",
    name: "Roses Juliette",
    categorySlug: "roses",
    priceCents: 5200,
    description: "Botte de 9 roses David Austin.",
    longDescription:
      "Roses Juliette de David Austin, abricot poudré au cœur, parfum de pêche et de myrrhe. Botte de 9 tiges, idéale en monobouquet sur une desserte.",
    images: [
      "https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=1400&q=80",
    ],
    composition: ["9 tiges de roses Juliette"],
    size: "M",
    inStock: true,
  },
  {
    slug: "monstera-deliciosa",
    name: "Monstera Deliciosa",
    categorySlug: "plantes",
    priceCents: 7500,
    description: "Grand sujet, pot terre cuite inclus.",
    longDescription:
      "Une grande Monstera Deliciosa de 80 cm avec ses feuilles découpées caractéristiques. Livrée en pot de terre cuite naturelle Ø 24 cm, terreau biologique enrichi.",
    images: [
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1400&q=80",
    ],
    composition: ["Monstera Deliciosa 80cm", "Pot terre cuite Ø24", "Terreau bio"],
    size: "L",
    inStock: true,
  },
  {
    slug: "olivier-de-provence",
    name: "Olivier de Provence",
    categorySlug: "plantes",
    priceCents: 12000,
    description: "Tronc tressé, hauteur 1m20.",
    longDescription:
      "Olivier d'extérieur ou véranda, tronc tressé, taillé en boule. Hauteur 1m20. Une présence sculpturale qui traverse les années.",
    images: [
      "https://images.unsplash.com/photo-1542856204-00101eb6def4?auto=format&fit=crop&w=1400&q=80",
    ],
    composition: ["Olivier 1m20", "Pot terracotta Ø32"],
    size: "L",
    inStock: false,
  },
  {
    slug: "bouquet-mariee-blanche",
    name: "Bouquet Mariée Blanche",
    categorySlug: "mariage",
    priceCents: 14500,
    description: "Pivoines, roses ivoire, lisianthus.",
    longDescription:
      "Bouquet rond intemporel pour mariée. Pivoines ivoire, roses David Austin Patience, lisianthus blanc, eucalyptus argenté. Tige enrubannée de soie sauvage.",
    images: [
      "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1400&q=80",
    ],
    composition: ["Pivoines ivoire", "Roses Patience", "Lisianthus", "Eucalyptus argenté"],
    size: "L",
    inStock: true,
    featured: true,
  },
  {
    slug: "couronne-hommage",
    name: "Couronne Hommage",
    categorySlug: "deuil",
    priceCents: 16000,
    description: "Couronne ronde Ø60cm, ton sur ton.",
    longDescription:
      "Couronne ronde Ø60cm, composition ton sur ton de roses ivoire, lisianthus, eucalyptus et feuillages doux. Livraison directe au lieu de cérémonie sous 24h.",
    images: [
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1400&q=80",
    ],
    composition: ["Roses ivoire", "Lisianthus", "Eucalyptus", "Feuillages"],
    size: "L",
    inStock: true,
  },
  {
    slug: "abonnement-hebdo",
    name: "Abonnement hebdomadaire",
    categorySlug: "abonnements",
    priceCents: 4500,
    description: "Un bouquet de saison chaque semaine.",
    longDescription:
      "Chaque jeudi, recevez un bouquet de saison composé par Jules. Sans engagement, suspension à tout moment depuis votre compte. Livraison Paris incluse.",
    images: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1400&q=80",
    ],
    composition: ["Bouquet hebdomadaire", "Livraison Paris incluse"],
    size: "M",
    inStock: true,
    featured: true,
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((p) => p.categorySlug === slug);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}

export function getAdjacentProducts(slug: string) {
  const product = getProduct(slug);
  if (!product) return { prev: null, next: null };
  const siblings = getProductsByCategory(product.categorySlug);
  const idx = siblings.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? siblings[idx - 1] : siblings[siblings.length - 1],
    next: idx < siblings.length - 1 ? siblings[idx + 1] : siblings[0],
  };
}
