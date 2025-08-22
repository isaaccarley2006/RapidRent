export interface ReferenceCheckApplication {
  id?: string
  user_id?: string
  created_at?: string
  updated_at?: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  
  // Section 1: Personal Information
  immigration_status?: string
  right_to_rent_document_url?: string
  
  // Section 2: Identification Documents
  photo_id_url?: string
  proof_of_address_url?: string
  visa_permit_url?: string
  
  // Section 3: Employment & Income Details
  employer_contact_email?: string
  employer_contact_phone?: string
  employment_type?: 'permanent' | 'fixed-term' | 'probation' | 'self-employed'
  proof_of_income_urls?: string[]
  
  // Section 4: Previous Landlord/Agent
  previous_landlord_name?: string
  previous_landlord_email?: string
  previous_landlord_phone?: string
  previous_property_address?: string
  tenancy_start_date?: string
  tenancy_end_date?: string
  monthly_rent_paid?: number
  
  // Section 5: Financial History
  credit_check_consent: boolean
  has_ccj_iva_bankruptcy: boolean
  financial_explanation?: string
  
  // Section 6: Guarantor Information
  has_guarantor: boolean
  guarantor_name?: string
  guarantor_relationship?: string
  guarantor_address?: string
  guarantor_employer_name?: string
  guarantor_job_title?: string
  guarantor_annual_income?: number
  guarantor_id_url?: string
  guarantor_proof_address_url?: string
  
  // Section 7: Consent & Declaration
  information_consent: boolean
  contact_consent: boolean
  digital_signature?: string
  declaration_date?: string
}

export type ReferenceCheckStep = 
  | 'identification' 
  | 'employment' 
  | 'landlord' 
  | 'financial' 
  | 'guarantor' 
  | 'consent'