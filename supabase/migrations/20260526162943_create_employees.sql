create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),

  user_id uuid references public.users(id),

  first_name text not null,
  last_name text not null,

  email text,
  phone text,

  role text,
  hourly_rate numeric(10,2),

  is_active boolean not null default true,
  notes text,

  created_by uuid not null references public.users(id),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);