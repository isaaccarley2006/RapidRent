-- Add agent role support to users table
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'agent';

-- Create agent-tenant relationships table for access control
CREATE TABLE public.agent_tenant_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  granted_by UUID NOT NULL, -- The tenant who granted access
  revoked_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(agent_id, tenant_id)
);

-- Enable RLS on agent_tenant_access
ALTER TABLE public.agent_tenant_access ENABLE ROW LEVEL SECURITY;

-- Create policies for agent_tenant_access
CREATE POLICY "Agents can view their access grants" 
ON public.agent_tenant_access 
FOR SELECT 
USING (auth.uid() = agent_id);

CREATE POLICY "Tenants can view access they granted" 
ON public.agent_tenant_access 
FOR SELECT 
USING (auth.uid() = tenant_id OR auth.uid() = granted_by);

CREATE POLICY "Tenants can grant access to agents" 
ON public.agent_tenant_access 
FOR INSERT 
WITH CHECK (auth.uid() = granted_by AND auth.uid() = tenant_id);

CREATE POLICY "Tenants can revoke access they granted" 
ON public.agent_tenant_access 
FOR UPDATE 
USING (auth.uid() = granted_by AND auth.uid() = tenant_id);

-- Update RLS policies on reference_check_submissions to allow agent access
CREATE POLICY "Agents can view submissions of tenants who granted access" 
ON public.reference_check_submissions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.agent_tenant_access ata
    WHERE ata.agent_id = auth.uid() 
    AND ata.tenant_id = reference_check_submissions.user_id
    AND ata.revoked_at IS NULL
  )
);

-- Update RLS policies on profiles to allow agent access to tenant profiles
CREATE POLICY "Agents can view profiles of tenants who granted access" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.agent_tenant_access ata
    WHERE ata.agent_id = auth.uid() 
    AND ata.tenant_id = profiles.id
    AND ata.revoked_at IS NULL
  )
);

-- Create trigger for updated_at on agent_tenant_access
CREATE TRIGGER update_agent_tenant_access_updated_at
BEFORE UPDATE ON public.agent_tenant_access
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();