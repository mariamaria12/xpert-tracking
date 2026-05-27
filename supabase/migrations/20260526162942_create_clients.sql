create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),

  company_name text not null,
  contact_person text,
  email text,
  phone text,
  billing_address text,
  delivery_address text,
  industry text,
  notes text,

  status text not null default 'active',

  created_by uuid not null references public.users(id),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);