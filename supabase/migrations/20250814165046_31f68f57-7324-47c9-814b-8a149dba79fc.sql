-- PHASE B: Fix RLS policies to work during transition (UP)
-- Migration: Update RLS policies to handle both old and new column names

-- Ensure RLS is enabled
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop old offers policies by name if they exist (adjust names if different)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename='offers' AND policyname='Tenants can view their own offers') THEN
    DROP POLICY "Tenants can view their own offers" ON public.offers;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename='offers' AND policyname='Tenants can create their own offers') THEN
    DROP POLICY "Tenants can create their own offers" ON public.offers;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename='offers' AND policyname='Tenants can update their own offers') THEN
    DROP POLICY "Tenants can update their own offers" ON public.offers;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename='offers' AND policyname='Landlords can view offers on their properties') THEN
    DROP POLICY "Landlords can view offers on their properties" ON public.offers;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename='offers' AND policyname='Landlords can update offers on their properties') THEN
    DROP POLICY "Landlords can update offers on their properties" ON public.offers;
  END IF;
END $$;

-- Transitional, column-compatible policies (support legacy + new)
CREATE POLICY "Tenants can view their own offers"
ON public.offers FOR SELECT
TO authenticated
USING ( COALESCE(renter_id, tenant_id) = auth.uid() );

CREATE POLICY "Tenants can create their own offers"
ON public.offers FOR INSERT
TO authenticated
WITH CHECK ( COALESCE(renter_id, tenant_id) = auth.uid() );

CREATE POLICY "Tenants can update their own offers"
ON public.offers FOR UPDATE
TO authenticated
USING ( COALESCE(renter_id, tenant_id) = auth.uid() );

-- Landlord can see offers on their own properties
CREATE POLICY "Landlords can view offers on their properties"
ON public.offers FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id = COALESCE(listing_id, property_id)
      AND p.landlord_id = auth.uid()
  )
);

-- Landlord can update offers on their own properties
CREATE POLICY "Landlords can update offers on their properties"
ON public.offers FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id = COALESCE(listing_id, property_id)
      AND p.landlord_id = auth.uid()
  )
);

-- Helpful indexes for RLS quals (idempotent)
CREATE INDEX IF NOT EXISTS idx_offers_renter_id ON public.offers(renter_id);
CREATE INDEX IF NOT EXISTS idx_offers_tenant_id ON public.offers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_offers_listing_id ON public.offers(listing_id);
CREATE INDEX IF NOT EXISTS idx_offers_property_id ON public.offers(property_id);