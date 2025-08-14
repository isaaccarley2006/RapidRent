-- PHASE A: Fix FK constraints and add indexes (UP)
-- Migration: Fix offers FK to use ON DELETE RESTRICT and add proper indexing

BEGIN;

-- Check if we need to add columns that might be missing
-- Add renter_id column if it doesn't exist (maps to tenant_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'renter_id' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.offers ADD COLUMN renter_id UUID;
    -- Backfill from tenant_id
    UPDATE public.offers SET renter_id = tenant_id WHERE renter_id IS NULL;
    -- Make it NOT NULL after backfill
    ALTER TABLE public.offers ALTER COLUMN renter_id SET NOT NULL;
  END IF;
END $$;

-- Add listing_id column if it doesn't exist (maps to property_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'offers' AND column_name = 'listing_id' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.offers ADD COLUMN listing_id UUID;
    -- Backfill from property_id
    UPDATE public.offers SET listing_id = property_id WHERE listing_id IS NULL;
    -- Make it NOT NULL after backfill
    ALTER TABLE public.offers ALTER COLUMN listing_id SET NOT NULL;
  END IF;
END $$;

-- Fix FK constraints to use RESTRICT instead of CASCADE
-- Drop existing FKs if they exist
ALTER TABLE public.offers DROP CONSTRAINT IF EXISTS offers_tenant_id_fkey;
ALTER TABLE public.offers DROP CONSTRAINT IF EXISTS offers_property_id_fkey;
ALTER TABLE public.offers DROP CONSTRAINT IF EXISTS offers_renter_id_fkey;
ALTER TABLE public.offers DROP CONSTRAINT IF EXISTS offers_listing_id_fkey;

-- Add new FK constraints with ON DELETE RESTRICT
ALTER TABLE public.offers
  ADD CONSTRAINT offers_renter_id_fkey
  FOREIGN KEY (renter_id) REFERENCES public.profiles(id) ON DELETE RESTRICT;

ALTER TABLE public.offers
  ADD CONSTRAINT offers_listing_id_fkey
  FOREIGN KEY (listing_id) REFERENCES public.properties(id) ON DELETE RESTRICT;

-- Ensure indexed FKs for performance (idempotent)
CREATE INDEX IF NOT EXISTS idx_offers_renter_id ON public.offers(renter_id);
CREATE INDEX IF NOT EXISTS idx_offers_listing_id ON public.offers(listing_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON public.offers(status);

COMMIT;