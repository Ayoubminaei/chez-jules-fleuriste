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
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_search_idx on public.products using gin(search_doc);
create index if not exists products_occasions_idx on public.products using gin(occasions);
create index if not exists products_colors_idx on public.products using gin(colors);
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
create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
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
create index if not exists order_items_order_idx on public.order_items(order_id);

-- ---------- Wishlist ----------
create table if not exists public.wishlist_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

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
create index if not exists subscriptions_user_idx on public.subscriptions(user_id);
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

-- Profiles: each user reads/updates their own; admins read all.
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Public reads on catalog content.
create policy "categories_public_read" on public.categories for select using (true);
create policy "products_public_read"   on public.products   for select using (is_active or public.is_admin());
create policy "product_images_public_read" on public.product_images for select using (true);
create policy "banners_public_read"    on public.banners    for select using (
  is_active and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at > now())
);

-- Admin writes for catalog/banners.
create policy "categories_admin_write" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "products_admin_write"   on public.products   for all using (public.is_admin()) with check (public.is_admin());
create policy "product_images_admin_write" on public.product_images for all using (public.is_admin()) with check (public.is_admin());
create policy "banners_admin_write"    on public.banners    for all using (public.is_admin()) with check (public.is_admin());
create policy "promo_codes_public_validate" on public.promo_codes for select using (is_active);
create policy "promo_codes_admin_write" on public.promo_codes for all using (public.is_admin()) with check (public.is_admin());

-- Addresses owned by their user.
create policy "addresses_self_all" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Orders: customer reads own; admin reads all; insert via server.
create policy "orders_self_select" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());
create policy "orders_admin_write" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());

create policy "order_items_self_select" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );
create policy "order_items_admin_write" on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());

-- Wishlist
create policy "wishlist_self_all" on public.wishlist_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Reviews: public reads approved; user inserts own; admin moderates.
create policy "reviews_public_read" on public.reviews
  for select using (is_approved or auth.uid() = user_id or public.is_admin());
create policy "reviews_self_insert" on public.reviews
  for insert with check (auth.uid() = user_id);
create policy "reviews_admin_write" on public.reviews
  for update using (public.is_admin()) with check (public.is_admin());
create policy "reviews_admin_delete" on public.reviews
  for delete using (public.is_admin());

-- Subscriptions
create policy "subscriptions_self_select" on public.subscriptions
  for select using (auth.uid() = user_id or public.is_admin());
create policy "subscriptions_admin_write" on public.subscriptions
  for all using (public.is_admin()) with check (public.is_admin());
