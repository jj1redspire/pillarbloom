-- Waitlist table for capturing early access emails
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'landing',  -- 'hero', 'cta', 'lead_magnet', 'demo'
  created_at timestamptz not null default now()
);

-- Unique constraint so the same email+source combo only appears once
create unique index if not exists waitlist_email_source_unique
  on public.waitlist (email, source);

-- RLS: only service role can read/write (anon users submit via API route)
alter table public.waitlist enable row level security;

-- No SELECT policy for anon — reads only via service role
-- INSERT policy via service role (API route uses service key, bypasses RLS)
