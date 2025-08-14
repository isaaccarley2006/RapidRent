-- Drop the transitional policies (using correct policy names)
DROP POLICY IF EXISTS "Tenants can view their own offers" ON public.offers;
DROP POLICY IF EXISTS "Tenants can create their own offers" ON public.offers;
DROP POLICY IF EXISTS "Tenants can update their own offers" ON public.offers;
DROP POLICY IF EXISTS "Landlords can view offers on their properties" ON public.offers;
DROP POLICY IF EXISTS "Landlords can update offers on their properties" ON public.offers;

-- Restore legacy policies (using properties table, not listings)
CREATE POLICY "Tenants can view their own offers"
ON public.offers FOR SELECT
TO authenticated
USING ( tenant_id = auth.uid() );

CREATE POLICY "Tenants can create their own offers"
ON public.offers FOR INSERT
TO authenticated
WITH CHECK ( tenant_id = auth.uid() );

CREATE POLICY "Tenants can update their own offers"
ON public.offers FOR UPDATE
TO authenticated
USING ( tenant_id = auth.uid() );

CREATE POLICY "Landlords can view offers on their properties"
ON public.offers FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id = property_id
      AND p.landlord_id = auth.uid()
  )
);

CREATE POLICY "Landlords can update offers on their properties"
ON public.offers FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.properties p
    WHERE p.id = property_id
      AND p.landlord_id = auth.uid()
  )
);