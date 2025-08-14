-- CRITICAL FIX PACK - UP MIGRATION
-- Fixes: users RLS policies, offers COALESCE policies, offers sync trigger

-- =============================================================================
-- A) Fix users table RLS - Add self-only SELECT/UPDATE policies
-- =============================================================================

-- Users can view their own record
CREATE POLICY "Users can view their own record"
ON public.users FOR SELECT
TO authenticated
USING ( id = auth.uid() );

-- Users can update their own record
CREATE POLICY "Users can update their own record"
ON public.users FOR UPDATE
TO authenticated
USING ( id = auth.uid() );

-- =============================================================================
-- B) Fix offers table RLS - Transitional COALESCE policies
-- =============================================================================

-- Drop existing legacy policies
DROP POLICY IF EXISTS "Tenants can view their own offers" ON public.offers;
DROP POLICY IF EXISTS "Tenants can create their own offers" ON public.offers;
DROP POLICY IF EXISTS "Tenants can update their own offers" ON public.offers;
DROP POLICY IF EXISTS "Landlords can view offers on their properties" ON public.offers;
DROP POLICY IF EXISTS "Landlords can update offers on their properties" ON public.offers;

-- Create transitional policies using COALESCE for both legacy and new columns
CREATE POLICY "Tenants can view their own offers (transitional)"
ON public.offers FOR SELECT
TO authenticated
USING ( COALESCE(tenant_id, renter_id) = auth.uid() );

CREATE POLICY "Tenants can create their own offers (transitional)"
ON public.offers FOR INSERT
TO authenticated
WITH CHECK ( COALESCE(tenant_id, renter_id) = auth.uid() );

CREATE POLICY "Tenants can update their own offers (transitional)"
ON public.offers FOR UPDATE
TO authenticated
USING ( COALESCE(tenant_id, renter_id) = auth.uid() );

CREATE POLICY "Landlords can view offers on their properties (transitional)"
ON public.offers FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id = COALESCE(property_id, listing_id)
      AND p.landlord_id = auth.uid()
  )
);

CREATE POLICY "Landlords can update offers on their properties (transitional)"
ON public.offers FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id = COALESCE(property_id, listing_id)
      AND p.landlord_id = auth.uid()
  )
);

-- =============================================================================
-- C) Create offers sync trigger to keep legacy and new columns identical
-- =============================================================================

-- Trigger function to sync legacy and new columns
CREATE OR REPLACE FUNCTION public.sync_offers_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- Sync tenant_id ↔ renter_id
  IF NEW.tenant_id IS NOT NULL THEN
    NEW.renter_id := NEW.tenant_id;
  ELSIF NEW.renter_id IS NOT NULL THEN
    NEW.tenant_id := NEW.renter_id;
  END IF;

  -- Sync property_id ↔ listing_id
  IF NEW.property_id IS NOT NULL THEN
    NEW.listing_id := NEW.property_id;
  ELSIF NEW.listing_id IS NOT NULL THEN
    NEW.property_id := NEW.listing_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER sync_offers_columns_trigger
  BEFORE INSERT OR UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_offers_columns();