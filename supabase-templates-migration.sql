-- Output templates — users can save any generated output as a reusable template
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  output_type text not null,  -- e.g. 'ebook', 'linkedin_post', 'email_course'
  project_kind text not null default 'content', -- 'content' | 'product'
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.templates enable row level security;

-- Users can only see/manage their own templates
create policy "Users manage own templates"
  on public.templates for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists templates_user_id_idx on public.templates(user_id);
