-- Admin features: banners, promotions, notifications, settings,
-- storage policies, and an admin email trigger.
--
-- Run after 0001_init.sql. Set the `admin_email` setting in your Supabase
-- project's Postgres config, or rely on the default 'tiam.rainbow@gmail.com'.

-- ============================================================
-- Admin email helper — checks against a configurable email list.
-- ============================================================
create or replace function public.admin_email()
returns text
language sql
stable
as $$
  select coalesce(
    nullif(current_setting('app.admin_email', true), ''),
    'tiam.rainbow@gmail.com'
  );
$$;

-- Replace is_admin() so the configured email is admin even if no profile row.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from auth.users u
    left join public.profiles p on p.id = u.id
    where u.id = auth.uid()
      and (
        u.email = public.admin_email()
        or coalesce(p.is_admin, false) = true
      )
  );
$$;

-- Auto-create a profile + flag admin on signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, is_admin)
  values (
    new.id,
    new.email,
    new.email = public.admin_email()
  )
  on conflict (id) do update set
    email = excluded.email,
    is_admin = excluded.is_admin;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Banners
-- ============================================================
create table if not exists public.banners (
  id uuid primary key default uuid_generate_v4(),
  message text not null,
  link_label text,
  link_href text,
  bg_color text not null default '#2F4A3A',
  text_color text not null default '#FFFBF3',
  dismissible boolean not null default true,
  active boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_banners_active on public.banners(active) where active;

alter table public.banners enable row level security;
create policy "banners public read active" on public.banners
  for select using (
    active
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at > now())
  );
create policy "banners admin all" on public.banners
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- Promotions / promo codes
-- ============================================================
create table if not exists public.promo_codes (
  code text primary key,
  kind text not null check (kind in ('percent','fixed','free_shipping')),
  value_int int not null default 0,
  min_subtotal_cents int not null default 0,
  max_redemptions int,
  redeemed_count int not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.promo_codes enable row level security;
create policy "promo public read active" on public.promo_codes
  for select using (
    active
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at > now())
  );
create policy "promo admin all" on public.promo_codes
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- Admin notifications (orders, low stock, etc.)
-- ============================================================
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  kind text not null check (kind in ('order_placed','order_paid','low_stock','review','contact')),
  title text not null,
  body text,
  href text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_notifications_unread on public.notifications(read, created_at desc);

alter table public.notifications enable row level security;
create policy "notifications admin read" on public.notifications
  for select using (public.is_admin());
create policy "notifications admin update" on public.notifications
  for update using (public.is_admin());
create policy "notifications insert any" on public.notifications
  for insert with check (true);

-- ============================================================
-- Settings (single row by key)
-- ============================================================
create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;
create policy "settings public read" on public.settings
  for select using (true);
create policy "settings admin write" on public.settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- Storage buckets (run in SQL editor — buckets created via dashboard
-- if these fail). Public buckets so we can serve images directly.
-- ============================================================
insert into storage.buckets (id, name, public)
values
  ('product-images','product-images', true),
  ('category-images','category-images', true),
  ('banners','banners', true)
on conflict (id) do nothing;

-- Storage RLS: anyone reads, admins write.
create policy "storage public read"
  on storage.objects for select
  using (bucket_id in ('product-images','category-images','banners'));

create policy "storage admin write"
  on storage.objects for insert
  with check (
    bucket_id in ('product-images','category-images','banners')
    and public.is_admin()
  );

create policy "storage admin update"
  on storage.objects for update
  using (
    bucket_id in ('product-images','category-images','banners')
    and public.is_admin()
  );

create policy "storage admin delete"
  on storage.objects for delete
  using (
    bucket_id in ('product-images','category-images','banners')
    and public.is_admin()
  );
