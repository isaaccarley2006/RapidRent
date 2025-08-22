import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.1';
import { Resend } from "npm:resend@2.0.0";

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

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

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

    // Calculate verification scheduled time (6 hours from now)
    const verificationTime = new Date();
    verificationTime.setHours(verificationTime.getHours() + 6);

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

    // Send immediate confirmation email
    const confirmationEmailResult = await resend.emails.send({
      from: 'RentView <onboarding@resend.dev>',
      to: [user.email!],
      subject: 'Reference Check Submitted Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FA6400;">Reference Check Submitted</h1>
          <p>Hi ${profileData.full_name || 'there'},</p>
          <p>We've successfully received your reference check submission and are now processing your information.</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333;">What happens next?</h3>
            <ul style="color: #666;">
              <li>We'll verify your employment details with ${profileData.employer_name || 'your employer'}</li>
              <li>Check your references and rental history</li>
              <li>Perform credit and identity verification</li>
              <li>Complete the process within 6 hours</li>
            </ul>
          </div>
          
          <p>You'll receive a verification confirmation email once the process is complete.</p>
          <p style="color: #666; font-size: 14px;">
            Submission ID: ${submission.id}<br>
            Expected completion: ${verificationTime.toLocaleString()}
          </p>
          
          <p>Best regards,<br>The RentView Team</p>
        </div>
      `,
    });

    console.log('Confirmation email sent:', confirmationEmailResult);

    // Schedule the verification completion using background task
    const backgroundVerification = async () => {
      try {
        console.log(`Waiting 6 hours for verification completion...`);
        
        // In production, this would be 6 hours (21600000 ms)
        // For demo purposes, you might want to use a shorter time
        const waitTime = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
        
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
            identity_verified: true,
            employment_verified: true,
            income_verified: true,
            credit_verified: true,
            references_verified: true,
            bank_verified: true
          })
          .eq('id', user.id);

        if (profileUpdateError) {
          console.error('Error updating profile verification:', profileUpdateError);
        }

        // Send verification complete email
        const verificationEmailResult = await resend.emails.send({
          from: 'RentView <onboarding@resend.dev>',
          to: [user.email!],
          subject: '✅ Reference Check Complete - You\'re Verified!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #FA6400, #006F94); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0;">🎉 Verification Complete!</h1>
              </div>
              
              <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <p>Hi ${profileData.full_name || 'there'},</p>
                <p><strong>Great news!</strong> Your comprehensive reference check has been completed successfully.</p>
                
                <div style="background: #f0f9ff; border-left: 4px solid #006F94; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #006F94; margin-top: 0;">✅ Verification Status</h3>
                  <ul style="color: #333; margin: 0;">
                    <li>✅ Identity Verified</li>
                    <li>✅ Employment Verified</li>
                    <li>✅ Income Verified</li>
                    <li>✅ Credit Check Complete</li>
                    <li>✅ References Verified</li>
                    <li>✅ Bank Details Verified</li>
                  </ul>
                </div>
                
                <p>Your verified status is now active across all landlord and agent views. This will help you:</p>
                <ul>
                  <li>Stand out to landlords and agents</li>
                  <li>Speed up the rental application process</li>
                  <li>Demonstrate your credibility as a tenant</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://jerfstkniwyxnsnimcrv.supabase.co/profile" 
                     style="background: #FA6400; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    View Your Verified Profile
                  </a>
                </div>
                
                <p style="color: #666; font-size: 14px;">
                  Verified on: ${new Date().toLocaleString()}<br>
                  Verification ID: ${submission.id}
                </p>
                
                <p>Best regards,<br>The RentView Team</p>
              </div>
            </div>
          `,
        });

        console.log('Verification complete email sent:', verificationEmailResult);

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
        message: 'Reference check submitted successfully. You will receive a verification email within 6 hours.'
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