-- Test 4: Stripe Connect schema.
-- Run after the Test 3 marketplace schema.

alter table public.listings
  add column if not exists status text not null default 'active';

alter table public.listings
  add column if not exists sold_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'listings_status_check'
  ) then
    alter table public.listings
      add constraint listings_status_check
      check (status in ('active', 'sold'));
  end if;
end $$;

create table if not exists public.seller_accounts (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  stripe_account_id text not null unique,
  onboarding_complete boolean not null default false,
  charges_enabled boolean not null default false,
  payouts_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete restrict,
  listing_title text not null,
  seller_email text not null,
  seller_account_id text not null,
  buyer_email text,
  amount_cents integer not null check (amount_cents > 0),
  platform_fee_cents integer not null check (platform_fee_cents >= 0),
  currency text not null default 'usd',
  checkout_session_id text unique,
  payment_intent_id text,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'cancelled')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists seller_accounts_email_idx
  on public.seller_accounts (email);

create index if not exists orders_listing_id_idx
  on public.orders (listing_id);

create index if not exists orders_session_id_idx
  on public.orders (checkout_session_id);

alter table public.seller_accounts enable row level security;
alter table public.orders enable row level security;

notify pgrst, 'reload schema';
