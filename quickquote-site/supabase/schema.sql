-- QuickQuote database foundation (Supabase / PostgreSQL)
-- Apply only to a NEW Supabase project after reviewing this file.
-- Every customer and quote is owned by the authenticated user.
-- Do not put service_role keys in browser code.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  business_name text,
  vat_number text,
  address text,
  phone text,
  logo_url text,
  plan text not null default 'free' check (plan in ('free','pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- A browser-authenticated user must never be able to grant themselves Pro.
-- Trusted server-side billing code may change plan when auth.uid() is null.
create or replace function public.guard_profile_plan()
returns trigger language plpgsql as $
begin
  if (auth.uid() is not null) then
    if (tg_op = 'INSERT' and new.plan <> 'free') then
      raise exception 'Plan can only be assigned by trusted billing code';
    end if;
    if (tg_op = 'UPDATE' and new.plan is distinct from old.plan) then
      raise exception 'Plan can only be changed by trusted billing code';
    end if;
  end if;
  return new;
end;
$;

drop trigger if exists profiles_guard_plan on public.profiles;
create trigger profiles_guard_plan before insert or update on public.profiles
for each row execute function public.guard_profile_plan();

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  vat_number text,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  quote_number text not null,
  title text not null default 'Nuovo preventivo',
  status text not null default 'draft'
    check (status in ('draft','sent','accepted','rejected','expired')),
  issue_date date not null default current_date,
  valid_until date,
  currency char(3) not null default 'EUR',
  notes text,
  terms text,
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  tax_total numeric(12,2) not null default 0 check (tax_total >= 0),
  total numeric(12,2) not null default 0 check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, quote_number)
);

create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  description text not null,
  quantity numeric(12,3) not null default 1 check (quantity > 0),
  unit_price numeric(12,2) not null default 0 check (unit_price >= 0),
  vat_rate numeric(5,2) not null default 22
    check (vat_rate in (0,4,5,10,22)),
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists customers_user_id_idx on public.customers(user_id);
create index if not exists quotes_user_date_idx on public.quotes(user_id, issue_date desc);
create index if not exists quote_items_quote_id_idx on public.quote_items(quote_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
drop trigger if exists customers_updated_at on public.customers;
create trigger customers_updated_at before update on public.customers
for each row execute function public.set_updated_at();
drop trigger if exists quotes_updated_at on public.quotes;
create trigger quotes_updated_at before update on public.quotes
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;

drop policy if exists "profile_select_own" on public.profiles;
create policy "profile_select_own" on public.profiles for select to authenticated
using (id = (select auth.uid()));
drop policy if exists "profile_insert_own" on public.profiles;
create policy "profile_insert_own" on public.profiles for insert to authenticated
with check (id = (select auth.uid()));
drop policy if exists "profile_update_own" on public.profiles;
create policy "profile_update_own" on public.profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "customers_select_own" on public.customers;
create policy "customers_select_own" on public.customers for select to authenticated
using (user_id = (select auth.uid()));
drop policy if exists "customers_insert_own" on public.customers;
create policy "customers_insert_own" on public.customers for insert to authenticated
with check (user_id = (select auth.uid()));
drop policy if exists "customers_update_own" on public.customers;
create policy "customers_update_own" on public.customers for update to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "customers_delete_own" on public.customers;
create policy "customers_delete_own" on public.customers for delete to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "quotes_select_own" on public.quotes;
create policy "quotes_select_own" on public.quotes for select to authenticated
using (user_id = (select auth.uid()));
drop policy if exists "quotes_insert_own" on public.quotes;
create policy "quotes_insert_own" on public.quotes for insert to authenticated
with check (
  user_id = (select auth.uid())
  and (customer_id is null or exists (
    select 1 from public.customers c
    where c.id = customer_id and c.user_id = (select auth.uid())
  ))
);
drop policy if exists "quotes_update_own" on public.quotes;
create policy "quotes_update_own" on public.quotes for update to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid())
  and (customer_id is null or exists (
    select 1 from public.customers c
    where c.id = customer_id and c.user_id = (select auth.uid())
  ))
);
drop policy if exists "quotes_delete_own" on public.quotes;
create policy "quotes_delete_own" on public.quotes for delete to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "items_select_own_quote" on public.quote_items;
create policy "items_select_own_quote" on public.quote_items for select to authenticated
using (exists (select 1 from public.quotes q where q.id = quote_id and q.user_id = (select auth.uid())));
drop policy if exists "items_insert_own_quote" on public.quote_items;
create policy "items_insert_own_quote" on public.quote_items for insert to authenticated
with check (exists (select 1 from public.quotes q where q.id = quote_id and q.user_id = (select auth.uid())));
drop policy if exists "items_update_own_quote" on public.quote_items;
create policy "items_update_own_quote" on public.quote_items for update to authenticated
using (exists (select 1 from public.quotes q where q.id = quote_id and q.user_id = (select auth.uid())))
with check (exists (select 1 from public.quotes q where q.id = quote_id and q.user_id = (select auth.uid())));
drop policy if exists "items_delete_own_quote" on public.quote_items;
create policy "items_delete_own_quote" on public.quote_items for delete to authenticated
using (exists (select 1 from public.quotes q where q.id = quote_id and q.user_id = (select auth.uid())));

-- Deliberately not included yet:
-- * automatic quote numbering (must be concurrency-safe per user)
-- * subscription entitlement verification / Stripe and PayPal webhooks
-- * logo storage bucket policies
-- * GDPR export/deletion workflow and retention rules
-- * server-side total calculation; never trust client-submitted totals alone
