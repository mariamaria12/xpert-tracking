-- Speed up timesheet page: single SQL join instead of PostgREST nested embeds.
create or replace function public.get_timesheet_list()
returns table (
  id uuid,
  employee_id uuid,
  project_id uuid,
  started_at timestamptz,
  ended_at timestamptz,
  duration_minutes integer,
  activity text,
  notes text,
  employee_first_name text,
  employee_last_name text,
  project_name text
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    tl.id,
    tl.employee_id,
    tl.project_id,
    tl.started_at,
    tl.ended_at,
    tl.duration_minutes,
    tl.activity,
    tl.notes,
    e.first_name as employee_first_name,
    e.last_name as employee_last_name,
    p.name as project_name
  from public.time_logs tl
  inner join public.employees e on e.id = tl.employee_id
  inner join public.projects p on p.id = tl.project_id
  order by tl.started_at desc;
$$;

grant execute on function public.get_timesheet_list() to anon, authenticated, service_role;
