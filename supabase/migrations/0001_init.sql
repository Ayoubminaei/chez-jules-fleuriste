-- Schema for Chez Jules Fleuriste.
-- Apply via Supabase SQL editor or `supabase db push` after `supabase init`.

create extension if not exists "uuid-ossp";

-- ============================================================
-- Profiles (extends auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

-- ============================================================
-- Catalog
-- ============================================================
create table if not exists public.categories (
  slug text primary key,
  name text not null,
  tagline text not null,
  description text not null,
  image text not null,
  accent text not null check (accent in ('forest','sage','terracotta','bloom')),
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  slug text primary key,
  name text not null,
  category_slug text not null references public.categories(slug) on delete restrict,
  price_cents int not null check (price_cents >= 0),
  description text not null,
  long_description text not null,
  images text[] not null default '{}',
  composition text[] not null default '{}',
  size text not null check (size in ('S','M','L')),
  in_stock boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_products_category on public.products(category_slug);

-- ============================================================
-- Addresses
-- ============================================================
create table if not exists public.addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text,
  line1 text not null,
  line2 text,
  city text not null,
  postal_code text not null,
  country text not null default 'FR',
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Orders
-- ============================================================
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,
  status text not null default 'pending'
    check (status in ('pending','paid','preparing','delivered','canceled','refunded')),
  total_cents int not null check (total_cents >= 0),
  currency text not null default 'EUR',
  shipping_address jsonb,
  delivery_at timestamptz,
  card_message text,
  stripe_session_id text unique,
  stripe_payment_intent text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text not null references public.products(slug),
  name_snapshot text not null,
  unit_price_cents int not null check (unit_price_cents >= 0),
  qty int not null check (qty > 0)
);

-- ============================================================
-- Wishlist (mirror of localStorage when logged-in)
-- ============================================================
create table if not exists public.wishlist_items (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_slug text not null references public.products(slug) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (user_id, product_slug)
);

-- ============================================================
-- Reviews
-- ============================================================
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_slug text not null references public.products(slug) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Subscriptions (Stripe)
-- ============================================================
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  cadence text not null check (cadence in ('weekly','biweekly','monthly')),
  status text not null default 'active'
    check (status in ('active','paused','canceled')),
  next_delivery_at timestamptz,
  stripe_subscription_id text unique,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles      enable row level security;
alter table public.categories    enable row level security;
alter table public.products      enable row level security;
alter table public.addresses     enable row level security;
alter table public.orders        enable row level security;
alter table public.order_items   enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.reviews       enable row level security;
alter table public.subscriptions enable row level security;

-- profiles: read self, admin reads all, self updates self
create policy "profiles self-read" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles self-update" on public.profiles
  for update using (auth.uid() = id);

-- catalog: anyone reads, admin writes
create policy "categories public read" on public.categories for select using (true);
create policy "categories admin write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());
create policy "products public read" on public.products for select using (true);
create policy "products admin write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- addresses: owner only
create policy "addresses owner" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- orders: owner reads own, admin reads all, server writes via service role
create policy "orders owner read" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());
create policy "order_items owner read" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );

-- wishlist: owner only
create policy "wishlist owner" on public.wishlist_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- reviews: anyone reads, authenticated authors write
create policy "reviews public read" on public.reviews for select using (true);
create policy "reviews owner insert" on public.reviews
  for insert with check (auth.uid() = user_id);
create policy "reviews owner update" on public.reviews
  for update using (auth.uid() = user_id);

-- subscriptions: owner only
create policy "subscriptions owner" on public.subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
