create table if not exists public.setukit_drafts (
  id uuid primary key,
  student_name text not null,
  grade text not null,
  semester text not null,
  results jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.setukit_drafts enable row level security;

drop policy if exists "Allow anonymous draft reads" on public.setukit_drafts;
create policy "Allow anonymous draft reads"
  on public.setukit_drafts for select to anon using (true);

drop policy if exists "Allow anonymous draft inserts" on public.setukit_drafts;
create policy "Allow anonymous draft inserts"
  on public.setukit_drafts for insert to anon with check (true);
