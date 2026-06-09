-- ============================================================
-- MediCore Hospital Management System — PostgreSQL Schema
-- Target: Supabase (PostgreSQL 15+)
-- Run order: schema.sql -> rls_policies.sql -> sample_data.sql
-- ============================================================

-- Roles enum
do $$ begin
  create type user_role as enum ('admin','doctor','receptionist','patient');
exception when duplicate_object then null; end $$;

do $$ begin
  create type appt_status as enum ('scheduled','confirmed','completed','cancelled','no_show');
exception when duplicate_object then null; end $$;

do $$ begin
  create type pay_status as enum ('pending','paid','refunded','failed');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------
-- roles (lookup)
-- ------------------------------------------------------------
create table if not exists roles (
  id           serial primary key,
  name         user_role unique not null,
  description  text,
  created_at   timestamptz default now()
);

-- ------------------------------------------------------------
-- users (profile mirror of auth.users)
-- id = auth.users.id
-- ------------------------------------------------------------
create table if not exists users (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text not null,
  email        text unique not null,
  phone        text,
  role         user_role not null default 'patient',
  avatar_url   text,
  is_active    boolean default true,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ------------------------------------------------------------
-- departments
-- ------------------------------------------------------------
create table if not exists departments (
  id           uuid primary key default gen_random_uuid(),
  name         text unique not null,
  description  text,
  head_name    text,
  location     text,
  created_at   timestamptz default now()
);

-- ------------------------------------------------------------
-- doctors
-- ------------------------------------------------------------
create table if not exists doctors (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid unique references users(id) on delete cascade,
  full_name      text not null,
  email          text,
  phone          text,
  specialization text not null,
  department_id  uuid references departments(id) on delete set null,
  qualification  text,
  experience_yrs int default 0 check (experience_yrs >= 0),
  consultation_fee numeric(10,2) default 0 check (consultation_fee >= 0),
  available      boolean default true,
  created_at     timestamptz default now()
);

-- ------------------------------------------------------------
-- patients
-- ------------------------------------------------------------
create table if not exists patients (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid unique references users(id) on delete set null,
  full_name     text not null,
  email         text,
  phone         text,
  gender        text check (gender in ('male','female','other')),
  dob           date,
  blood_group   text,
  address       text,
  emergency_contact text,
  created_at    timestamptz default now()
);

-- ------------------------------------------------------------
-- appointments
-- ------------------------------------------------------------
create table if not exists appointments (
  id            uuid primary key default gen_random_uuid(),
  patient_id    uuid not null references patients(id) on delete cascade,
  doctor_id     uuid not null references doctors(id) on delete cascade,
  department_id uuid references departments(id) on delete set null,
  appt_date     date not null,
  appt_time     time not null,
  reason        text,
  status        appt_status not null default 'scheduled',
  notes         text,
  created_by    uuid references users(id) on delete set null,
  created_at    timestamptz default now(),
  unique (doctor_id, appt_date, appt_time)
);

-- ------------------------------------------------------------
-- prescriptions
-- ------------------------------------------------------------
create table if not exists prescriptions (
  id             uuid primary key default gen_random_uuid(),
  appointment_id uuid references appointments(id) on delete set null,
  patient_id     uuid not null references patients(id) on delete cascade,
  doctor_id      uuid not null references doctors(id) on delete cascade,
  diagnosis      text,
  medicines      jsonb not null default '[]',   -- [{name,dosage,frequency,duration}]
  advice         text,
  issued_at      timestamptz default now()
);

-- ------------------------------------------------------------
-- medical_records
-- ------------------------------------------------------------
create table if not exists medical_records (
  id          uuid primary key default gen_random_uuid(),
  patient_id  uuid not null references patients(id) on delete cascade,
  doctor_id   uuid references doctors(id) on delete set null,
  record_type text,                       -- lab, vitals, note, imaging
  title       text not null,
  details     text,
  attachments jsonb default '[]',
  recorded_at timestamptz default now()
);

-- ------------------------------------------------------------
-- payments
-- ------------------------------------------------------------
create table if not exists payments (
  id             uuid primary key default gen_random_uuid(),
  patient_id     uuid not null references patients(id) on delete cascade,
  appointment_id uuid references appointments(id) on delete set null,
  amount         numeric(10,2) not null check (amount >= 0),
  status         pay_status not null default 'pending',
  method         text,
  paid_at        timestamptz,
  created_at     timestamptz default now()
);

-- ------------------------------------------------------------
-- notifications
-- ------------------------------------------------------------
create table if not exists notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  title       text not null,
  body        text,
  is_read     boolean default false,
  created_at  timestamptz default now()
);

-- ------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------
create index if not exists idx_appt_patient   on appointments(patient_id);
create index if not exists idx_appt_doctor    on appointments(doctor_id);
create index if not exists idx_appt_date      on appointments(appt_date);
create index if not exists idx_appt_status    on appointments(status);
create index if not exists idx_pres_patient   on prescriptions(patient_id);
create index if not exists idx_pres_doctor    on prescriptions(doctor_id);
create index if not exists idx_rec_patient    on medical_records(patient_id);
create index if not exists idx_pay_patient    on payments(patient_id);
create index if not exists idx_pay_status     on payments(status);
create index if not exists idx_notif_user     on notifications(user_id, is_read);
create index if not exists idx_doctors_dept   on doctors(department_id);
create index if not exists idx_users_role     on users(role);

-- ------------------------------------------------------------
-- Trigger: auto-create users row on signup
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'patient')
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- helper: current user role
create or replace function public.my_role()
returns user_role language sql stable security definer set search_path = public as $$
  select role from public.users where id = auth.uid();
$$;
