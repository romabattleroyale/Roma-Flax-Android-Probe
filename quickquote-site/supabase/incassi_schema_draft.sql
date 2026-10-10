-- ImpresaFlow Incassi — schema draft for review only.
-- NOT APPLIED to any Supabase project. Test on a disposable project first.
-- This draft follows the current QuickQuote single-user ownership model (user_id).
-- If the product becomes multi-company, migrate to company_id + membership/RLS before launch.
-- Never expose service_role credentials in browser code.

create extension if not exists pgcrypto;

create table if not exists public.incassi_invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete restrict,
  invoice_number text not null,
  issue_date date,
  due_date date not null,
  currency char(3) not null default 'EUR' check (currency = 'EUR'),
  original_amount_cents bigint not null check (original_amount_cents > 0),
  status text not null default 'open'
    check (status in ('open','disputed','cancelled','closed')),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, invoice_number),
  unique (id, user_id),
  check (length(trim(invoice_number)) > 0)
);

-- PostgreSQL requires a unique key on the referenced column pair before
-- the composite foreign key can be created. Verify this index is compatible
-- with the existing customers table before applying the draft.
create unique index if not exists customers_id_user_id_uidx
  on public.customers(id, user_id);

-- Composite FK guarantees that an invoice cannot point at another user's customer.
alter table public.incassi_invoices
  drop constraint if exists incassi_invoice_customer_owner_fk;
alter table public.incassi_invoices
  add constraint incassi_invoice_customer_owner_fk
  foreign key (customer_id, user_id)
  references public.customers(id, user_id)
  on delete restrict;

create table if not exists public.incassi_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  invoice_id uuid not null,
  amount_cents bigint not null check (amount_cents > 0),
  payment_date date not null,
  verification_status text not null default 'pending'
    check (verification_status in ('pending','verified','rejected')),
  reference text,
  note text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (invoice_id, user_id)
    references public.incassi_invoices(id, user_id) on delete restrict,
  check (
    (verification_status = 'verified' and verified_at is not null)
    or (verification_status <> 'verified')
  )
);

create table if not exists public.incassi_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  invoice_id uuid not null,
  stage text not null check (stage in ('friendly','formal','final_admin')),
  subject text not null,
  body text not null,
  status text not null default 'draft'
    check (status in ('draft','approved','sent','cancelled')),
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  sent_at timestamptz,
  channel text check (channel in ('email','pec','manual','other')),
  delivery_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (invoice_id, user_id)
    references public.incassi_invoices(id, user_id) on delete restrict,
  check (status not in ('approved','sent') or (approved_by is not null and approved_at is not null)),
  check (status <> 'sent' or (sent_at is not null and channel is not null))
);

create table if not exists public.incassi_payment_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  invoice_id uuid not null,
  status text not null default 'draft'
    check (status in ('draft','proposed','accepted','declined','cancelled','completed')),
  total_amount_cents bigint not null check (total_amount_cents > 0),
  proposed_at timestamptz,
  accepted_at timestamptz,
  acceptance_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (invoice_id, user_id)
    references public.incassi_invoices(id, user_id) on delete restrict,
  check (status <> 'proposed' or proposed_at is not null),
  check (status <> 'accepted' or (accepted_at is not null and length(trim(coalesce(acceptance_note,''))) > 0))
);

create table if not exists public.incassi_installments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null,
  sequence_number integer not null check (sequence_number > 0),
  due_date date not null,
  amount_cents bigint not null check (amount_cents > 0),
  status text not null default 'scheduled'
    check (status in ('scheduled','paid','late','disputed')),
  payment_id uuid,
  created_at timestamptz not null default now(),
  unique (plan_id, sequence_number),
  unique (id, user_id),
  foreign key (plan_id, user_id)
    references public.incassi_payment_plans(id, user_id) on delete restrict,
  foreign key (payment_id, user_id)
    references public.incassi_payments(id, user_id) on delete restrict,
  check ((status = 'paid' and payment_id is not null) or status <> 'paid')
);

