-- Helper: checks if current authenticated user is admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- Enable RLS
alter table public.clients enable row level security;
alter table public.employees enable row level security;
alter table public.projects enable row level security;
alter table public.time_logs enable row level security;
alter table public.users enable row level security;

-- Optional: remove old policies if re-running migration manually
drop policy if exists "Admins can do everything on clients" on public.clients;
drop policy if exists "Admins can do everything on employees" on public.employees;
drop policy if exists "Admins can do everything on projects" on public.projects;
drop policy if exists "Admins can do everything on time_logs" on public.time_logs;
drop policy if exists "Admins can do everything on users" on public.users;

-- Admin CRUD on all tables
create policy "Admins can do everything on clients"
on public.clients
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can do everything on employees"
on public.employees
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can do everything on projects"
on public.projects
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can do everything on time_logs"
on public.time_logs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can do everything on users"
on public.users
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());