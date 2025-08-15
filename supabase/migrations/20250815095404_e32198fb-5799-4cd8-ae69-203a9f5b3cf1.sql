-- Step 1: Create a separate secure table for highly sensitive financial data
CREATE TABLE public.profiles_sensitive (
  id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  credit_score INTEGER,
  national_insurance_number TEXT,
  bank_name TEXT,
  account_holder_name TEXT,
  sort_code TEXT,
  annual_income NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  PRIMARY KEY (id)
);

-- Enable RLS with strict policies
ALTER TABLE public.profiles_sensitive ENABLE ROW LEVEL SECURITY;

-- Only allow users to access their own sensitive data
CREATE POLICY "Users can view their own sensitive data" 
ON public.profiles_sensitive 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own sensitive data" 
ON public.profiles_sensitive 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own sensitive data" 
ON public.profiles_sensitive 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own sensitive data" 
ON public.profiles_sensitive 
FOR DELETE 
USING (auth.uid() = id);

-- Add updated_at trigger
CREATE TRIGGER update_profiles_sensitive_updated_at
BEFORE UPDATE ON public.profiles_sensitive
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Step 2: Create audit log for sensitive data access
CREATE TABLE public.profile_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  
  PRIMARY KEY (id)
);

-- Enable RLS - only admins can view audit logs
ALTER TABLE public.profile_audit_log ENABLE ROW LEVEL SECURITY;

-- Step 3: Add data classification comments for compliance
COMMENT ON TABLE public.profiles IS 'Contains personal data - PII classification level 2';
COMMENT ON TABLE public.profiles_sensitive IS 'Contains highly sensitive financial data - PII classification level 4';
COMMENT ON COLUMN public.profiles_sensitive.credit_score IS 'Sensitive financial data';
COMMENT ON COLUMN public.profiles_sensitive.national_insurance_number IS 'Highly sensitive identity data';
COMMENT ON COLUMN public.profiles_sensitive.bank_name IS 'Sensitive financial data';
COMMENT ON COLUMN public.profiles_sensitive.sort_code IS 'Sensitive financial data';
COMMENT ON COLUMN public.profiles_sensitive.annual_income IS 'Sensitive financial data';