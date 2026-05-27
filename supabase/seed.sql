-- Assumes you already have at least one row in public.users

insert into public.clients (
  company_name,
  contact_person,
  email,
  phone,
  billing_address,
  delivery_address,
  industry,
  notes,
  status,
  created_by
)
values
('Metal Construct SRL', 'Andrei Pop', 'office@metalconstruct.ro', '+40740111001', 'Cluj-Napoca, Str. Fabricii 12', 'Cluj-Napoca, Industrial Park', 'Construction', 'Frequent steel structure client', 'active', (select id from public.users limit 1)),
('Nord Build Group', 'Ioana Stan', 'contact@nordbuild.ro', '+40740111002', 'Oradea, Bd. Decebal 8', 'Oradea, Site A', 'Commercial', 'Shopping center projects', 'active', (select id from public.users limit 1)),
('Steel House Design', 'Mihai Rusu', 'hello@steelhouse.ro', '+40740111003', 'Baia Mare, Str. Minerilor 4', 'Baia Mare Workshop Site', 'Residential', 'Custom stairs and railings', 'active', (select id from public.users limit 1));

insert into public.employees (
  user_id,
  first_name,
  last_name,
  email,
  phone,
  role,
  hourly_rate,
  is_active,
  notes,
  created_by
)
values
(null, 'Ion', 'Pop', 'ion.pop@trackingxpert.local', '+40740111222', 'Welder', 35.00, true, 'Senior welder', (select id from public.users limit 1)),
(null, 'Mihai', 'Ionescu', 'mihai.ionescu@trackingxpert.local', '+40740111333', 'CNC Operator', 32.50, true, 'Laser cutting operator', (select id from public.users limit 1)),
(null, 'Andrei', 'Stan', 'andrei.stan@trackingxpert.local', '+40740111444', 'Assembler', 28.00, true, 'Assembly and fitting', (select id from public.users limit 1)),
(null, 'Cristian', 'Dumitru', 'cristian.dumitru@trackingxpert.local', '+40740111555', 'Painter', 26.00, true, 'Metal finishing', (select id from public.users limit 1)),
(null, 'George', 'Marin', 'george.marin@trackingxpert.local', '+40740111666', 'Installer', 38.00, true, 'On-site installation', (select id from public.users limit 1));

insert into public.projects (
  name,
  client_id,
  status,
  estimated_hours,
  description,
  started_at,
  due_date,
  created_by
)
values
('Warehouse steel frame', (select id from public.clients where company_name = 'Metal Construct SRL'), 'active', 180, 'Fabrication of main warehouse frame.', now() - interval '10 days', current_date + interval '20 days', (select id from public.users limit 1)),
('Mall staircase fabrication', (select id from public.clients where company_name = 'Nord Build Group'), 'active', 95, 'Interior staircase and support elements.', now() - interval '6 days', current_date + interval '14 days', (select id from public.users limit 1)),
('Residential railings batch', (select id from public.clients where company_name = 'Steel House Design'), 'completed', 45, 'Balcony and stair railings.', now() - interval '25 days', current_date - interval '3 days', (select id from public.users limit 1));

insert into public.time_logs (
  project_id,
  employee_id,
  activity,
  started_at,
  ended_at,
  duration_minutes,
  notes,
  created_by
)
values
((select id from public.projects where name = 'Warehouse steel frame'), (select id from public.employees where first_name = 'Ion'), 'Welding', now() - interval '6 days', now() - interval '6 days' + interval '4 hours', 240, 'Main beam welding', (select id from public.users limit 1)),
((select id from public.projects where name = 'Warehouse steel frame'), (select id from public.employees where first_name = 'Mihai'), 'CNC cutting', now() - interval '5 days', now() - interval '5 days' + interval '5 hours', 300, 'Cut base plates', (select id from public.users limit 1)),
((select id from public.projects where name = 'Mall staircase fabrication'), (select id from public.employees where first_name = 'Andrei'), 'Assembly', now() - interval '4 days', now() - interval '4 days' + interval '6 hours', 360, 'Staircase dry fit', (select id from public.users limit 1)),
((select id from public.projects where name = 'Mall staircase fabrication'), (select id from public.employees where first_name = 'Cristian'), 'Painting', now() - interval '3 days', now() - interval '3 days' + interval '3 hours', 180, 'Primer coat', (select id from public.users limit 1)),
((select id from public.projects where name = 'Residential railings batch'), (select id from public.employees where first_name = 'George'), 'Installation', now() - interval '2 days', now() - interval '2 days' + interval '7 hours', 420, 'Site installation', (select id from public.users limit 1)),
((select id from public.projects where name = 'Warehouse steel frame'), (select id from public.employees where first_name = 'Ion'), 'Welding', now() - interval '1 day', now() - interval '1 day' + interval '4 hours', 240, 'Column welding', (select id from public.users limit 1));