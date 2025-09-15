-- Create test accounts directly
-- First, let's insert the auth users (this simulates what Supabase auth would do)
-- Note: In production, you'd use supabase.auth.signUp(), but for testing we'll create profiles directly

-- Insert test landlord profile
INSERT INTO public.profiles (
  id, 
  email, 
  full_name, 
  user_type, 
  profile_complete, 
  phone,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  'landlord@test.com',
  'Test Landlord',
  'landlord',
  true,
  '+44 7700 900123',
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  user_type = EXCLUDED.user_type,
  profile_complete = EXCLUDED.profile_complete,
  phone = EXCLUDED.phone,
  updated_at = now();

-- Insert test tenant profile  
INSERT INTO public.profiles (
  id,
  email,
  full_name, 
  user_type,
  profile_complete,
  phone,
  created_at,
  updated_at
) VALUES (
  '22222222-2222-2222-2222-222222222222'::uuid,
  'tenant@test.com',
  'Test Tenant', 
  'tenant',
  true,
  '+44 7700 900456',
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  user_type = EXCLUDED.user_type,
  profile_complete = EXCLUDED.profile_complete,
  phone = EXCLUDED.phone,
  updated_at = now();