create table if not exists public.incassi_activity_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  invoice_id uuid not null,
  event_type text not null check (length(trim(event_type)) > 0),
  summary text not null check (length(trim(summary)) > 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  foreign key (invoice_id, user_id)
    references public.incassi_invoices(id, user_id) on delete restrict
);

create index if not exists incassi_invoices_user_due_idx
  on public.incassi_invoices(user_id, due_date);
create index if not exists incassi_invoices_user_status_idx
  on public.incassi_invoices(user_id, status);
create index if not exists incassi_payments_invoice_idx
  on public.incassi_payments(invoice_id, verification_status);
create index if not exists incassi_reminders_invoice_idx
  on public.incassi_reminders(invoice_id, created_at desc);
create index if not exists incassi_plans_invoice_idx
  on public.incassi_payment_plans(invoice_id, created_at desc);
create index if not exists incassi_installments_user_due_idx
  on public.incassi_installments(user_id, due_date, status);
create index if not exists incassi_events_invoice_idx
  on public.incassi_activity_events(invoice_id, created_at desc);

create or replace function public.incassi_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists incassi_invoices_updated_at on public.incassi_invoices;
create trigger incassi_invoices_updated_at before update on public.incassi_invoices
for each row execute function public.incassi_set_updated_at();
drop trigger if exists incassi_reminders_updated_at on public.incassi_reminders;
create trigger incassi_reminders_updated_at before update on public.incassi_reminders
for each row execute function public.incassi_set_updated_at();
drop trigger if exists incassi_plans_updated_at on public.incassi_payment_plans;
create trigger incassi_plans_updated_at before update on public.incassi_payment_plans
for each row execute function public.incassi_set_updated_at();

-- Activity history is intentionally read-only to browser clients.
-- Insert events through trusted server-side code or a validated database function.
alter table public.incassi_invoices enable row level security;
alter table public.incassi_payments enable row level security;
alter table public.incassi_reminders enable row level security;
alter table public.incassi_payment_plans enable row level security;
alter table public.incassi_installments enable row level security;
alter table public.incassi_activity_events enable row level security;

-- Invoice policies
drop policy if exists incassi_invoices_select_own on public.incassi_invoices;
create policy incassi_invoices_select_own on public.incassi_invoices
for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists incassi_invoices_insert_own on public.incassi_invoices;
create policy incassi_invoices_insert_own on public.incassi_invoices
for insert to authenticated with check (
  user_id = (select auth.uid()) and exists (
    select 1 from public.customers c
    where c.id = customer_id and c.user_id = (select auth.uid())
  )
);
drop policy if exists incassi_invoices_update_own on public.incassi_invoices;
create policy incassi_invoices_update_own on public.incassi_invoices
for update to authenticated using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()) and exists (
  select 1 from public.customers c
  where c.id = customer_id and c.user_id = (select auth.uid())
));
drop policy if exists incassi_invoices_delete_own on public.incassi_invoices;
create policy incassi_invoices_delete_own on public.incassi_invoices
for delete to authenticated using (user_id = (select auth.uid()));

-- Payment policies
drop policy if exists incassi_payments_select_own on public.incassi_payments;
create policy incassi_payments_select_own on public.incassi_payments
for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists incassi_payments_insert_own on public.incassi_payments;
create policy incassi_payments_insert_own on public.incassi_payments
for insert to authenticated with check (
  user_id = (select auth.uid()) and exists (
    select 1 from public.incassi_invoices i
    where i.id = invoice_id and i.user_id = (select auth.uid())
  )
);
-- Browser users may correct/delete only pending payment entries.
-- Verified/rejected records are immutable to browser clients and require a
-- trusted, audited server-side correction workflow.
drop policy if exists incassi_payments_update_own on public.incassi_payments;
create policy incassi_payments_update_own on public.incassi_payments
for update to authenticated using (
  user_id = (select auth.uid()) and verification_status = 'pending'
) with check (
  user_id = (select auth.uid()) and verification_status = 'pending'
  and exists (
    select 1 from public.incassi_invoices i
    where i.id = invoice_id and i.user_id = (select auth.uid())
  )
);
drop policy if exists incassi_payments_delete_own on public.incassi_payments;
create policy incassi_payments_delete_own on public.incassi_payments
for delete to authenticated using (
  user_id = (select auth.uid()) and verification_status = 'pending'
);

