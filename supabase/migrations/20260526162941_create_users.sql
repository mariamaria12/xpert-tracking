create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,

  email text not null unique,
  role text,
  status text,

  created_by uuid references public.users(id),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);