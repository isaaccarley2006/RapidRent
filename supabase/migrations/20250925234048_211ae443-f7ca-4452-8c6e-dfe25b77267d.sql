-- Create agent_tenant_applications table for tracking tenant applications
CREATE TABLE IF NOT EXISTS agent_app.agent_tenant_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_profile_id UUID NOT NULL REFERENCES agent_app.agent_profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES agent_app.properties(id) ON DELETE CASCADE,
  tenant_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_status TEXT DEFAULT 'submitted' CHECK (application_status IN ('submitted', 'under_review', 'reference_check_requested', 'reference_check_completed', 'approved', 'rejected', 'withdrawn')),
  monthly_rent_offered NUMERIC(10,2) NOT NULL,
  deposit_offered NUMERIC(10,2),
  preferred_move_in_date DATE,
  lease_duration_requested INTEGER,
  application_message TEXT,
  agent_notes TEXT,
  rejection_reason TEXT,
  reference_check_status TEXT DEFAULT 'not_started' CHECK (reference_check_status IN ('not_started', 'requested', 'in_progress', 'completed', 'failed')),
  reference_check_results JSONB,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  decision_made_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create agent_commissions table for tracking commission payments
CREATE TABLE IF NOT EXISTS agent_app.agent_commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_profile_id UUID NOT NULL REFERENCES agent_app.agent_profiles(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES agent_app.properties(id) ON DELETE CASCADE,
  tenant_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commission_type TEXT NOT NULL CHECK (commission_type IN ('letting_fee', 'management_fee', 'renewal_fee')),
  gross_amount NUMERIC(10,2) NOT NULL,
  platform_fee_percentage NUMERIC(5,2) DEFAULT 15.0,
  platform_fee_amount NUMERIC(10,2) NOT NULL,
  net_amount NUMERIC(10,2) NOT NULL,
  vat_amount NUMERIC(10,2),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed')),
  payment_date TIMESTAMP WITH TIME ZONE,
  payment_reference TEXT,
  invoice_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create agent_documents table for storing agent compliance documents
CREATE TABLE IF NOT EXISTS agent_app.agent_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_profile_id UUID NOT NULL REFERENCES agent_app.agent_profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('professional_indemnity', 'public_liability', 'company_registration', 'vat_certificate', 'fca_registration', 'client_money_protection')),
  document_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expiry_date DATE,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_tenant_applications' AND schemaname = 'agent_app') THEN
    ALTER TABLE agent_app.agent_tenant_applications ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_commissions' AND schemaname = 'agent_app') THEN
    ALTER TABLE agent_app.agent_commissions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_documents' AND schemaname = 'agent_app') THEN
    ALTER TABLE agent_app.agent_documents ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS Policies if they don't exist
DO $$
BEGIN
  -- Policies for agent_tenant_applications
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agents can manage tenant applications' AND tablename = 'agent_tenant_applications') THEN
    CREATE POLICY "Agents can manage tenant applications"
    ON agent_app.agent_tenant_applications FOR ALL
    USING (EXISTS (
      SELECT 1 FROM agent_app.agent_profiles ap 
      WHERE ap.id = agent_tenant_applications.agent_profile_id 
      AND ap.user_id = auth.uid()
    ));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Tenants can view their applications' AND tablename = 'agent_tenant_applications') THEN
    CREATE POLICY "Tenants can view their applications"
    ON agent_app.agent_tenant_applications FOR SELECT
    USING (auth.uid() = tenant_user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Tenants can create applications' AND tablename = 'agent_tenant_applications') THEN
    CREATE POLICY "Tenants can create applications"
    ON agent_app.agent_tenant_applications FOR INSERT
    WITH CHECK (auth.uid() = tenant_user_id);
  END IF;

  -- Policies for agent_commissions
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agents can view commissions' AND tablename = 'agent_commissions') THEN
    CREATE POLICY "Agents can view commissions"
    ON agent_app.agent_commissions FOR SELECT
    USING (EXISTS (
      SELECT 1 FROM agent_app.agent_profiles ap 
      WHERE ap.id = agent_commissions.agent_profile_id 
      AND ap.user_id = auth.uid()
    ));
  END IF;

  -- Policies for agent_documents
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Agents can manage documents' AND tablename = 'agent_documents') THEN
    CREATE POLICY "Agents can manage documents"
    ON agent_app.agent_documents FOR ALL
    USING (EXISTS (
      SELECT 1 FROM agent_app.agent_profiles ap 
      WHERE ap.id = agent_documents.agent_profile_id 
      AND ap.user_id = auth.uid()
    ));
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_agent_tenant_applications_agent_id ON agent_app.agent_tenant_applications(agent_profile_id);
CREATE INDEX IF NOT EXISTS idx_agent_tenant_applications_tenant_id ON agent_app.agent_tenant_applications(tenant_user_id);
CREATE INDEX IF NOT EXISTS idx_agent_tenant_applications_status ON agent_app.agent_tenant_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_agent_commissions_agent_id ON agent_app.agent_commissions(agent_profile_id);
CREATE INDEX IF NOT EXISTS idx_agent_documents_agent_id ON agent_app.agent_documents(agent_profile_id);

-- Create or replace update function
CREATE OR REPLACE FUNCTION agent_app.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist and recreate
DROP TRIGGER IF EXISTS update_agent_tenant_applications_updated_at ON agent_app.agent_tenant_applications;
DROP TRIGGER IF EXISTS update_agent_commissions_updated_at ON agent_app.agent_commissions;
DROP TRIGGER IF EXISTS update_agent_documents_updated_at ON agent_app.agent_documents;

-- Create triggers
CREATE TRIGGER update_agent_tenant_applications_updated_at
BEFORE UPDATE ON agent_app.agent_tenant_applications
FOR EACH ROW EXECUTE FUNCTION agent_app.update_updated_at_column();

CREATE TRIGGER update_agent_commissions_updated_at
BEFORE UPDATE ON agent_app.agent_commissions
FOR EACH ROW EXECUTE FUNCTION agent_app.update_updated_at_column();

CREATE TRIGGER update_agent_documents_updated_at
BEFORE UPDATE ON agent_app.agent_documents
FOR EACH ROW EXECUTE FUNCTION agent_app.update_updated_at_column();