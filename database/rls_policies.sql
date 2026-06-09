-- ============================================================
-- Row Level Security policies
-- Run AFTER schema.sql
-- ============================================================

alter table users           enable row level security;
alter table roles           enable row level security;
alter table departments     enable row level security;
alter table doctors         enable row level security;
alter table patients        enable row level security;
alter table appointments    enable row level security;
alter table prescriptions   enable row level security;
alter table medical_records enable row level security;
alter table payments        enable row level security;
alter table notifications   enable row level security;

-- ---------- USERS ----------
create policy "users read own or staff reads all" on users
  for select using ( id = auth.uid() or my_role() in ('admin','doctor','receptionist') );
create policy "users update own" on users
  for update using ( id = auth.uid() );
create policy "admin manage users" on users
  for all using ( my_role() = 'admin' ) with check ( my_role() = 'admin' );

-- ---------- ROLES (read all, admin write) ----------
create policy "roles readable" on roles for select using ( true );
create policy "roles admin write" on roles for all
  using ( my_role() = 'admin' ) with check ( my_role() = 'admin' );

-- ---------- DEPARTMENTS ----------
create policy "dept readable" on departments for select using ( auth.role() = 'authenticated' );
create policy "dept admin write" on departments for all
  using ( my_role() = 'admin' ) with check ( my_role() = 'admin' );

-- ---------- DOCTORS ----------
create policy "doctors readable" on doctors for select using ( auth.role() = 'authenticated' );
create policy "doctors self update" on doctors for update using ( user_id = auth.uid() );
create policy "doctors admin write" on doctors for all
  using ( my_role() = 'admin' ) with check ( my_role() = 'admin' );

-- ---------- PATIENTS ----------
create policy "patients self read" on patients for select using (
  user_id = auth.uid() or my_role() in ('admin','doctor','receptionist') );
create policy "patients self update" on patients for update using ( user_id = auth.uid() );
create policy "patients staff write" on patients for all
  using ( my_role() in ('admin','receptionist') )
  with check ( my_role() in ('admin','receptionist') );

-- ---------- APPOINTMENTS ----------
create policy "appt read scope" on appointments for select using (
  my_role() in ('admin','receptionist')
  or doctor_id  in (select id from doctors  where user_id = auth.uid())
  or patient_id in (select id from patients where user_id = auth.uid())
);
create policy "appt create" on appointments for insert with check (
  my_role() in ('admin','receptionist')
  or patient_id in (select id from patients where user_id = auth.uid())
);
create policy "appt update scope" on appointments for update using (
  my_role() in ('admin','receptionist')
  or doctor_id in (select id from doctors where user_id = auth.uid())
);
create policy "appt admin delete" on appointments for delete
  using ( my_role() in ('admin','receptionist') );

-- ---------- PRESCRIPTIONS ----------
create policy "pres read scope" on prescriptions for select using (
  my_role() = 'admin'
  or doctor_id  in (select id from doctors  where user_id = auth.uid())
  or patient_id in (select id from patients where user_id = auth.uid())
);
create policy "pres doctor write" on prescriptions for all using (
  my_role() = 'admin'
  or doctor_id in (select id from doctors where user_id = auth.uid())
) with check (
  my_role() = 'admin'
  or doctor_id in (select id from doctors where user_id = auth.uid())
);

-- ---------- MEDICAL RECORDS ----------
create policy "rec read scope" on medical_records for select using (
  my_role() in ('admin','doctor')
  or patient_id in (select id from patients where user_id = auth.uid())
);
create policy "rec doctor write" on medical_records for all using (
  my_role() in ('admin','doctor')
) with check ( my_role() in ('admin','doctor') );

-- ---------- PAYMENTS ----------
create policy "pay read scope" on payments for select using (
  my_role() in ('admin','receptionist')
  or patient_id in (select id from patients where user_id = auth.uid())
);
create policy "pay staff write" on payments for all
  using ( my_role() in ('admin','receptionist') )
  with check ( my_role() in ('admin','receptionist') );

-- ---------- NOTIFICATIONS ----------
create policy "notif read own" on notifications for select using ( user_id = auth.uid() );
create policy "notif update own" on notifications for update using ( user_id = auth.uid() );
create policy "notif insert" on notifications for insert with check (
  user_id = auth.uid() or my_role() in ('admin','doctor','receptionist') );
