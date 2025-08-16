create extension if not exists "uuid-ossp";

create table if not exists public.verifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('identity_rtr','credit','employment')),
  provider text not null,
  status text not null check (status in ('not_started','in_progress','verified','failed','needs_attention')),
  provider_ref text,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, type)
);

create index if not exists verifications_user_type_idx on public.verifications(user_id, type);

create or replace function public.touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists trg_touch_verifications on public.verifications;
create trigger trg_touch_verifications before update on public.verifications
for each row execute procedure public.touch_updated_at();

alter table public.verifications enable row level security;

create policy "user read own verifications"
on public.verifications for select using (auth.uid() = user_id);

create policy "user insert own verifications"
on public.verifications for insert with check (auth.uid() = user_id);

create policy "user update own verifications"
on public.verifications for update using (auth.uid() = user_id);

create table if not exists public.webhook_events (
  id bigserial primary key,
  provider text not null,
  event_type text,
  received_at timestamptz default now(),
  payload jsonb
);