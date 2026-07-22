-- Rafiki Chatbot · Fase 1A · Base multiusuario por número de WhatsApp
-- Fecha: 2026-07-22

create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'administrator' check (role in ('superadmin','administrator')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.whatsapp_users (
  id uuid primary key default gen_random_uuid(),
  phone_e164 text not null unique check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  display_name text,
  status text not null default 'active' check (status in ('active','paused','blocked')),
  plan text not null default 'free' check (plan in ('free','personal','plus')),
  timezone text not null default 'America/Bogota',
  notes text,
  last_interaction_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  whatsapp_user_id uuid not null references public.whatsapp_users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 500),
  details text,
  scheduled_at timestamptz not null,
  timezone text not null default 'America/Bogota',
  recurrence text not null default 'none' check (recurrence in ('none','daily','weekly','monthly','custom')),
  recurrence_rule jsonb,
  status text not null default 'pending' check (status in ('pending','processing','sent','completed','cancelled','failed')),
  source text not null default 'manual' check (source in ('manual','whatsapp','system')),
  last_sent_at timestamptz,
  next_run_at timestamptz,
  send_attempts integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  whatsapp_user_id uuid references public.whatsapp_users(id) on delete set null,
  whatsapp_message_id text unique,
  direction text not null check (direction in ('inbound','outbound')),
  message_type text not null default 'text',
  body text,
  status text not null default 'received',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  whatsapp_user_id uuid references public.whatsapp_users(id) on delete set null,
  message_id uuid references public.messages(id) on delete set null,
  provider text not null default 'openai',
  model text,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  estimated_cost_usd numeric(12,6) not null default 0,
  action_detected text,
  created_at timestamptz not null default now()
);

create table if not exists public.system_errors (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  error_code text,
  message text not null,
  details jsonb not null default '{}'::jsonb,
  whatsapp_user_id uuid references public.whatsapp_users(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_type text not null default 'admin' check (actor_type in ('admin','whatsapp_user','system')),
  actor_id text,
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists reminders_status_scheduled_idx on public.reminders(status, scheduled_at);
create index if not exists reminders_user_idx on public.reminders(whatsapp_user_id);
create index if not exists messages_user_created_idx on public.messages(whatsapp_user_id, created_at desc);
create index if not exists usage_user_created_idx on public.ai_usage(whatsapp_user_id, created_at desc);
create index if not exists errors_created_idx on public.system_errors(created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_admin_profiles_updated_at on public.admin_profiles;
create trigger set_admin_profiles_updated_at before update on public.admin_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_whatsapp_users_updated_at on public.whatsapp_users;
create trigger set_whatsapp_users_updated_at before update on public.whatsapp_users
for each row execute function public.set_updated_at();

drop trigger if exists set_reminders_updated_at on public.reminders;
create trigger set_reminders_updated_at before update on public.reminders
for each row execute function public.set_updated_at();

-- El panel no ofrece registro público. Todo usuario creado manualmente en Auth
-- queda como administrador hasta que se introduzcan roles más avanzados.
create or replace function public.handle_new_admin_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.admin_profiles (id, email, role, active)
  values (new.id, new.email, 'administrator', true)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_rafiki_chatbot on auth.users;
create trigger on_auth_user_created_rafiki_chatbot
after insert on auth.users
for each row execute function public.handle_new_admin_user();

-- Si el usuario de Auth fue creado antes de ejecutar esta migración, lo registra.
insert into public.admin_profiles (id, email, role, active)
select id, email, 'administrator', true from auth.users
on conflict (id) do nothing;

create or replace function public.is_rafiki_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles p
    where p.id = auth.uid() and p.active = true
  );
$$;

grant execute on function public.is_rafiki_admin() to authenticated;

alter table public.admin_profiles enable row level security;
alter table public.whatsapp_users enable row level security;
alter table public.reminders enable row level security;
alter table public.messages enable row level security;
alter table public.ai_usage enable row level security;
alter table public.system_errors enable row level security;
alter table public.audit_logs enable row level security;

-- Políticas del panel administrativo. Las integraciones servidor-a-servidor futuras
-- usarán la service role desde Edge Functions, nunca desde el navegador.
do $$
declare
  t text;
begin
  foreach t in array array['whatsapp_users','reminders','messages','ai_usage','system_errors','audit_logs']
  loop
    execute format('drop policy if exists "rafiki_admin_all" on public.%I', t);
    execute format('create policy "rafiki_admin_all" on public.%I for all to authenticated using (public.is_rafiki_admin()) with check (public.is_rafiki_admin())', t);
  end loop;
end $$;

drop policy if exists "admin_profile_self_read" on public.admin_profiles;
create policy "admin_profile_self_read" on public.admin_profiles
for select to authenticated using (id = auth.uid());

-- Privilegios Data API para usuarios autenticados; RLS mantiene el control real.
grant select, insert, update, delete on public.whatsapp_users to authenticated;
grant select, insert, update, delete on public.reminders to authenticated;
grant select, insert, update, delete on public.messages to authenticated;
grant select, insert, update, delete on public.ai_usage to authenticated;
grant select, insert, update, delete on public.system_errors to authenticated;
grant select, insert, update, delete on public.audit_logs to authenticated;
grant select on public.admin_profiles to authenticated;
