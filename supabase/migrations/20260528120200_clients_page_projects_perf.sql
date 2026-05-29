-- Speed up clients page: project counts per client in the database.
create index if not exists idx_projects_client_id
  on public.projects (client_id);

create or replace function public.get_client_project_counts()
returns table (
  client_id uuid,
  project_count bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    client_id,
    count(*)::bigint as project_count
  from public.projects
  group by client_id;
$$;

grant execute on function public.get_client_project_counts() to anon, authenticated, service_role;
