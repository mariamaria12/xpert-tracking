-- Speed up people page: week-range scans and per-employee latest log.
create index if not exists idx_time_logs_started_at
  on public.time_logs (started_at);

create index if not exists idx_time_logs_employee_started_at
  on public.time_logs (employee_id, started_at desc);

create or replace function public.get_employee_last_logs()
returns table (
  employee_id uuid,
  started_at timestamptz
)
language sql
stable
security invoker
set search_path = public
as $$
  select distinct on (employee_id)
    employee_id,
    started_at
  from public.time_logs
  order by employee_id, started_at desc;
$$;

grant execute on function public.get_employee_last_logs() to anon, authenticated, service_role;
