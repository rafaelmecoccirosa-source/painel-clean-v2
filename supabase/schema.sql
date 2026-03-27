-- PainelClean — Schema MVP
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =========================================
-- PROFILES
-- =========================================
create type user_role as enum ('cliente', 'tecnico', 'admin');

create table profiles (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade not null unique,
  role        user_role not null default 'cliente',
  full_name   text not null,
  phone       text,
  avatar_url  text,
  city        text,
  state       char(2),
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (user_id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'cliente')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- =========================================
-- SERVICE REQUESTS
-- =========================================
create type service_status as enum (
  'pending', 'quoted', 'confirmed', 'in_progress', 'completed', 'cancelled'
);

create table service_requests (
  id              uuid primary key default uuid_generate_v4(),
  client_id       uuid references profiles(id) on delete cascade not null,
  tecnico_id      uuid references profiles(id) on delete set null,
  status          service_status not null default 'pending',
  panel_count     int not null check (panel_count > 0),
  address         text not null,
  city            text not null,
  state           char(2) not null,
  scheduled_date  timestamptz,
  completed_date  timestamptz,
  price           numeric(10, 2),
  notes           text,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);

-- =========================================
-- QUOTES
-- =========================================
create table quotes (
  id                 uuid primary key default uuid_generate_v4(),
  service_request_id uuid references service_requests(id) on delete cascade not null,
  tecnico_id         uuid references profiles(id) on delete cascade not null,
  price              numeric(10, 2) not null,
  message            text,
  accepted           boolean default false,
  created_at         timestamptz default now() not null
);

-- =========================================
-- REVIEWS
-- =========================================
create table reviews (
  id                 uuid primary key default uuid_generate_v4(),
  service_request_id uuid references service_requests(id) on delete cascade not null unique,
  client_id          uuid references profiles(id) on delete cascade not null,
  tecnico_id         uuid references profiles(id) on delete cascade not null,
  rating             int not null check (rating between 1 and 5),
  comment            text,
  created_at         timestamptz default now() not null
);

-- =========================================
-- ROW LEVEL SECURITY
-- =========================================
alter table profiles enable row level security;
alter table service_requests enable row level security;
alter table quotes enable row level security;
alter table reviews enable row level security;

-- Profiles: users see/edit only their own
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = user_id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = user_id);

-- Service requests: clients see own; technicians see all pending/confirmed
create policy "Clients see own requests"
  on service_requests for select
  using (client_id = (select id from profiles where user_id = auth.uid()));

create policy "Clients insert own requests"
  on service_requests for insert
  with check (client_id = (select id from profiles where user_id = auth.uid()));

create policy "Technicians see available requests"
  on service_requests for select
  using (
    status in ('pending', 'quoted') and
    exists (select 1 from profiles where user_id = auth.uid() and role = 'tecnico')
  );
