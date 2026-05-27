create table public.projects (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  client_id uuid not null references public.clients(id),

  status text not null default 'draft',

  estimated_hours numeric(10,2),

  description text,

  started_at timestamptz,
  due_date date,
  completed_at timestamptz,

  created_by uuid not null references public.users(id),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);