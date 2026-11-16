-- Test 3 marketplace schema.
-- Run this in the Supabase SQL editor.

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 80),
  description text not null check (char_length(description) between 10 and 2000),
  price numeric(10, 2) not null check (price >= 0 and price <= 1000000),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  category text not null check (
    category in ('Electronics', 'Furniture', 'Clothing', 'Books', 'Sports', 'Other')
  ),
  image_url text not null check (image_url ~ '^https://'),
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_name text not null check (char_length(buyer_name) between 2 and 80),
  buyer_email text not null check (buyer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  body text not null check (char_length(body) between 5 and 1000),
  created_at timestamptz not null default now()
);

create index if not exists listings_created_at_idx
  on public.listings (created_at desc);

create index if not exists listings_category_idx
  on public.listings (category);

create index if not exists messages_listing_id_idx
  on public.messages (listing_id);

alter table public.listings enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Public can read listings" on public.listings;
create policy "Public can read listings"
  on public.listings for select
  using (true);

drop policy if exists "Public can insert listings" on public.listings;
create policy "Public can insert listings"
  on public.listings for insert
  with check (true);

drop policy if exists "Public can send messages" on public.messages;
create policy "Public can send messages"
  on public.messages for insert
  with check (true);

notify pgrst, 'reload schema';
