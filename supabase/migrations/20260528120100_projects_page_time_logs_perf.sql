-- Speed up projects page: aggregate hours and worker counts in the database.
create index if not exists idx_time_logs_project_id
  on public.time_logs (project_id);

create or replace function public.get_project_time_stats()
returns table (
  project_id uuid,
  total_minutes bigint,
  worker_count bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    project_id,
    coalesce(sum(duration_minutes), 0)::bigint as total_minutes,
    count(distinct employee_id)::bigint as worker_count
  from public.time_logs
  group by project_id;
$$;

grant execute on function public.get_project_time_stats() to anon, authenticated, service_role;
