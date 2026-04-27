-- Chez Jules Fleuriste — initial schema (Sprint 1)
-- Postgres / Supabase, with Row Level Security on every table.

-- ---------- Extensions ----------
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ---------- Helpers ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end $$;

-- ---------- Profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Defensive: if the table already existed (Supabase templates), backfill columns.
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists is_admin boolean not null default false;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Categories ----------
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text,
  image_url text,
  position int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.categories add column if not exists slug text;
alter table public.categories add column if not exists name text;
alter table public.categories add column if not exists description text;
alter table public.categories add column if not exists image_url text;
alter table public.categories add column if not exists position int not null default 0;
alter table public.categories add column if not exists created_at timestamptz not null default now();

-- ---------- Products ----------
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  name text not null,
  description text,
  price_cents int not null check (price_cents >= 0),
  compare_at_cents int check (compare_at_cents is null or compare_at_cents >= price_cents),
  category_id uuid references public.categories(id) on delete set null,
  occasions text[] not null default '{}',
  colors text[] not null default '{}',
  stock int not null default 0 check (stock >= 0),
  is_featured boolean not null default false,
  is_new boolean not null default false,
  is_active boolean not null default true,
  image_url text,
  search_doc tsvector generated always as (
    to_tsvector('french', coalesce(name,'') || ' ' || coalesce(description,''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- Defensive: backfill columns if products pre-existed.
alter table public.products add column if not exists slug text;
alter table public.products add column if not exists name text;
alter table public.products add column if not exists description text;
alter table public.products add column if not exists price_cents int not null default 0;
alter table public.products add column if not exists compare_at_cents int;
alter table public.products add column if not exists category_id uuid references public.categories(id) on delete set null;
alter table public.products add column if not exists occasions text[] not null default '{}';
alter table public.products add column if not exists colors text[] not null default '{}';
alter table public.products add column if not exists stock int not null default 0;
alter table public.products add column if not exists is_featured boolean not null default false;
alter table public.products add column if not exists is_new boolean not null default false;
alter table public.products add column if not exists is_active boolean not null default true;
alter table public.products add column if not exists image_url text;
alter table public.products add column if not exists search_doc tsvector
  generated always as (
    to_tsvector('french', coalesce(name,'') || ' ' || coalesce(description,''))
  ) stored;
alter table public.products add column if not exists created_at timestamptz not null default now();
alter table public.products add column if not exists updated_at timestamptz not null default now();

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_search_idx on public.products using gin(search_doc);
create index if not exists products_occasions_idx on public.products using gin(occasions);
create index if not exists products_colors_idx on public.products using gin(colors);
drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- ---------- Product images ----------
create table if not exists public.product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text,
  position int not null default 0
);
alter table public.product_images add column if not exists product_id uuid references public.products(id) on delete cascade;
alter table public.product_images add column if not exists url text;
alter table public.product_images add column if not exists alt text;
alter table public.product_images add column if not exists position int not null default 0;
create index if not exists product_images_product_idx on public.product_images(product_id);

-- ---------- Addresses ----------
create table if not exists public.addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  street text not null,
  city text not null,
  postal_code text not null,
  country text not null default 'FR',
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.addresses add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.addresses add column if not exists full_name text;
alter table public.addresses add column if not exists street text;
alter table public.addresses add column if not exists city text;
alter table public.addresses add column if not exists postal_code text;
alter table public.addresses add column if not exists country text not null default 'FR';
alter table public.addresses add column if not exists phone text;
alter table public.addresses add column if not exists is_default boolean not null default false;
alter table public.addresses add column if not exists created_at timestamptz not null default now();
create index if not exists addresses_user_idx on public.addresses(user_id);

-- ---------- Promo codes ----------
create table if not exists public.promo_codes (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  kind text not null check (kind in ('percent','fixed')),
  amount int not null check (amount > 0),
  min_subtotal_cents int not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  max_redemptions int,
  redemptions int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.promo_codes add column if not exists code text;
alter table public.promo_codes add column if not exists kind text;
alter table public.promo_codes add column if not exists amount int;
alter table public.promo_codes add column if not exists min_subtotal_cents int not null default 0;
alter table public.promo_codes add column if not exists starts_at timestamptz;
alter table public.promo_codes add column if not exists ends_at timestamptz;
alter table public.promo_codes add column if not exists max_redemptions int;
alter table public.promo_codes add column if not exists redemptions int not null default 0;
alter table public.promo_codes add column if not exists is_active boolean not null default true;
alter table public.promo_codes add column if not exists created_at timestamptz not null default now();

-- ---------- Orders ----------
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'pending' check (
    status in ('pending','paid','preparing','shipped','delivered','cancelled','refunded')
  ),
  subtotal_cents int not null default 0,
  shipping_cents int not null default 0,
  discount_cents int not null default 0,
  total_cents int not null default 0,
  currency text not null default 'EUR',
  delivery_method text not null default 'shipping' check (delivery_method in ('shipping','pickup')),
  delivery_at timestamptz,
  delivery_address_id uuid references public.addresses(id) on delete set null,
  promo_code_id uuid references public.promo_codes(id) on delete set null,
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.orders add column if not exists status text not null default 'pending';
alter table public.orders add column if not exists subtotal_cents int not null default 0;
alter table public.orders add column if not exists shipping_cents int not null default 0;
alter table public.orders add column if not exists discount_cents int not null default 0;
alter table public.orders add column if not exists total_cents int not null default 0;
alter table public.orders add column if not exists currency text not null default 'EUR';
alter table public.orders add column if not exists delivery_method text not null default 'shipping';
alter table public.orders add column if not exists delivery_at timestamptz;
alter table public.orders add column if not exists delivery_address_id uuid references public.addresses(id) on delete set null;
alter table public.orders add column if not exists promo_code_id uuid references public.promo_codes(id) on delete set null;
alter table public.orders add column if not exists stripe_session_id text;
alter table public.orders add column if not exists stripe_payment_intent_id text;
alter table public.orders add column if not exists notes text;
alter table public.orders add column if not exists created_at timestamptz not null default now();
alter table public.orders add column if not exists updated_at timestamptz not null default now();
create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------- Order items ----------
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price_cents int not null,
  quantity int not null check (quantity > 0),
  size text
);
alter table public.order_items add column if not exists order_id uuid references public.orders(id) on delete cascade;
alter table public.order_items add column if not exists product_id uuid references public.products(id) on delete set null;
alter table public.order_items add column if not exists product_name text;
alter table public.order_items add column if not exists unit_price_cents int;
alter table public.order_items add column if not exists quantity int;
alter table public.order_items add column if not exists size text;
create index if not exists order_items_order_idx on public.order_items(order_id);

-- ---------- Wishlist ----------
create table if not exists public.wishlist_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);
alter table public.wishlist_items add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.wishlist_items add column if not exists product_id uuid references public.products(id) on delete cascade;
alter table public.wishlist_items add column if not exists created_at timestamptz not null default now();

-- ---------- Reviews ----------
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.reviews add column if not exists product_id uuid references public.products(id) on delete cascade;
alter table public.reviews add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.reviews add column if not exists rating int;
alter table public.reviews add column if not exists title text;
alter table public.reviews add column if not exists body text;
alter table public.reviews add column if not exists is_approved boolean not null default false;
alter table public.reviews add column if not exists created_at timestamptz not null default now();
create index if not exists reviews_product_idx on public.reviews(product_id);

-- ---------- Banners ----------
create table if not exists public.banners (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  subtitle text,
  cta_label text,
  cta_href text,
  image_url text not null,
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  position int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.banners add column if not exists title text;
alter table public.banners add column if not exists subtitle text;
alter table public.banners add column if not exists cta_label text;
alter table public.banners add column if not exists cta_href text;
alter table public.banners add column if not exists image_url text;
alter table public.banners add column if not exists is_active boolean not null default true;
alter table public.banners add column if not exists starts_at timestamptz;
alter table public.banners add column if not exists ends_at timestamptz;
alter table public.banners add column if not exists position int not null default 0;
alter table public.banners add column if not exists created_at timestamptz not null default now();

-- ---------- Subscriptions ----------
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null check (plan in ('discovery','home','atelier')),
  cadence text not null check (cadence in ('weekly','biweekly','monthly')),
  status text not null default 'active' check (status in ('active','paused','cancelled')),
  stripe_subscription_id text unique,
  next_delivery_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.subscriptions add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.subscriptions add column if not exists plan text;
alter table public.subscriptions add column if not exists cadence text;
alter table public.subscriptions add column if not exists status text not null default 'active';
alter table public.subscriptions add column if not exists stripe_subscription_id text;
alter table public.subscriptions add column if not exists next_delivery_at timestamptz;
alter table public.subscriptions add column if not exists created_at timestamptz not null default now();
alter table public.subscriptions add column if not exists updated_at timestamptz not null default now();
create index if not exists subscriptions_user_idx on public.subscriptions(user_id);
drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ===========================================================================
-- Row Level Security
-- ===========================================================================
alter table public.profiles        enable row level security;
alter table public.categories      enable row level security;
alter table public.products        enable row level security;
alter table public.product_images  enable row level security;
alter table public.addresses       enable row level security;
alter table public.promo_codes     enable row level security;
alter table public.orders          enable row level security;
alter table public.order_items     enable row level security;
alter table public.wishlist_items  enable row level security;
alter table public.reviews         enable row level security;
alter table public.banners         enable row level security;
alter table public.subscriptions   enable row level security;

-- Profiles
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Public reads on catalog content
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories for select using (true);
drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"   on public.products   for select using (is_active or public.is_admin());
drop policy if exists "product_images_public_read" on public.product_images;
create policy "product_images_public_read" on public.product_images for select using (true);
drop policy if exists "banners_public_read" on public.banners;
create policy "banners_public_read"    on public.banners    for select using (
  is_active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now())
);

-- Admin writes
drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write"   on public.products   for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "product_images_admin_write" on public.product_images;
create policy "product_images_admin_write" on public.product_images for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "banners_admin_write" on public.banners;
create policy "banners_admin_write"    on public.banners    for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "promo_codes_public_validate" on public.promo_codes;
create policy "promo_codes_public_validate" on public.promo_codes for select using (is_active);
drop policy if exists "promo_codes_admin_write" on public.promo_codes;
create policy "promo_codes_admin_write" on public.promo_codes for all using (public.is_admin()) with check (public.is_admin());

-- Addresses
drop policy if exists "addresses_self_all" on public.addresses;
create policy "addresses_self_all" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Orders
drop policy if exists "orders_self_select" on public.orders;
create policy "orders_self_select" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "orders_admin_write" on public.orders;
create policy "orders_admin_write" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "order_items_self_select" on public.order_items;
create policy "order_items_self_select" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );
drop policy if exists "order_items_admin_write" on public.order_items;
create policy "order_items_admin_write" on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());

-- Wishlist
drop policy if exists "wishlist_self_all" on public.wishlist_items;
create policy "wishlist_self_all" on public.wishlist_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Reviews
drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews
  for select using (is_approved or auth.uid() = user_id or public.is_admin());
drop policy if exists "reviews_self_insert" on public.reviews;
create policy "reviews_self_insert" on public.reviews
  for insert with check (auth.uid() = user_id);
drop policy if exists "reviews_admin_write" on public.reviews;
create policy "reviews_admin_write" on public.reviews
  for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "reviews_admin_delete" on public.reviews;
create policy "reviews_admin_delete" on public.reviews
  for delete using (public.is_admin());

-- Subscriptions
drop policy if exists "subscriptions_self_select" on public.subscriptions;
create policy "subscriptions_self_select" on public.subscriptions
  for select using (auth.uid() = user_id or public.is_admin());
drop policy if exists "subscriptions_admin_write" on public.subscriptions;
create policy "subscriptions_admin_write" on public.subscriptions
  for all using (public.is_admin()) with check (public.is_admin());
