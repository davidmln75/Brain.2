-- Brain.2 Database Schema
-- Run this in your Supabase SQL editor

-- User stats (XP + hearts)
create table if not exists user_stats (
  id uuid primary key default gen_random_uuid(),
  xp integer not null default 0,
  hearts integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Insert default stats row
insert into user_stats (xp, hearts) values (0, 0);

-- Tasks (WORK + MORE categories)
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  level integer not null check (level in (1, 2, 3)),
  recurrence text not null check (recurrence in ('daily', 'weekly', 'oneshot')),
  label text not null check (label in ('red', 'blue', 'yellow')),
  category text not null check (category in ('work', 'more')),
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Care tasks (water x4 + exercise, resets daily)
create table if not exists care_tasks (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('water', 'yoga', 'running', 'indoor')),
  completed boolean not null default false,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

-- Note folders
create table if not exists note_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Notes
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  content text not null default '',
  folder_id uuid references note_folders(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Shop items (customizable)
create table if not exists shop_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cost integer not null check (cost > 0),
  currency text not null check (currency in ('xp', 'hearts')),
  created_at timestamptz not null default now()
);

-- Default shop items
insert into shop_items (name, cost, currency) values
  ('Soirée alcoolisée', 150, 'hearts'),
  ('Cheat meal', 100, 'hearts'),
  ('Demi journée à rien foutre', 300, 'xp');

-- Enable real-time for all tables
alter publication supabase_realtime add table user_stats;
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table care_tasks;
alter publication supabase_realtime add table notes;
alter publication supabase_realtime add table note_folders;
alter publication supabase_realtime add table shop_items;
