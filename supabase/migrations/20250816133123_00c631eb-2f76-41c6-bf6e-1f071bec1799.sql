-- Enable RLS on webhook_events table and add policies
alter table public.webhook_events enable row level security;

-- Only allow service role to access webhook events (not regular users)
create policy "service_role_webhook_access" on public.webhook_events
for all using (current_setting('role') = 'service_role');

-- Fix function search path security
create or replace function public.touch_updated_at() returns trigger 
language plpgsql
security definer
set search_path = public
as $$
begin 
  new.updated_at = now(); 
  return new; 
end;
$$;