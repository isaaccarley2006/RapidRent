-- Fix security warning: Set search_path for sync function
CREATE OR REPLACE FUNCTION public.sync_offers_columns()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;