-- Reminder policies: users can edit their own drafts. Approval/sending should be
-- moved to a server-side RPC that validates role, invoice status and recipient.
drop policy if exists incassi_reminders_select_own on public.incassi_reminders;
create policy incassi_reminders_select_own on public.incassi_reminders
for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists incassi_reminders_insert_own on public.incassi_reminders;
create policy incassi_reminders_insert_own on public.incassi_reminders
for insert to authenticated with check (
  user_id = (select auth.uid()) and status = 'draft'
  and approved_by is null and approved_at is null and sent_at is null
);
drop policy if exists incassi_reminders_update_own_drafts on public.incassi_reminders;
create policy incassi_reminders_update_own_drafts on public.incassi_reminders
for update to authenticated using (user_id = (select auth.uid()) and status = 'draft')
with check (user_id = (select auth.uid()) and status = 'draft'
  and approved_by is null and approved_at is null and sent_at is null);
drop policy if exists incassi_reminders_delete_own_drafts on public.incassi_reminders;
create policy incassi_reminders_delete_own_drafts on public.incassi_reminders
for delete to authenticated using (user_id = (select auth.uid()) and status = 'draft');

-- Plan policies: browser can create/edit drafts and propose them, but accepted
-- plans should be confirmed by a trusted server-side workflow before production.
drop policy if exists incassi_plans_select_own on public.incassi_payment_plans;
create policy incassi_plans_select_own on public.incassi_payment_plans
for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists incassi_plans_insert_own on public.incassi_payment_plans;
create policy incassi_plans_insert_own on public.incassi_payment_plans
for insert to authenticated with check (user_id = (select auth.uid()) and status in ('draft','proposed'));
drop policy if exists incassi_plans_update_own_draft on public.incassi_payment_plans;
create policy incassi_plans_update_own_draft on public.incassi_payment_plans
for update to authenticated using (user_id = (select auth.uid()) and status in ('draft','proposed'))
with check (user_id = (select auth.uid()) and status in ('draft','proposed'));

-- Installments can be managed only while their plan is still a draft/proposal.
drop policy if exists incassi_installments_select_own on public.incassi_installments;
create policy incassi_installments_select_own on public.incassi_installments
for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists incassi_installments_insert_own on public.incassi_installments;
create policy incassi_installments_insert_own on public.incassi_installments
for insert to authenticated with check (
  user_id = (select auth.uid()) and exists (
    select 1 from public.incassi_payment_plans p
    where p.id = plan_id and p.user_id = (select auth.uid())
      and p.status in ('draft','proposed')
  )
);
drop policy if exists incassi_installments_update_own on public.incassi_installments;
create policy incassi_installments_update_own on public.incassi_installments
for update to authenticated using (
  user_id = (select auth.uid()) and exists (
    select 1 from public.incassi_payment_plans p
    where p.id = plan_id and p.user_id = (select auth.uid())
      and p.status in ('draft','proposed')
  )
) with check (
  user_id = (select auth.uid()) and exists (
    select 1 from public.incassi_payment_plans p
    where p.id = plan_id and p.user_id = (select auth.uid())
      and p.status in ('draft','proposed')
  )
);

-- Events may be read by their owner but cannot be inserted/updated/deleted
-- directly from the browser. A future server-side function must write audit events.
drop policy if exists incassi_events_select_own on public.incassi_activity_events;
create policy incassi_events_select_own on public.incassi_activity_events
for select to authenticated using (user_id = (select auth.uid()));

