import { z } from 'zod'

export const renterProfileWizardSchema = z.object({
  // Step 1: Basic Information
  full_name: z.string().min(1, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  current_address: z.string().min(1, 'Current address is required'),
  time_at_current_address: z.string().min(1, 'Time at current address is required'),

  // Step 2: Income & Employment
  employment_status: z.string().min(1, 'Employment status is required'),
  annual_income: z.number().min(1, 'Annual income is required'),
  employer_name: z.string().min(1, 'Employer name is required'),
  job_title: z.string().min(1, 'Job title is required'),
  employment_start_date: z.string().min(1, 'Employment start date is required'),

  // Step 3: Rental Preferences
  number_of_occupants: z.number().min(1, 'Number of occupants is required'),
  has_pets: z.boolean(),
  pet_details: z.string().optional(),
  is_smoker: z.boolean(),
  target_move_in_date: z.string().min(1, 'Target move-in date is required'),
  max_budget: z.number().min(1, 'Maximum budget is required'),

  // Step 4: Emergency Contact
  emergency_contact_name: z.string().min(1, 'Emergency contact name is required'),
  emergency_contact_phone: z.string().min(10, 'Valid emergency contact phone is required'),
  emergency_contact_relationship: z.string().min(1, 'Emergency contact relationship is required'),
})

export const structuredOfferSchema = z.object({
  property_id: z.string().min(1, 'Property ID is required'),
  offer_price: z.number().min(1, 'Offer price is required'),
  preferred_move_in_date: z.string().min(1, 'Preferred move-in date is required'),
  tenant_message: z.string().optional(),
})

export type RenterProfileWizardFormData = z.infer<typeof renterProfileWizardSchema>
export type StructuredOfferFormData = z.infer<typeof structuredOfferSchema>