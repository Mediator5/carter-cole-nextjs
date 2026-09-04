-- ============================================================================
--  Carter Cole & Associates — Supabase schema
--  Run this ONCE in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).
--  Safe to re-run: every statement is idempotent.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. SUBSCRIBERS — everyone who opted in (checklist download, newsletter, etc.)
-- ---------------------------------------------------------------------------
create table if not exists public.subscribers (
  id              bigint generated always as identity primary key,
  email           text        not null unique,
  first_name      text        not null,
  last_name       text,
  token           text        not null unique,
  source          text        not null default 'checklist',
  status          text        not null default 'active'
                                check (status in ('active','unsubscribed')),
  created_at      timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create index if not exists idx_subscribers_status  on public.subscribers (status);
create index if not exists idx_subscribers_created on public.subscribers (created_at desc);

-- ---------------------------------------------------------------------------
-- 2. SENDS — one row per (subscriber, sequence email). Makes the dispatcher
--    idempotent: an email can never be sent to the same person twice.
-- ---------------------------------------------------------------------------
create table if not exists public.sends (
  id            bigint generated always as identity primary key,
  subscriber_id bigint      not null references public.subscribers(id) on delete cascade,
  email_key     text        not null,
  sent_at       timestamptz not null default now(),
  status        text        not null default 'sent'
                              check (status in ('sent','failed')),
  error         text,
  unique (subscriber_id, email_key)
);

create index if not exists idx_sends_subscriber on public.sends (subscriber_id);

-- ---------------------------------------------------------------------------
-- 3. DOWNLOADS — every time a token-gated asset is actually opened.
-- ---------------------------------------------------------------------------
create table if not exists public.downloads (
  id            bigint generated always as identity primary key,
  subscriber_id bigint      not null references public.subscribers(id) on delete cascade,
  asset         text        not null,
  downloaded_at timestamptz not null default now()
);

create index if not exists idx_downloads_subscriber on public.downloads (subscriber_id);

-- ---------------------------------------------------------------------------
-- 4. CONTACT SUBMISSIONS — the contact / inquiry form. Previously these were
--    only written to the server console and lost. Now they are kept.
-- ---------------------------------------------------------------------------
create table if not exists public.contact_submissions (
  id            bigint generated always as identity primary key,
  first_name    text        not null,
  last_name     text,
  email         text        not null,
  phone         text,
  department    text        not null default 'general',
  message       text        not null,
  routed_to     text,
  notified      boolean     not null default false,
  auto_replied  boolean     not null default false,
  error         text,
  ip            text,
  user_agent    text,
  status        text        not null default 'new'
                              check (status in ('new','read','replied','archived')),
  created_at    timestamptz not null default now()
);

create index if not exists idx_contact_created    on public.contact_submissions (created_at desc);
create index if not exists idx_contact_status     on public.contact_submissions (status);
create index if not exists idx_contact_department on public.contact_submissions (department);

-- ---------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY
--    Enabled with NO policies, which means: the anon and authenticated keys
--    can read and write NOTHING. Only the service-role key (used server-side
--    in the Next.js API routes, never in the browser) can touch these tables.
--    This is what stops anyone from scraping your mailing list.
-- ---------------------------------------------------------------------------
alter table public.subscribers          enable row level security;
alter table public.sends                enable row level security;
alter table public.downloads            enable row level security;
alter table public.contact_submissions  enable row level security;

-- ---------------------------------------------------------------------------
-- 6. DASHBOARD VIEW — subscribers with their send and download counts.
--    security_invoker makes the view respect the RLS above rather than
--    bypassing it, so it is service-role-only too.
-- ---------------------------------------------------------------------------
create or replace view public.subscribers_with_stats
with (security_invoker = on) as
select
  s.*,
  (select count(*) from public.sends d
     where d.subscriber_id = s.id and d.status = 'sent')::int as sent_count,
  (select count(*) from public.downloads w
     where w.subscriber_id = s.id)::int                       as download_count
from public.subscribers s;

revoke all on public.subscribers_with_stats from anon, authenticated;

-- ============================================================================
--  Done. Next: copy your project URL and service-role key into .env.local
--  (Dashboard -> Project Settings -> API).
-- ============================================================================