-- Important implementation gaps before production:
-- 1. No database constraint yet sums verified payments against invoice balance.
--    Implement an atomic, server-side payment function and concurrency tests.
-- 2. Approval, send, verification and plan acceptance must use server-side functions.
-- 3. A true multi-company model requires company memberships and a new RLS design.
-- 4. Review delete permissions, retention, exports, and soft-delete strategy.
-- 5. Test all RLS policies with two independent authenticated accounts.
-- 6. Do not run this draft on a live database without a reviewed migration and backup.


-- Browser-side users must not self-certify payment verification or approval.
-- auth.uid() is present for normal authenticated client requests. Trusted backend
-- operations must use a carefully protected server-side path and audit every action.
create or replace function public.incassi_guard_payment_verification()
returns trigger language plpgsql as $$
begin
  if auth.uid() is not null then
    if tg_op = 'INSERT' and new.verification_status <> 'pending' then
      raise exception 'Payments must start as pending verification';
    end if;
    if tg_op = 'UPDATE'
      and (new.verification_status is distinct from old.verification_status
        or new.verified_at is distinct from old.verified_at) then
      raise exception 'Payment verification requires a trusted server-side workflow';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists incassi_payments_guard_verification on public.incassi_payments;
create trigger incassi_payments_guard_verification
before insert or update on public.incassi_payments
for each row execute function public.incassi_guard_payment_verification();

create or replace function public.incassi_guard_reminder_approval()
returns trigger language plpgsql as $$
begin
  if auth.uid() is not null then
    if tg_op = 'INSERT' and new.status <> 'draft' then
      raise exception 'Reminders must start as drafts';
    end if;
    if tg_op = 'UPDATE' and (
      new.status is distinct from old.status
      or new.approved_by is distinct from old.approved_by
      or new.approved_at is distinct from old.approved_at
      or new.sent_at is distinct from old.sent_at
      or new.delivery_reference is distinct from old.delivery_reference
    ) then
      raise exception 'Reminder approval and sending require a trusted server-side workflow';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists incassi_reminders_guard_approval on public.incassi_reminders;
create trigger incassi_reminders_guard_approval
before insert or update on public.incassi_reminders
for each row execute function public.incassi_guard_reminder_approval();

create or replace function public.incassi_guard_plan_acceptance()
returns trigger language plpgsql as $$
begin
  if auth.uid() is not null then
    if tg_op = 'INSERT' and new.status not in ('draft','proposed') then
      raise exception 'Payment plans must start as drafts or proposals';
    end if;
    if tg_op = 'UPDATE' and (
      (new.status = 'accepted' and old.status is distinct from 'accepted')
      or new.accepted_at is distinct from old.accepted_at
      or new.acceptance_note is distinct from old.acceptance_note
    ) then
      raise exception 'Plan acceptance requires a trusted server-side workflow';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists incassi_plans_guard_acceptance on public.incassi_payment_plans;
create trigger incassi_plans_guard_acceptance
before insert or update on public.incassi_payment_plans
for each row execute function public.incassi_guard_plan_acceptance();

-- Client-provided activity history is not authoritative; event inserts are reserved
-- for a trusted backend function with validated ownership and sanitized metadata.


-- Browser clients cannot mark installments paid or attach an authoritative payment.
-- A trusted server-side verification workflow must update this state atomically.
create or replace function public.incassi_guard_installment_payment()
returns trigger language plpgsql as $$
begin
  if auth.uid() is not null then
    if tg_op = 'INSERT' and (new.status <> 'scheduled' or new.payment_id is not null) then
      raise exception 'Installments must start scheduled without a payment';
    end if;
    if tg_op = 'UPDATE' and (
      new.status is distinct from old.status
      or new.payment_id is distinct from old.payment_id
    ) then
      raise exception 'Installment payment status requires a trusted server-side workflow';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists incassi_installments_guard_payment on public.incassi_installments;
create trigger incassi_installments_guard_payment
before insert or update on public.incassi_installments
for each row execute function public.incassi_guard_installment_payment();
