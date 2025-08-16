-- Add critical indexes for scalability
-- These indexes will dramatically improve query performance at scale

-- Index for landlord property lookups
CREATE INDEX IF NOT EXISTS idx_properties_landlord_id_status 
ON properties(landlord_id, status);

-- Index for offers filtering by property
CREATE INDEX IF NOT EXISTS idx_offers_property_id_created_at 
ON offers(property_id, created_at DESC);

-- Index for offers filtering by tenant
CREATE INDEX IF NOT EXISTS idx_offers_tenant_id_status 
ON offers(tenant_id, status);

-- Index for profile lookups by user ID
CREATE INDEX IF NOT EXISTS idx_profiles_id_user_type 
ON profiles(id, user_type);

-- Composite index for real-time offer filtering
CREATE INDEX IF NOT EXISTS idx_offers_status_created_at 
ON offers(status, created_at DESC);

-- Index for tenant references
CREATE INDEX IF NOT EXISTS idx_tenant_references_tenant_id 
ON tenant_references(tenant_id);

-- Index for tenant documents
CREATE INDEX IF NOT EXISTS idx_tenant_documents_tenant_id 
ON tenant_documents(tenant_id);

-- Index for properties with location filtering
CREATE INDEX IF NOT EXISTS idx_properties_status_price 
ON properties(status, price) WHERE status = 'listed';