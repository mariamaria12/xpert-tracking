create table public.time_logs (
  id uuid primary key default gen_random_uuid(),

  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.employees(id),

  activity text,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_minutes integer,

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);