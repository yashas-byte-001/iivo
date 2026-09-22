-- iivo.org tester programme — schema for a fresh Supabase project.
-- Paste this whole file into the SQL editor (Dashboard → SQL Editor → New query)
-- and run it once. It is safe to re-run: every statement is idempotent.

-- The tester programme table. It keeps the `waitlist` name and columns the
-- programme has always used, so src/hooks/useTester.js needs no changes.
create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users (id) on delete cascade,
  full_name  text not null,
  email      text not null,
  interest   text not null default 'Student',
  college    text,
  course     text,
  created_at timestamptz not null default now()
);

-- One row per person, whichever way they signed in. The app treats the 23505
-- these raise as "you are already in the programme" rather than an error.
create unique index if not exists waitlist_user_id_key on public.waitlist (user_id);
create unique index if not exists waitlist_email_key on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

-- A signed-in person may add their own row and read it back, and nothing else:
-- the anon key reaches this table from the browser, so the policies are the
-- only thing standing between it and every other tester's email address.
drop policy if exists "waitlist_insert_own" on public.waitlist;
create policy "waitlist_insert_own"
  on public.waitlist for insert to authenticated
  with check (user_id = auth.uid());

-- The email arm matches the lookup useTester.js falls back to when someone
-- signed up with a password and later returns through Google (new user id,
-- same address).
drop policy if exists "waitlist_select_own" on public.waitlist;
create policy "waitlist_select_own"
  on public.waitlist for select to authenticated
  using (user_id = auth.uid() or lower(email) = lower(auth.jwt() ->> 'email'));

-- No update or delete policy: rows are corrected from the dashboard, not the site.
