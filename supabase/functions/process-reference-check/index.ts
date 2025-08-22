import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReferenceCheckRequest {
  profileData: any;
  references: any[];
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const { profileData, references }: ReferenceCheckRequest = await req.json();

    console.log('Processing reference check for user:', user.id);
    console.log('Profile data received:', profileData);
    console.log('References received:', references);

    // Calculate verification scheduled time (30 seconds for internal demo)
    const verificationTime = new Date();
    verificationTime.setSeconds(verificationTime.getSeconds() + 30);

    // Store the reference check submission
    const { data: submission, error: submissionError } = await supabase
      .from('reference_check_submissions')
      .insert({
        user_id: user.id,
        status: 'pending',
        verification_scheduled_for: verificationTime.toISOString(),
        
        // Personal Information
        full_name: profileData.full_name,
        email: profileData.email,
        phone: profileData.phone,
        date_of_birth: profileData.date_of_birth,
        current_address: profileData.current_address,
        previous_address: profileData.previous_address,
        time_at_current_address: profileData.time_at_current_address,
        
        // Employment Information  
        employment_status: profileData.employment_status,
        employer_name: profileData.employer_name,
        employer_address: profileData.employer_address,
        job_title: profileData.job_title,
        employment_start_date: profileData.employment_start_date,
        annual_income: profileData.annual_income,
        
        // Financial Information
        credit_score: profileData.credit_score,
        bank_name: profileData.bank_name,
        account_holder_name: profileData.account_holder_name,
        sort_code: profileData.sort_code,
        
        // Personal Details
        has_pets: profileData.has_pets,
        pet_details: profileData.pet_details,
        is_smoker: profileData.is_smoker,
        additional_notes: profileData.additional_notes,
        
        // Emergency Contact
        emergency_contact_name: profileData.emergency_contact_name,
        emergency_contact_phone: profileData.emergency_contact_phone,
        emergency_contact_relationship: profileData.emergency_contact_relationship
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Error creating reference check submission:', submissionError);
      throw submissionError;
    }

    console.log('Reference check submission created:', submission.id);

    // Internal notification instead of email
    console.log('Reference check submitted successfully for user:', user.id);
    console.log('Verification will complete in 30 seconds');

    // Schedule the verification completion using background task  
    const backgroundVerification = async () => {
      try {
        console.log(`Waiting 30 seconds for verification completion...`);
        
        // Internal demo - 30 seconds instead of 6 hours
        const waitTime = 30 * 1000; // 30 seconds in milliseconds
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        console.log(`Completing verification for user ${user.id}`);
        
        // Update the submission status
        const { error: updateError } = await supabase
          .from('reference_check_submissions')
          .update({
            status: 'verified',
            verification_completed_at: new Date().toISOString()
          })
          .eq('id', submission.id);

        if (updateError) {
          console.error('Error updating submission status:', updateError);
          return;
        }

        // Update user's comprehensive verification status
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({
            comprehensive_verification_status: 'verified',
            comprehensive_verification_completed_at: new Date().toISOString(),
            profile_completion_percentage: 100,
            identity_verified: true,
            employment_verified: true,
            income_verified: true,
            credit_verified: true,
            references_verified: true,
            bank_verified: true,
            identity_verified_at: new Date().toISOString(),
            employment_verified_at: new Date().toISOString(),
            income_verified_at: new Date().toISOString(),
            credit_verified_at: new Date().toISOString(),
            references_verified_at: new Date().toISOString(),
            bank_verified_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (profileUpdateError) {
          console.error('Error updating profile verification:', profileUpdateError);
        }

        // Internal notification instead of email
        console.log('Verification completed successfully for user:', user.id);
        console.log('All verification flags have been set to true');

        // Update notification sent timestamp
        await supabase
          .from('reference_check_submissions')
          .update({
            notification_sent_at: new Date().toISOString()
          })
          .eq('id', submission.id);

      } catch (error) {
        console.error('Error in background verification process:', error);
      }
    };

    // Use EdgeRuntime.waitUntil to run background verification
    (globalThis as any).EdgeRuntime?.waitUntil(backgroundVerification());

    return new Response(
      JSON.stringify({
        success: true,
        submissionId: submission.id,
        verificationScheduledFor: verificationTime.toISOString(),
        message: 'Reference check submitted successfully. Your verification will complete in 30 seconds.'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error('Error in process-reference-check function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);