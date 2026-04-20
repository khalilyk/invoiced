-- Run this once in your Supabase SQL editor
-- supabase.com → your project → SQL Editor → New query

-- ─── Organizations ────────────────────────────────────────────────────────────
create table if not exists public.organizations (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  brand       jsonb not null default '{
    "primary_color":   "#111111",
    "secondary_color": "#f5f5f5",
    "accent_color":    "#6366f1",
    "font_family":     "Inter",
    "font_size_base":  14,
    "heading_size":    24,
    "logo_url":        null,
    "address":         null,
    "email":           null,
    "phone":           null,
    "website":         null,
    "footer_note":     null
  }',
  created_at  timestamptz not null default now()
);

alter table public.organizations enable row level security;

create policy "owners can manage their orgs"
  on public.organizations for all
  using  (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- ─── Clients ──────────────────────────────────────────────────────────────────
create table if not exists public.clients (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations(id) on delete cascade,
  name        text not null,
  company     text,
  email       text,
  phone       text,
  address     text,
  created_at  timestamptz not null default now()
);

alter table public.clients enable row level security;

create policy "org owners can manage clients"
  on public.clients for all
  using  (exists (select 1 from public.organizations o where o.id = clients.org_id and o.owner_id = auth.uid()))
  with check (exists (select 1 from public.organizations o where o.id = clients.org_id and o.owner_id = auth.uid()));

-- ─── Invoices ─────────────────────────────────────────────────────────────────
create table if not exists public.invoices (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations(id) on delete cascade,
  client_id   uuid not null references public.clients(id),
  number      text not null,
  status      text not null default 'draft' check (status in ('draft','sent','paid','overdue')),
  issue_date  date not null,
  due_date    date not null,
  tax_rate    numeric(5,2) not null default 10,
  notes       text,
  items       jsonb not null default '[]',
  created_at  timestamptz not null default now()
);

alter table public.invoices enable row level security;

create policy "org owners can manage invoices"
  on public.invoices for all
  using  (exists (select 1 from public.organizations o where o.id = invoices.org_id and o.owner_id = auth.uid()))
  with check (exists (select 1 from public.organizations o where o.id = invoices.org_id and o.owner_id = auth.uid()));
