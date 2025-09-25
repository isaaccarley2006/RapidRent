-- Fix role inconsistency: Update users table to match profiles table
UPDATE users 
SET role = 'agent', 
    updated_at = now()
WHERE id IN (
    SELECT id FROM profiles WHERE email = 'info@rapidrent.uk' AND user_type = 'agent'
);

-- Also check and fix any other inconsistencies
UPDATE users 
SET role = p.user_type,
    updated_at = now()
FROM profiles p 
WHERE users.id = p.id 
AND users.role != p.user_type 
AND p.user_type IN ('agent', 'tenant', 'landlord');