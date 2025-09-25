export interface AgentProfile {
  id: string
  user_id: string
  agency_name: string
  legal_company_name: string
  company_registration_number?: string
  is_sole_trader: boolean
  primary_contact_name: string
  primary_contact_email: string
  branch_address: string
  terms_accepted: boolean
  terms_accepted_at?: string
  profile_phase: 'quick_signup' | 'profile_complete' | 'live'
  created_at: string
  updated_at: string
}

export interface AgentProfileDetails {
  id: string
  agent_profile_id: string
  vat_number?: string
  aml_registration_body?: string
  cmp_scheme_membership?: string
  arla_naea_membership?: string
  agency_logo_url?: string
  coverage_areas?: string[]
  crm_integration_preferences?: any
  profile_completed_at?: string
  can_list_properties: boolean
  created_at: string
  updated_at: string
}

export interface AgentNegotiator {
  id: string
  agent_profile_id: string
  user_id?: string
  email: string
  full_name: string
  role: string
  permissions?: any
  is_active: boolean
  invited_at: string
  joined_at?: string
  created_at: string
  updated_at: string
}

export interface AgentBranch {
  id: string
  agent_profile_id: string
  branch_name: string
  address: string
  phone?: string
  email?: string
  coverage_postcodes?: string[]
  is_main_office: boolean
  created_at: string
  updated_at: string
}

export interface AgentProperty {
  id: string
  agent_profile_id: string
  title: string
  description?: string
  location?: string
  price?: number
  bedrooms?: number
  bathrooms?: number
  property_type: string
  furnished: boolean
  status: string
  images?: string[]
  branch_id?: string
  created_by?: string
  created_at: string
  updated_at: string
}