-- Create function to insert agent profile (fix parameter order)
CREATE OR REPLACE FUNCTION public.create_agent_profile(
  p_user_id UUID,
  p_agency_name TEXT,
  p_legal_company_name TEXT,
  p_primary_contact_name TEXT,
  p_primary_contact_email TEXT,
  p_branch_address TEXT,
  p_company_registration_number TEXT DEFAULT NULL,
  p_is_sole_trader BOOLEAN DEFAULT FALSE,
  p_terms_accepted BOOLEAN DEFAULT TRUE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, agent_app
AS $$
DECLARE
  result JSON;
BEGIN
  INSERT INTO agent_app.agent_profiles (
    user_id,
    agency_name,
    legal_company_name,
    company_registration_number,
    is_sole_trader,
    primary_contact_name,
    primary_contact_email,
    branch_address,
    terms_accepted,
    terms_accepted_at,
    profile_phase
  ) VALUES (
    p_user_id,
    p_agency_name,
    p_legal_company_name,
    p_company_registration_number,
    p_is_sole_trader,
    p_primary_contact_name,
    p_primary_contact_email,
    p_branch_address,
    p_terms_accepted,
    now(),
    'quick_signup'
  );
  
  -- Return success result
  SELECT json_build_object('success', true) INTO result;
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Return error result
    SELECT json_build_object('success', false, 'error', SQLERRM) INTO result;
    RETURN result;
END;
$$;