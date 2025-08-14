export interface RenterProfileWizardData {
  // Step 1: Basic Information
  full_name?: string
  phone?: string
  date_of_birth?: string
  current_address?: string
  time_at_current_address?: string

  // Step 2: Income & Employment
  employment_status?: string
  annual_income?: number
  employer_name?: string
  job_title?: string
  employment_start_date?: string

  // Step 3: Rental Preferences
  number_of_occupants?: number
  has_pets?: boolean
  pet_details?: string
  is_smoker?: boolean
  target_move_in_date?: string
  max_budget?: number

  // Step 4: Emergency Contact
  emergency_contact_name?: string
  emergency_contact_phone?: string
  emergency_contact_relationship?: string
}

export interface StructuredOfferData {
  property_id: string
  offer_price: number
  preferred_move_in_date: string
  tenant_message: string
}