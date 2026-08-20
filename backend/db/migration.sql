-- Quan Ly Chung Sinh - Postgres schema (Vercel Postgres / Neon)
-- Run once against your database (Vercel Dashboard -> Storage -> your DB -> Query,
-- or `psql "$POSTGRES_URL" -f db/migration.sql`).

create extension if not exists "pgcrypto";

-- ============ SEMINARIANS ============
create table if not exists seminarians (
  id text primary key default gen_random_uuid()::text,
  code text not null,
  full_name text not null,
  saint_name text,
  birth_date text,
  birth_place text,
  phone text,
  email text,
  gmail text,
  avatar_url text,
  academic_year text,
  batch text,
  admission_year text,
  graduation_year text,
  seminary_admission_year text,
  seminary_graduation_year text,
  diocese text,
  parish text,
  home_parish text,
  admission_parish text,
  stage text not null,
  status text not null,
  baptism_date text,
  baptism_parish text,
  confirmation_date text,
  confirmation_bishop text,
  prior_education jsonb default '{}'::jsonb,
  prior_education_list jsonb default '[]'::jsonb,
  associations jsonb default '[]'::jsonb,
  siblings_count int,
  birth_order text,
  family_notes text,
  family_info jsonb default '{}'::jsonb,
  timeline jsonb default '[]'::jsonb,
  grades jsonb default '{}'::jsonb,
  annual_records jsonb default '[]'::jsonb,
  advisor_note text,
  has_advisor_review boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============ COURSES ============
create table if not exists courses (
  id text primary key default gen_random_uuid()::text,
  code text,
  name text not null,
  instructor text,
  level text,
  current_week int default 0,
  total_weeks int default 0,
  credits int default 0,
  semester text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============ PASTORAL ASSIGNMENTS ============
create table if not exists pastoral_assignments (
  id text primary key default gen_random_uuid()::text,
  location_name text not null,
  pastor text,
  count int default 0,
  category text,
  type text check (type in ('church', 'center')),
  address text,
  seminarians jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============ CALENDAR EVENTS ============
create table if not exists calendar_events (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  date text not null,
  time text,
  type text check (type in ('retreat','meeting','exam','liturgy','holiday')),
  location text,
  description text,
  color text,
  created_at timestamptz default now()
);

-- ============ ACTIVITIES (activity log / feed) ============
create table if not exists activities (
  id text primary key default gen_random_uuid()::text,
  type text check (type in ('review','announcement','admission','event')),
  title text not null,
  description text,
  time text,
  author text,
  icon text,
  created_at timestamptz default now()
);

-- ============ APP SETTINGS (single row) ============
create table if not exists app_settings (
  id int primary key default 1,
  seminary_name text default 'Đại Chủng viện Thánh Giuse',
  rector_name text default 'Cha Giuse Nguyễn Văn A (Linh mục Giám đốc)',
  diocese text default 'Tổng Giáo phận Hà Nội',
  address text default '40 Nhà Chung, Hàng Trống, Hoàn Kiếm, Hà Nội',
  current_year text default '2024 - 2025',
  updated_at timestamptz default now(),
  constraint app_settings_singleton check (id = 1)
);
insert into app_settings (id) values (1) on conflict (id) do nothing;

-- Note: no Row Level Security here on purpose. This DB is only ever reached
-- through the server-side API routes in /api (using the secret POSTGRES_URL
-- from Vercel env vars) — the browser never talks to Postgres directly, so
-- there's no anon-key exposure like there would be with a client-side SDK.
