-- First create the function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add comprehensive verification and profile fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS national_insurance_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS previous_address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS time_at_current_address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employer_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employer_address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employment_start_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS credit_score INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_holder_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sort_code TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT;

-- Add verification status fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS identity_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employment_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS income_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS credit_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS references_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bank_verified BOOLEAN DEFAULT false;

-- Add verification dates for tracking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS identity_verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employment_verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS income_verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS credit_verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS references_verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bank_verified_at TIMESTAMP WITH TIME ZONE;

-- Add profile completion percentage tracking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER DEFAULT 0;

-- Create a table for storing reference contacts
CREATE TABLE IF NOT EXISTS public.tenant_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reference_type TEXT NOT NULL CHECK (reference_type IN ('previous_landlord', 'employer', 'character', 'bank')),
  contact_name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  company_name TEXT,
  relationship TEXT,
  reference_period TEXT,
  notes TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'failed')),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on tenant_references
ALTER TABLE public.tenant_references ENABLE ROW LEVEL SECURITY;

-- Create policies for tenant_references
CREATE POLICY "Users can manage their own references" 
ON public.tenant_references 
FOR ALL 
USING (auth.uid() = tenant_id)
WITH CHECK (auth.uid() = tenant_id);

-- Create trigger for tenant_references updated_at
CREATE TRIGGER update_tenant_references_updated_at
BEFORE UPDATE ON public.tenant_references
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a table for document uploads (for verification purposes)
CREATE TABLE IF NOT EXISTS public.tenant_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('passport', 'driving_license', 'bank_statement', 'payslip', 'employment_contract', 'credit_report', 'previous_tenancy_agreement', 'utility_bill')),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on tenant_documents
ALTER TABLE public.tenant_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for tenant_documents
CREATE POLICY "Users can manage their own documents" 
ON public.tenant_documents 
FOR ALL 
USING (auth.uid() = tenant_id)
WITH CHECK (auth.uid() = tenant_id);

-- Create trigger for tenant_documents updated_at
CREATE TRIGGER update_tenant_documents_updated_at
BEFORE UPDATE ON public.tenant_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();