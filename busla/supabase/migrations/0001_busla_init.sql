-- Busla event site schema.
-- All writes go through Next.js API routes using the service role key,
-- so RLS is enabled with no public policies: anon/auth clients can't read or write.

create extension if not exists pgcrypto;

create table if not exists public.registrations (
  id            uuid primary key default gen_random_uuid(),
  ticket_code   text not null unique,
  role          text not null check (role in ('student', 'parent', 'educator')),
  full_name     text not null,
  email         text not null,
  phone         text not null,
  school        text,
  grade         text,
  curriculum    text,
  interests     text[] not null default '{}',
  guardian_phone text,
  heard_from    text,
  attendees     smallint not null default 1 check (attendees between 1 and 5),
  consent       boolean not null default false,
  created_at    timestamptz not null default now()
);

create unique index if not exists registrations_email_key on public.registrations (lower(email));
create index if not exists registrations_created_at_idx on public.registrations (created_at desc);

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  topic       text not null,
  name        text not null,
  email       text not null,
  organization text,
  message     text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.mentor_messages (
  id          bigint generated always as identity primary key,
  session_id  uuid not null,
  role        text not null check (role in ('user', 'assistant')),
  content     text not null,
  created_at  timestamptz not null default now()
);

create index if not exists mentor_messages_session_idx on public.mentor_messages (session_id, created_at);

alter table public.registrations    enable row level security;
alter table public.contact_messages enable row level security;
alter table public.mentor_messages  enable row level security;

-- Handy view for the organizer team in the Supabase dashboard.
create or replace view public.registration_stats
with (security_invoker = true) as
select
  role,
  grade,
  count(*)            as people,
  sum(attendees)      as seats
from public.registrations
group by role, grade;
