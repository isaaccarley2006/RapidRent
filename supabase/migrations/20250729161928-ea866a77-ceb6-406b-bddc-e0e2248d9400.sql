-- Add foreign key relationship between offers and profiles tables
ALTER TABLE public.offers 
ADD CONSTRAINT offers_tenant_id_fkey 
FOREIGN KEY (tenant_id) REFERENCES public.profiles(id) ON DELETE CASCADE;