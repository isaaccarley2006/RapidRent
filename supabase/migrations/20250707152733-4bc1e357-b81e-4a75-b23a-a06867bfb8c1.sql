-- Add tenant profile fields that landlords care about
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employment_status TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS annual_income NUMERIC;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_rental_situation TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS move_in_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_pets BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pet_details TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_smoker BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tenant_references TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS additional_notes TEXT;

-- Add RLS policies for offers table
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Tenants can create offers for themselves
CREATE POLICY "Tenants can create their own offers" 
ON public.offers 
FOR INSERT 
WITH CHECK (auth.uid() = tenant_id);

-- Tenants can view their own offers
CREATE POLICY "Tenants can view their own offers" 
ON public.offers 
FOR SELECT 
USING (auth.uid() = tenant_id);

-- Tenants can update their own offers
CREATE POLICY "Tenants can update their own offers" 
ON public.offers 
FOR UPDATE 
USING (auth.uid() = tenant_id);

-- Landlords can view offers on their properties
CREATE POLICY "Landlords can view offers on their properties" 
ON public.offers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = offers.property_id 
    AND properties.landlord_id = auth.uid()
  )
);

-- Landlords can update offers on their properties (to accept/reject)
CREATE POLICY "Landlords can update offers on their properties" 
ON public.offers 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = offers.property_id 
    AND properties.landlord_id = auth.uid()
  )
);

-- Update the offers table to include move-in preferences
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS preferred_move_in_date DATE;
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS tenant_message TEXT;