alter table public.time_logs
drop constraint if exists time_logs_user_id_fkey;

alter table public.time_logs
rename column user_id to employee_id;

alter table public.time_logs
add constraint time_logs_employee_id_fkey
foreign key (employee_id)
references public.employees(id);

alter table public.time_logs
add column created_by uuid references public.users(id);