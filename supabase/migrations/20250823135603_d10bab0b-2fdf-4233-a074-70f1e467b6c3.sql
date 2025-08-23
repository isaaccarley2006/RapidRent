CREATE POLICY "Landlords can view profiles of tenants who made offers on their properties" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM offers o
    JOIN properties prop ON o.property_id = prop.id
    WHERE o.tenant_id = profiles.id 
    AND prop.landlord_id = auth.uid()
  )
);