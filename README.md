# Chez Jules Fleuriste

E-commerce haut de gamme pour fleuriste artisan.

## Stack

- **Next.js 16** (App Router, React 19)
- **TypeScript** strict
- **Tailwind CSS v4** (config CSS-based via `@theme`)
- **Supabase** — auth, DB (Postgres + RLS), storage
- **Stripe** — paiement (test mode)
- **Resend** — emails transactionnels
- **Vercel** — déploiement

## Design system

Palette inspirée fleuriste artisan :

| Token | Hex |
|---|---|
| `--color-bg` | `#FAF7F2` ivoire |
| `--color-forest` | `#2F4A3A` vert profond (primaire) |
| `--color-sage` | `#8FA896` vert sauge |
| `--color-terracotta` | `#C97B63` accent |
| `--color-bloom` | `#E8B4A0` rose fleur |
| `--color-cream` | `#FFFBF3` texte clair |

Typo : **Fraunces** (display serif) + **Inter** (texte).

## Démarrer

```bash
cp .env.example .env.local   # renseigner les clés
npm install
npm run dev
```

## Architecture

```
src/
├── app/                  # routes (App Router)
│   ├── catalogue/
│   ├── produit/[slug]/
│   ├── panier/
│   ├── checkout/
│   ├── abonnements/
│   ├── compte/
│   └── login/
├── components/
│   ├── layout/           # Navbar, Footer
│   └── ui/               # ProductCard, …
└── lib/
    ├── supabase/         # client + server
    ├── types.ts
    └── utils.ts
```

## Schéma DB

`profiles`, `categories`, `products`, `addresses`, `orders`, `order_items`,
`wishlist_items`, `reviews`, `promo_codes`, `banners`, `subscriptions`.

RLS activée partout. Fonction `is_admin()` pour les policies d'écriture.

## Roadmap

- **S1 — Foundations** ✅ : design system, hero, skeletons pages, DB schema, seed
- **S2 — Commerce core** : auth Supabase, panier persistant, favoris, avis
- **S3 — Checkout** : Stripe Checkout, livraison programmée, email Resend
- **S4 — Admin** : dashboard produits/commandes/stock, upload images Storage
- **S5 — Abonnements** : Stripe Subscriptions, cadence, suspension
- **S6 — Polish** : SEO (sitemap, OG images), perf, a11y audit, analytics
