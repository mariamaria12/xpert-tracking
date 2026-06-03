-- Optional fallback if created_by is omitted on insert (app sets it explicitly via resolveCreatedByUserId).
-- PostgREST often does not apply auth.uid() defaults reliably; do not rely on this alone.
alter table public.clients
  alter column created_by set default auth.uid();

alter table public.employees
  alter column created_by set default auth.uid();

alter table public.projects
  alter column created_by set default auth.uid();

alter table public.time_logs
  alter column created_by set default auth.uid();
