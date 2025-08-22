-- Create reference check applications table
CREATE TABLE public.reference_check_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'draft'::text,
  
  -- Section 1: Personal Information (already covered in profiles)
  immigration_status TEXT,
  right_to_rent_document_url TEXT,
  
  -- Section 2: Identification Documents
  photo_id_url TEXT,
  proof_of_address_url TEXT,
  visa_permit_url TEXT,
  
  -- Section 3: Employment & Income Details
  employer_contact_email TEXT,
  employer_contact_phone TEXT,
  employment_type TEXT,
  proof_of_income_urls TEXT[], -- Array for multiple payslips
  
  -- Section 4: Previous Landlord/Agent
  previous_landlord_name TEXT,
  previous_landlord_email TEXT,
  previous_landlord_phone TEXT,
  previous_property_address TEXT,
  tenancy_start_date DATE,
  tenancy_end_date DATE,
  monthly_rent_paid NUMERIC,
  
  -- Section 5: Financial History
  credit_check_consent BOOLEAN DEFAULT false,
  has_ccj_iva_bankruptcy BOOLEAN DEFAULT false,
  financial_explanation TEXT,
  
  -- Section 6: Guarantor Information
  has_guarantor BOOLEAN DEFAULT false,
  guarantor_name TEXT,
  guarantor_relationship TEXT,
  guarantor_address TEXT,
  guarantor_employer_name TEXT,
  guarantor_job_title TEXT,
  guarantor_annual_income NUMERIC,
  guarantor_id_url TEXT,
  guarantor_proof_address_url TEXT,
  
  -- Section 7: Consent & Declaration
  information_consent BOOLEAN DEFAULT false,
  contact_consent BOOLEAN DEFAULT false,
  digital_signature TEXT,
  declaration_date DATE
);

-- Enable RLS
ALTER TABLE public.reference_check_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own reference applications" 
ON public.reference_check_applications 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reference_applications_updated_at
BEFORE UPDATE ON public.reference_check_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();