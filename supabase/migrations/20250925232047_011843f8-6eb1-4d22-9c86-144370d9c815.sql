-- Create agent_app schema for complete separation from tenant data
CREATE SCHEMA IF NOT EXISTS agent_app;

-- Create enum for profile phases
CREATE TYPE agent_app.profile_phase AS ENUM ('quick_signup', 'profile_complete', 'live');

-- Create enum for CRM preferences
CREATE TYPE agent_app.crm_type AS ENUM ('rightmove', 'zoopla', 'onthemarket', 'custom', 'none');

-- Quick Sign-Up Table - Phase 1 (minimum to create account)
CREATE TABLE agent_app.agent_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_name TEXT NOT NULL,
  legal_company_name TEXT NOT NULL,
  company_registration_number TEXT,
  is_sole_trader BOOLEAN NOT NULL DEFAULT false,
  primary_contact_name TEXT NOT NULL,
  primary_contact_email TEXT NOT NULL,
  branch_address TEXT NOT NULL,
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  profile_phase agent_app.profile_phase NOT NULL DEFAULT 'quick_signup',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Profile Completion Table - Phase 2 (before going live)
CREATE TABLE agent_app.agent_profile_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_profile_id UUID NOT NULL REFERENCES agent_app.agent_profiles(id) ON DELETE CASCADE,
  vat_number TEXT,
  aml_registration_body TEXT,
  cmp_scheme_membership TEXT,
  arla_naea_membership TEXT,
  agency_logo_url TEXT,
  coverage_areas TEXT[], -- array of postcodes/boroughs
  crm_integration_preferences JSONB,
  profile_completed_at TIMESTAMP WITH TIME ZONE,
  can_list_properties BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(agent_profile_id)
);

-- Agent Negotiators/Team Members Table
CREATE TABLE agent_app.agent_negotiators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_profile_id UUID NOT NULL REFERENCES agent_app.agent_profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'negotiator',
  permissions JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  joined_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Agent Branches Table
CREATE TABLE agent_app.agent_branches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_profile_id UUID NOT NULL REFERENCES agent_app.agent_profiles(id) ON DELETE CASCADE,
  branch_name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  coverage_postcodes TEXT[],
  is_main_office BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Agent Properties Table (moved from public schema)
CREATE TABLE agent_app.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_profile_id UUID NOT NULL REFERENCES agent_app.agent_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  price NUMERIC,
  bedrooms INTEGER,
  bathrooms INTEGER,
  property_type TEXT DEFAULT 'apartment',
  furnished BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft',
  images TEXT[],
  branch_id UUID REFERENCES agent_app.agent_branches(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all agent tables
ALTER TABLE agent_app.agent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_app.agent_profile_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_app.agent_negotiators ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_app.agent_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_app.properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agent_profiles
CREATE POLICY "Agents can view their own profile" 
ON agent_app.agent_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Agents can create their own profile" 
ON agent_app.agent_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Agents can update their own profile" 
ON agent_app.agent_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for agent_profile_details
CREATE POLICY "Agents can view their own profile details" 
ON agent_app.agent_profile_details 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM agent_app.agent_profiles 
  WHERE id = agent_profile_id AND user_id = auth.uid()
));

CREATE POLICY "Agents can create their own profile details" 
ON agent_app.agent_profile_details 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM agent_app.agent_profiles 
  WHERE id = agent_profile_id AND user_id = auth.uid()
));

CREATE POLICY "Agents can update their own profile details" 
ON agent_app.agent_profile_details 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM agent_app.agent_profiles 
  WHERE id = agent_profile_id AND user_id = auth.uid()
));

-- RLS Policies for agent_negotiators
CREATE POLICY "Agents can manage their team members" 
ON agent_app.agent_negotiators 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM agent_app.agent_profiles 
  WHERE id = agent_profile_id AND user_id = auth.uid()
));

-- RLS Policies for agent_branches
CREATE POLICY "Agents can manage their branches" 
ON agent_app.agent_branches 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM agent_app.agent_profiles 
  WHERE id = agent_profile_id AND user_id = auth.uid()
));

-- RLS Policies for agent properties
CREATE POLICY "Agents can manage their properties" 
ON agent_app.properties 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM agent_app.agent_profiles 
  WHERE id = agent_profile_id AND user_id = auth.uid()
));

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_agent_profiles_updated_at
  BEFORE UPDATE ON agent_app.agent_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_profile_details_updated_at
  BEFORE UPDATE ON agent_app.agent_profile_details
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_negotiators_updated_at
  BEFORE UPDATE ON agent_app.agent_negotiators
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_branches_updated_at
  BEFORE UPDATE ON agent_app.agent_branches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_properties_updated_at
  BEFORE UPDATE ON agent_app.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();