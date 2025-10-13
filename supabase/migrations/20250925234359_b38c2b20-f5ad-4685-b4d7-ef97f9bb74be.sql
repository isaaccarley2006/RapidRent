-- Fix user_type constraint to allow 'agent' and update user profile
DO $$
BEGIN
    -- Drop the existing constraint
    ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;
    
    -- Add new constraint that allows 'agent', 'tenant', and 'landlord'
    ALTER TABLE profiles ADD CONSTRAINT profiles_user_type_check 
    CHECK (user_type IN ('tenant', 'landlord', 'agent'));
    
    -- Now update the user profile to be an agent
    UPDATE profiles 
    SET user_type = 'agent', 
        full_name = COALESCE(full_name, 'Isaac Carley'),
        updated_at = now()
    WHERE email = 'info@rapidrent.uk';
    
    -- Create agent profile
    INSERT INTO agent_app.agent_profiles (
        user_id,
        agency_name,
        legal_company_name,
        primary_contact_name,
        primary_contact_email,
        branch_address,
        is_sole_trader,
        terms_accepted,
        terms_accepted_at,
        profile_phase
    ) 
    SELECT 
        id,
        'RapidRent Agency',
        'RapidRent Ltd',
        'Isaac Carley',
        'info@rapidrent.uk',
        '123 Business Street, London, UK',
        false,
        true,
        now(),
        'quick_signup'
    FROM profiles 
    WHERE email = 'info@rapidrent.uk'
    ON CONFLICT (user_id) DO UPDATE SET
        updated_at = now();
        
    RAISE NOTICE 'User profile updated and agent profile created successfully';
END $$;