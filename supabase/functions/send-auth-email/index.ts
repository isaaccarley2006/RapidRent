import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface AuthHookPayload {
  user: {
    email: string
  }
  email_data: {
    token: string
    token_hash: string
    redirect_to: string
    email_action_type: string
    site_url: string
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("🚀 Auth hook function called")
    const payload = await req.json()
    console.log("🔍 Full auth hook payload:", JSON.stringify(payload, null, 2))
    
    // Handle different payload structures
    let userEmail: string
    let token: string
    let emailActionType: string
    
    // Check if this is the expected auth hook structure
    if (payload.user && payload.email_data) {
      // Standard auth hook format
      userEmail = payload.user.email
      token = payload.email_data.token
      emailActionType = payload.email_data.email_action_type
    } else if (payload.email && payload.token) {
      // Alternative format
      userEmail = payload.email
      token = payload.token
      emailActionType = payload.type || 'signup'
    } else {
      console.error("❌ Unknown payload structure:", payload)
      throw new Error("Invalid payload structure")
    }
    
    console.log(`📧 Processing ${emailActionType} email for ${userEmail} with token ${token}`)

    let subject = ""
    let html = ""

    switch (emailActionType) {
      case 'signup':
        subject = "Verify your email - RentView"
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Welcome to RentView!</h1>
            <p style="color: #666; font-size: 16px;">Thank you for signing up. Please use the verification code below to complete your registration:</p>
            
            <div style="background-color: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h2 style="color: #333; font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 0;">${token}</h2>
            </div>
            
            <p style="color: #666; font-size: 14px;">This code will expire in 60 seconds.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this verification, you can safely ignore this email.</p>
            
            <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">
              This email was sent by RentView. If you have any questions, please contact our support team.
            </p>
          </div>
        `
        break
        
      case 'recovery':
        subject = "Reset your password - RentView"
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Password Reset</h1>
            <p style="color: #666; font-size: 16px;">You requested to reset your password. Please use the verification code below:</p>
            
            <div style="background-color: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h2 style="color: #333; font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 0;">${token}</h2>
            </div>
            
            <p style="color: #666; font-size: 14px;">This code will expire in 60 seconds.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this password reset, you can safely ignore this email.</p>
          </div>
        `
        break
        
      default:
        console.log(`ℹ️ Using default template for type: ${emailActionType}`)
        subject = "Email Verification - RentView"
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Email Verification</h1>
            <p style="color: #666; font-size: 16px;">Please use the verification code below:</p>
            
            <div style="background-color: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h2 style="color: #333; font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 0;">${token}</h2>
            </div>
            
            <p style="color: #666; font-size: 14px;">This code will expire in 60 seconds.</p>
          </div>
        `
    }

    console.log(`📤 Sending email to ${userEmail} with subject: ${subject}`)

    const emailResponse = await resend.emails.send({
      from: "RentView <onboarding@resend.dev>",
      to: [userEmail],
      subject,
      html,
    })

    console.log("✅ Auth email sent successfully:", emailResponse)

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    })
  } catch (error: any) {
    console.error("💥 Error in send-auth-email function:", error)
    console.error("Stack trace:", error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    )
  }
}

serve(handler)