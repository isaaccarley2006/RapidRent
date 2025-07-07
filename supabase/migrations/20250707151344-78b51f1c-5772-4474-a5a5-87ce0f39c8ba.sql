-- Enable Row Level Security on properties table
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view listed properties (for the marketplace)
CREATE POLICY "Anyone can view listed properties" 
ON public.properties 
FOR SELECT 
USING (status = 'listed');

-- Allow landlords to insert their own properties
CREATE POLICY "Landlords can create their own properties" 
ON public.properties 
FOR INSERT 
WITH CHECK (auth.uid() = landlord_id);

-- Allow landlords to update their own properties
CREATE POLICY "Landlords can update their own properties" 
ON public.properties 
FOR UPDATE 
USING (auth.uid() = landlord_id);

-- Allow landlords to delete their own properties
CREATE POLICY "Landlords can delete their own properties" 
ON public.properties 
FOR DELETE 
USING (auth.uid() = landlord_id);