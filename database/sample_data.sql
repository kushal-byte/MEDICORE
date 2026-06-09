-- ============================================================
-- Sample seed data (run last, in Supabase SQL editor)
-- NOTE: Auth users must be created via Supabase Auth first.
--   Create these accounts in Authentication > Users, then map IDs.
--   For quick demo, the rows below use fixed UUIDs — replace the
--   user_id values with the real auth UIDs you create, OR keep
--   nullable user_id rows for non-login demo entities.
-- ============================================================

insert into roles (name, description) values
  ('admin','Full system access'),
  ('doctor','Clinical access'),
  ('receptionist','Front-desk access'),
  ('patient','Self-service access')
on conflict (name) do nothing;

insert into departments (id, name, description, head_name, location) values
  ('11111111-1111-1111-1111-111111111111','Cardiology','Heart and vascular care','Dr. Mehta','Block A, Floor 2'),
  ('22222222-2222-2222-2222-222222222222','Neurology','Brain and nervous system','Dr. Rao','Block B, Floor 3'),
  ('33333333-3333-3333-3333-333333333333','Orthopedics','Bones and joints','Dr. Khan','Block A, Floor 1'),
  ('44444444-4444-4444-4444-444444444444','Pediatrics','Child healthcare','Dr. Iyer','Block C, Floor 1'),
  ('55555555-5555-5555-5555-555555555555','General Medicine','Primary care','Dr. Singh','Block A, Floor 0')
on conflict (id) do nothing;

insert into doctors (id, full_name, email, phone, specialization, department_id, qualification, experience_yrs, consultation_fee, available) values
  ('a1111111-1111-1111-1111-111111111111','Dr. Anil Mehta','anil.mehta@medicore.io','+91 90000 11111','Cardiologist','11111111-1111-1111-1111-111111111111','MD, DM Cardiology',14,800,true),
  ('a2222222-2222-2222-2222-222222222222','Dr. Sunita Rao','sunita.rao@medicore.io','+91 90000 22222','Neurologist','22222222-2222-2222-2222-222222222222','MD, DM Neurology',10,900,true),
  ('a3333333-3333-3333-3333-333333333333','Dr. Imran Khan','imran.khan@medicore.io','+91 90000 33333','Orthopedic Surgeon','33333333-3333-3333-3333-333333333333','MS Orthopedics',8,700,true),
  ('a4444444-4444-4444-4444-444444444444','Dr. Lakshmi Iyer','lakshmi.iyer@medicore.io','+91 90000 44444','Pediatrician','44444444-4444-4444-4444-444444444444','MD Pediatrics',12,600,true),
  ('a5555555-5555-5555-5555-555555555555','Dr. Ramesh Singh','ramesh.singh@medicore.io','+91 90000 55555','General Physician','55555555-5555-5555-5555-555555555555','MBBS, MD',6,400,true)
on conflict (id) do nothing;

insert into patients (id, full_name, email, phone, gender, dob, blood_group, address, emergency_contact) values
  ('b1111111-1111-1111-1111-111111111111','Ravi Kumar','ravi.k@example.com','+91 80000 11111','male','1990-05-12','O+','12 MG Road, Pune','+91 80000 99911'),
  ('b2222222-2222-2222-2222-222222222222','Priya Sharma','priya.s@example.com','+91 80000 22222','female','1995-09-23','A+','45 Park St, Mumbai','+91 80000 99922'),
  ('b3333333-3333-3333-3333-333333333333','Arjun Nair','arjun.n@example.com','+91 80000 33333','male','1982-01-08','B+','9 Residency Rd, Bangalore','+91 80000 99933'),
  ('b4444444-4444-4444-4444-444444444444','Meena Joshi','meena.j@example.com','+91 80000 44444','female','2001-12-30','AB+','78 Lake View, Hyderabad','+91 80000 99944')
on conflict (id) do nothing;

insert into appointments (patient_id, doctor_id, department_id, appt_date, appt_time, reason, status) values
  ('b1111111-1111-1111-1111-111111111111','a1111111-1111-1111-1111-111111111111','11111111-1111-1111-1111-111111111111', current_date, '10:00','Chest pain follow-up','confirmed'),
  ('b2222222-2222-2222-2222-222222222222','a2222222-2222-2222-2222-222222222222','22222222-2222-2222-2222-222222222222', current_date, '11:30','Migraine consult','scheduled'),
  ('b3333333-3333-3333-3333-333333333333','a3333333-3333-3333-3333-333333333333','33333333-3333-3333-3333-333333333333', current_date + 1, '09:00','Knee pain','scheduled'),
  ('b4444444-4444-4444-4444-444444444444','a5555555-5555-5555-5555-555555555555','55555555-5555-5555-5555-555555555555', current_date - 2, '15:00','Fever','completed')
on conflict do nothing;

insert into prescriptions (patient_id, doctor_id, diagnosis, medicines, advice) values
  ('b4444444-4444-4444-4444-444444444444','a5555555-5555-5555-5555-555555555555','Viral fever',
   '[{"name":"Paracetamol 500mg","dosage":"1 tab","frequency":"3x daily","duration":"5 days"},{"name":"ORS","dosage":"1 sachet","frequency":"as needed","duration":"3 days"}]',
   'Rest, hydrate, return if fever persists beyond 3 days.');

insert into payments (patient_id, appointment_id, amount, status, method, paid_at)
select 'b4444444-4444-4444-4444-444444444444', a.id, 400, 'paid', 'card', now()
from appointments a where a.patient_id='b4444444-4444-4444-4444-444444444444' limit 1;
