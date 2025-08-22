-- Create a comprehensive reference check applications table
CREATE TABLE IF NOT EXISTS public.reference_check_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending'::text,
  
  -- Personal Information
  full_name TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  current_address TEXT,
  previous_address TEXT,
  time_at_current_address TEXT,
  
  -- Employment Information
  employment_status TEXT,
  employer_name TEXT,
  employer_address TEXT,
  job_title TEXT,
  employment_start_date DATE,
  annual_income NUMERIC,
  
  -- Financial Information
  credit_score INTEGER,
  bank_name TEXT,
  account_holder_name TEXT,
  sort_code TEXT,
  
  -- Personal Details
  has_pets BOOLEAN DEFAULT false,
  pet_details TEXT,
  is_smoker BOOLEAN DEFAULT false,
  additional_notes TEXT,
  
  -- Emergency Contact
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relationship TEXT,
  
  -- Reference Check specific
  verification_scheduled_for TIMESTAMP WITH TIME ZONE,
  verification_completed_at TIMESTAMP WITH TIME ZONE,
  notification_sent_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.reference_check_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own reference check submissions" 
ON public.reference_check_submissions 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add verification status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS comprehensive_verification_status TEXT DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS comprehensive_verification_completed_at TIMESTAMP WITH TIME ZONE;

-- Create index for scheduled verifications
CREATE INDEX IF NOT EXISTS idx_reference_check_scheduled 
ON public.reference_check_submissions(verification_scheduled_for)
WHERE status = 'pending' AND verification_scheduled_for IS NOT NULL;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reference_check_submissions_updated_at
BEFORE UPDATE ON public.reference_check_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();