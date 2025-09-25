export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      agent_tenant_access: {
        Row: {
          agent_id: string
          created_at: string
          granted_at: string
          granted_by: string
          id: string
          notes: string | null
          revoked_at: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          granted_at?: string
          granted_by: string
          id?: string
          notes?: string | null
          revoked_at?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          granted_at?: string
          granted_by?: string
          id?: string
          notes?: string | null
          revoked_at?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          message: string | null
          offer_price: number
          preferred_move_in_date: string | null
          property_id: string
          renter_id: string
          status: string
          tenant_id: string
          tenant_message: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          message?: string | null
          offer_price: number
          preferred_move_in_date?: string | null
          property_id: string
          renter_id: string
          status?: string
          tenant_id: string
          tenant_message?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          message?: string | null
          offer_price?: number
          preferred_move_in_date?: string | null
          property_id?: string
          renter_id?: string
          status?: string
          tenant_id?: string
          tenant_message?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_renter_id_fkey"
            columns: ["renter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_audit_log: {
        Row: {
          action: string
          id: string
          ip_address: unknown | null
          table_name: string
          timestamp: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          id?: string
          ip_address?: unknown | null
          table_name: string
          timestamp?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          id?: string
          ip_address?: unknown | null
          table_name?: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_holder_name: string | null
          additional_notes: string | null
          annual_income: number | null
          bank_name: string | null
          bank_verified: boolean | null
          bank_verified_at: string | null
          comprehensive_verification_completed_at: string | null
          comprehensive_verification_status: string | null
          created_at: string
          credit_score: number | null
          credit_verified: boolean | null
          credit_verified_at: string | null
          current_address: string | null
          current_rental_situation: string | null
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          employer_address: string | null
          employer_name: string | null
          employment_start_date: string | null
          employment_status: string | null
          employment_verified: boolean | null
          employment_verified_at: string | null
          full_name: string | null
          has_pets: boolean | null
          id: string
          identity_verified: boolean | null
          identity_verified_at: string | null
          income_verified: boolean | null
          income_verified_at: string | null
          is_smoker: boolean | null
          job_title: string | null
          move_in_date: string | null
          national_insurance_number: string | null
          nationality: string | null
          pet_details: string | null
          phone: string | null
          previous_address: string | null
          profile_complete: boolean
          profile_completion_percentage: number | null
          references_verified: boolean | null
          references_verified_at: string | null
          sort_code: string | null
          tenant_references: string | null
          time_at_current_address: string | null
          updated_at: string
          user_type: string | null
          visa_type: string | null
        }
        Insert: {
          account_holder_name?: string | null
          additional_notes?: string | null
          annual_income?: number | null
          bank_name?: string | null
          bank_verified?: boolean | null
          bank_verified_at?: string | null
          comprehensive_verification_completed_at?: string | null
          comprehensive_verification_status?: string | null
          created_at?: string
          credit_score?: number | null
          credit_verified?: boolean | null
          credit_verified_at?: string | null
          current_address?: string | null
          current_rental_situation?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employer_address?: string | null
          employer_name?: string | null
          employment_start_date?: string | null
          employment_status?: string | null
          employment_verified?: boolean | null
          employment_verified_at?: string | null
          full_name?: string | null
          has_pets?: boolean | null
          id: string
          identity_verified?: boolean | null
          identity_verified_at?: string | null
          income_verified?: boolean | null
          income_verified_at?: string | null
          is_smoker?: boolean | null
          job_title?: string | null
          move_in_date?: string | null
          national_insurance_number?: string | null
          nationality?: string | null
          pet_details?: string | null
          phone?: string | null
          previous_address?: string | null
          profile_complete?: boolean
          profile_completion_percentage?: number | null
          references_verified?: boolean | null
          references_verified_at?: string | null
          sort_code?: string | null
          tenant_references?: string | null
          time_at_current_address?: string | null
          updated_at?: string
          user_type?: string | null
          visa_type?: string | null
        }
        Update: {
          account_holder_name?: string | null
          additional_notes?: string | null
          annual_income?: number | null
          bank_name?: string | null
          bank_verified?: boolean | null
          bank_verified_at?: string | null
          comprehensive_verification_completed_at?: string | null
          comprehensive_verification_status?: string | null
          created_at?: string
          credit_score?: number | null
          credit_verified?: boolean | null
          credit_verified_at?: string | null
          current_address?: string | null
          current_rental_situation?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employer_address?: string | null
          employer_name?: string | null
          employment_start_date?: string | null
          employment_status?: string | null
          employment_verified?: boolean | null
          employment_verified_at?: string | null
          full_name?: string | null
          has_pets?: boolean | null
          id?: string
          identity_verified?: boolean | null
          identity_verified_at?: string | null
          income_verified?: boolean | null
          income_verified_at?: string | null
          is_smoker?: boolean | null
          job_title?: string | null
          move_in_date?: string | null
          national_insurance_number?: string | null
          nationality?: string | null
          pet_details?: string | null
          phone?: string | null
          previous_address?: string | null
          profile_complete?: boolean
          profile_completion_percentage?: number | null
          references_verified?: boolean | null
          references_verified_at?: string | null
          sort_code?: string | null
          tenant_references?: string | null
          time_at_current_address?: string | null
          updated_at?: string
          user_type?: string | null
          visa_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_sensitive: {
        Row: {
          account_holder_name: string | null
          annual_income: number | null
          bank_name: string | null
          created_at: string
          credit_score: number | null
          id: string
          national_insurance_number: string | null
          sort_code: string | null
          updated_at: string
        }
        Insert: {
          account_holder_name?: string | null
          annual_income?: number | null
          bank_name?: string | null
          created_at?: string
          credit_score?: number | null
          id: string
          national_insurance_number?: string | null
          sort_code?: string | null
          updated_at?: string
        }
        Update: {
          account_holder_name?: string | null
          annual_income?: number | null
          bank_name?: string | null
          created_at?: string
          credit_score?: number | null
          id?: string
          national_insurance_number?: string | null
          sort_code?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_sensitive_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          bathrooms: number | null
          bedrooms: number | null
          created_at: string
          description: string | null
          furnished: boolean | null
          id: string
          images: string[] | null
          landlord_id: string
          location: string | null
          price: number | null
          property_type: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          furnished?: boolean | null
          id?: string
          images?: string[] | null
          landlord_id: string
          location?: string | null
          price?: number | null
          property_type?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          furnished?: boolean | null
          id?: string
          images?: string[] | null
          landlord_id?: string
          location?: string | null
          price?: number | null
          property_type?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_landlord_id_fkey"
            columns: ["landlord_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reference_check_applications: {
        Row: {
          contact_consent: boolean | null
          created_at: string
          credit_check_consent: boolean | null
          declaration_date: string | null
          digital_signature: string | null
          employer_contact_email: string | null
          employer_contact_phone: string | null
          employment_type: string | null
          financial_explanation: string | null
          guarantor_address: string | null
          guarantor_annual_income: number | null
          guarantor_employer_name: string | null
          guarantor_id_url: string | null
          guarantor_job_title: string | null
          guarantor_name: string | null
          guarantor_proof_address_url: string | null
          guarantor_relationship: string | null
          has_ccj_iva_bankruptcy: boolean | null
          has_guarantor: boolean | null
          id: string
          immigration_status: string | null
          information_consent: boolean | null
          monthly_rent_paid: number | null
          photo_id_url: string | null
          previous_landlord_email: string | null
          previous_landlord_name: string | null
          previous_landlord_phone: string | null
          previous_property_address: string | null
          proof_of_address_url: string | null
          proof_of_income_urls: string[] | null
          right_to_rent_document_url: string | null
          status: string
          tenancy_end_date: string | null
          tenancy_start_date: string | null
          updated_at: string
          user_id: string
          visa_permit_url: string | null
        }
        Insert: {
          contact_consent?: boolean | null
          created_at?: string
          credit_check_consent?: boolean | null
          declaration_date?: string | null
          digital_signature?: string | null
          employer_contact_email?: string | null
          employer_contact_phone?: string | null
          employment_type?: string | null
          financial_explanation?: string | null
          guarantor_address?: string | null
          guarantor_annual_income?: number | null
          guarantor_employer_name?: string | null
          guarantor_id_url?: string | null
          guarantor_job_title?: string | null
          guarantor_name?: string | null
          guarantor_proof_address_url?: string | null
          guarantor_relationship?: string | null
          has_ccj_iva_bankruptcy?: boolean | null
          has_guarantor?: boolean | null
          id?: string
          immigration_status?: string | null
          information_consent?: boolean | null
          monthly_rent_paid?: number | null
          photo_id_url?: string | null
          previous_landlord_email?: string | null
          previous_landlord_name?: string | null
          previous_landlord_phone?: string | null
          previous_property_address?: string | null
          proof_of_address_url?: string | null
          proof_of_income_urls?: string[] | null
          right_to_rent_document_url?: string | null
          status?: string
          tenancy_end_date?: string | null
          tenancy_start_date?: string | null
          updated_at?: string
          user_id: string
          visa_permit_url?: string | null
        }
        Update: {
          contact_consent?: boolean | null
          created_at?: string
          credit_check_consent?: boolean | null
          declaration_date?: string | null
          digital_signature?: string | null
          employer_contact_email?: string | null
          employer_contact_phone?: string | null
          employment_type?: string | null
          financial_explanation?: string | null
          guarantor_address?: string | null
          guarantor_annual_income?: number | null
          guarantor_employer_name?: string | null
          guarantor_id_url?: string | null
          guarantor_job_title?: string | null
          guarantor_name?: string | null
          guarantor_proof_address_url?: string | null
          guarantor_relationship?: string | null
          has_ccj_iva_bankruptcy?: boolean | null
          has_guarantor?: boolean | null
          id?: string
          immigration_status?: string | null
          information_consent?: boolean | null
          monthly_rent_paid?: number | null
          photo_id_url?: string | null
          previous_landlord_email?: string | null
          previous_landlord_name?: string | null
          previous_landlord_phone?: string | null
          previous_property_address?: string | null
          proof_of_address_url?: string | null
          proof_of_income_urls?: string[] | null
          right_to_rent_document_url?: string | null
          status?: string
          tenancy_end_date?: string | null
          tenancy_start_date?: string | null
          updated_at?: string
          user_id?: string
          visa_permit_url?: string | null
        }
        Relationships: []
      }
      reference_check_submissions: {
        Row: {
          account_holder_name: string | null
          additional_notes: string | null
          annual_income: number | null
          bank_name: string | null
          created_at: string
          credit_score: number | null
          current_address: string | null
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          employer_address: string | null
          employer_name: string | null
          employment_start_date: string | null
          employment_status: string | null
          full_name: string | null
          has_pets: boolean | null
          id: string
          is_smoker: boolean | null
          job_title: string | null
          notification_sent_at: string | null
          pet_details: string | null
          phone: string | null
          previous_address: string | null
          sort_code: string | null
          status: string
          time_at_current_address: string | null
          updated_at: string
          user_id: string
          verification_completed_at: string | null
          verification_scheduled_for: string | null
        }
        Insert: {
          account_holder_name?: string | null
          additional_notes?: string | null
          annual_income?: number | null
          bank_name?: string | null
          created_at?: string
          credit_score?: number | null
          current_address?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employer_address?: string | null
          employer_name?: string | null
          employment_start_date?: string | null
          employment_status?: string | null
          full_name?: string | null
          has_pets?: boolean | null
          id?: string
          is_smoker?: boolean | null
          job_title?: string | null
          notification_sent_at?: string | null
          pet_details?: string | null
          phone?: string | null
          previous_address?: string | null
          sort_code?: string | null
          status?: string
          time_at_current_address?: string | null
          updated_at?: string
          user_id: string
          verification_completed_at?: string | null
          verification_scheduled_for?: string | null
        }
        Update: {
          account_holder_name?: string | null
          additional_notes?: string | null
          annual_income?: number | null
          bank_name?: string | null
          created_at?: string
          credit_score?: number | null
          current_address?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employer_address?: string | null
          employer_name?: string | null
          employment_start_date?: string | null
          employment_status?: string | null
          full_name?: string | null
          has_pets?: boolean | null
          id?: string
          is_smoker?: boolean | null
          job_title?: string | null
          notification_sent_at?: string | null
          pet_details?: string | null
          phone?: string | null
          previous_address?: string | null
          sort_code?: string | null
          status?: string
          time_at_current_address?: string | null
          updated_at?: string
          user_id?: string
          verification_completed_at?: string | null
          verification_scheduled_for?: string | null
        }
        Relationships: []
      }
      tenant_documents: {
        Row: {
          created_at: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          rejection_reason: string | null
          tenant_id: string
          updated_at: string | null
          verification_status: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          rejection_reason?: string | null
          tenant_id: string
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          rejection_reason?: string | null
          tenant_id?: string
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      tenant_references: {
        Row: {
          company_name: string | null
          contact_email: string | null
          contact_name: string
          contact_phone: string | null
          created_at: string | null
          id: string
          notes: string | null
          reference_period: string | null
          reference_type: string
          relationship: string | null
          tenant_id: string
          updated_at: string | null
          verification_status: string | null
          verified_at: string | null
        }
        Insert: {
          company_name?: string | null
          contact_email?: string | null
          contact_name: string
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          reference_period?: string | null
          reference_type: string
          relationship?: string | null
          tenant_id: string
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Update: {
          company_name?: string | null
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          reference_period?: string | null
          reference_type?: string
          relationship?: string | null
          tenant_id?: string
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          onboarding_complete: boolean | null
          user_type: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          onboarding_complete?: boolean | null
          user_type?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          onboarding_complete?: boolean | null
          user_type?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      verifications: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          provider: string
          provider_ref: string | null
          status: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          provider: string
          provider_ref?: string | null
          status: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          provider?: string
          provider_ref?: string | null
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          event_type: string | null
          id: number
          payload: Json | null
          provider: string
          received_at: string | null
        }
        Insert: {
          event_type?: string | null
          id?: number
          payload?: Json | null
          provider: string
          received_at?: string | null
        }
        Update: {
          event_type?: string | null
          id?: number
          payload?: Json | null
          provider?: string
          received_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
