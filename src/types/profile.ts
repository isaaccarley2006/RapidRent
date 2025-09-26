export interface TenantProfile {
  // Basic Info
  full_name: string | null
  email: string | null
  phone: string | null
  date_of_birth: string | null
  national_insurance_number: string | null
  user_type: string | null
  
  // Agent-specific fields
  agency_name?: string | null
  vat_number?: string | null
  aml_registration?: string | null
  professional_membership?: string | null
  coverage_areas?: string | null
  negotiator_emails?: string | null
  crm_preferences?: string | null
  stripe_connected?: boolean
  
  // Address Info
  current_address: string | null
  previous_address: string | null
  time_at_current_address: string | null
  
  // Employment Info
  employment_status: string | null
  employer_name: string | null
  employer_address: string | null
  job_title: string | null
  employment_start_date: string | null
  annual_income: number | null
  
  // Financial Info
  credit_score: number | null
  bank_name: string | null
  account_holder_name: string | null
  sort_code: string | null
  
  // Personal Info
  has_pets: boolean | null
  pet_details: string | null
  is_smoker: boolean | null
  tenant_references: string | null
  additional_notes: string | null
  
  // Emergency Contact
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  emergency_contact_relationship: string | null
  
  // Verification Status
  identity_verified: boolean
  employment_verified: boolean
  income_verified: boolean
  credit_verified: boolean
  references_verified: boolean
  bank_verified: boolean
  profile_completion_percentage: number
}

export interface TenantReference {
  id: string
  reference_type: string
  contact_name: string
  contact_email: string | null
  contact_phone: string | null
  company_name: string | null
  relationship: string | null
  reference_period: string | null
  notes: string | null
  verification_status: string
  verified_at: string | null
}